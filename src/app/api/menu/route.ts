import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { auth } from '@/lib/firebaseAdmin';
import { Product, MenuCategory } from '@/types/restaurant';

// GET - List all products for a business
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const businessId = searchParams.get('businessId');
    const category = searchParams.get('category');

    if (!businessId) {
      return NextResponse.json(
        { error: 'businessId is required' },
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

    const productsRef = db.collection('businesses').doc(businessId).collection('products');
    let query: FirebaseFirestore.Query = productsRef.orderBy('displayOrder', 'asc').orderBy('name', 'asc');

    if (category) {
      query = query.where('category', '==', category);
    }

    const snapshot = await query.get();
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ products });
  } catch (error) {
    console.error('[menu GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, product } = body;

    if (!businessId || !product) {
      return NextResponse.json(
        { error: 'businessId and product are required' },
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

    // Validate required fields
    if (!product.name || !product.category || product.price === undefined) {
      return NextResponse.json(
        { error: 'Product name, category, and price are required' },
        { status: 400 }
      );
    }

    const productsRef = db.collection('businesses').doc(businessId).collection('products');
    const now = new Date();

    const productData: Omit<Product, 'id'> = {
      businessId,
      name: product.name,
      description: product.description || '',
      category: product.category,
      price: product.price,
      imageUrl: product.imageUrl,
      allergens: product.allergens || [],
      available: product.available !== undefined ? product.available : true,
      variations: product.variations || [],
      cost: product.cost,
      preparationTime: product.preparationTime,
      displayOrder: product.displayOrder || 0,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await productsRef.add(productData);

    return NextResponse.json({
      id: docRef.id,
      ...productData,
    });
  } catch (error) {
    console.error('[menu POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
