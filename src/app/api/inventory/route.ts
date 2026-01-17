import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { InventoryItem } from '@/types/inventory';

// GET - List all inventory items
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const businessId = searchParams.get('businessId');
    const category = searchParams.get('category');
    const lowStock = searchParams.get('lowStock') === 'true';

    if (!businessId) {
      return NextResponse.json(
        { error: 'businessId is required' },
        { status: 400 }
      );
    }

    const inventoryRef = db.collection('businesses').doc(businessId).collection('inventory');
    let query: FirebaseFirestore.Query = inventoryRef.orderBy('name', 'asc');

    if (category) {
      query = query.where('category', '==', category);
    }

    const snapshot = await query.get();
    let items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as InventoryItem[];

    // Filter low stock items
    if (lowStock) {
      items = items.filter((item) => item.currentStock <= item.minStock);
    }

    return NextResponse.json({ items });
  } catch (error) {
    console.error('[inventory GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

// POST - Create a new inventory item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, item } = body;

    if (!businessId || !item) {
      return NextResponse.json(
        { error: 'businessId and item are required' },
        { status: 400 }
      );
    }

    if (!item.name || !item.category || !item.unit) {
      return NextResponse.json(
        { error: 'Item name, category, and unit are required' },
        { status: 400 }
      );
    }

    const inventoryRef = db.collection('businesses').doc(businessId).collection('inventory');
    const now = new Date();

    const itemData: Omit<InventoryItem, 'id'> = {
      businessId,
      name: item.name,
      sku: item.sku,
      category: item.category,
      unit: item.unit,
      currentStock: item.currentStock || 0,
      minStock: item.minStock || 0,
      maxStock: item.maxStock,
      cost: Math.round((item.cost || 0) * 100), // Convert to cents
      supplierId: item.supplierId,
      location: item.location,
      expiryDate: item.expiryDate ? new Date(item.expiryDate) : undefined,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await inventoryRef.add(itemData);

    return NextResponse.json({
      id: docRef.id,
      ...itemData,
    });
  } catch (error) {
    console.error('[inventory POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create inventory item' },
      { status: 500 }
    );
  }
}
