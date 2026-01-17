import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { Supplier } from '@/types/purchases';

// GET - List all suppliers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json(
        { error: 'businessId is required' },
        { status: 400 }
      );
    }

    const suppliersRef = db.collection('businesses').doc(businessId).collection('suppliers');
    const snapshot = await suppliersRef.where('active', '==', true).orderBy('name', 'asc').get();
    
    const suppliers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ suppliers });
  } catch (error) {
    console.error('[suppliers GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suppliers' },
      { status: 500 }
    );
  }
}

// POST - Create a new supplier
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, supplier } = body;

    if (!businessId || !supplier) {
      return NextResponse.json(
        { error: 'businessId and supplier are required' },
        { status: 400 }
      );
    }

    if (!supplier.name) {
      return NextResponse.json(
        { error: 'Supplier name is required' },
        { status: 400 }
      );
    }

    const suppliersRef = db.collection('businesses').doc(businessId).collection('suppliers');
    const now = new Date();

    const supplierData: Omit<Supplier, 'id'> = {
      businessId,
      name: supplier.name,
      contactName: supplier.contactName,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      taxId: supplier.taxId,
      paymentTerms: supplier.paymentTerms,
      active: supplier.active !== undefined ? supplier.active : true,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await suppliersRef.add(supplierData);

    return NextResponse.json({
      id: docRef.id,
      ...supplierData,
    });
  } catch (error) {
    console.error('[suppliers POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create supplier' },
      { status: 500 }
    );
  }
}
