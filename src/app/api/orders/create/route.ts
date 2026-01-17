import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { Order, OrderItem } from '@/types/restaurant';

// POST - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, tableId, items, customerId } = body;

    if (!businessId || !tableId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'businessId, tableId, and items are required' },
        { status: 400 }
      );
    }

    // Verify business exists
    const businessDoc = await db.collection('businesses').doc(businessId).get();
    if (!businessDoc.exists) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Verify table exists
    const tableDoc = await db
      .collection('businesses')
      .doc(businessId)
      .collection('tables')
      .doc(tableId)
      .get();

    if (!tableDoc.exists) {
      return NextResponse.json(
        { error: 'Table not found' },
        { status: 404 }
      );
    }

    const tableData = tableDoc.data();
    const tableNumber = tableData?.number || tableId;

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: OrderItem) => sum + item.unitPrice * item.quantity,
      0
    );
    const tax = Math.round(subtotal * 0.1); // 10% tax (configurable)
    const tip = 0;
    const total = subtotal + tax + tip;

    // Create order
    const ordersRef = db.collection('businesses').doc(businessId).collection('orders');
    const now = new Date();

    const orderData: Omit<Order, 'id'> = {
      businessId,
      tableId,
      tableNumber,
      status: 'open',
      items: items.map((item: any) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        notes: item.notes,
        status: 'pending' as const,
      })),
      subtotal,
      tax,
      tip,
      total,
      customerId,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await ordersRef.add(orderData);

    // Update table with current order
    await tableDoc.ref.update({
      currentOrderId: docRef.id,
      updatedAt: now,
    });

    // Publish real-time update
    try {
      const { publishToCentrifugo } = await import('@/lib/centrifugo/publish');
      await publishToCentrifugo(`org:${businessId}:orders`, {
        type: 'order_created',
        order: {
          id: docRef.id,
          ...orderData,
        },
      });

      await publishToCentrifugo(`org:${businessId}:kitchen`, {
        type: 'order_created',
        order: {
          id: docRef.id,
          ...orderData,
        },
      });
    } catch (error) {
      console.error('Failed to publish to Centrifugo:', error);
      // Don't fail the request if Centrifugo fails
    }

    return NextResponse.json({
      id: docRef.id,
      ...orderData,
    });
  } catch (error) {
    console.error('[orders create POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
