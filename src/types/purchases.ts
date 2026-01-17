import { Timestamp } from 'firebase/firestore';
import { Address } from './business';

export interface Supplier {
  id: string;
  businessId: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: Address;
  taxId?: string;
  paymentTerms?: string; // "30 days", "COD"
  active: boolean;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export type PurchaseOrderStatus = 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';

export interface PurchaseOrderItem {
  inventoryItemId?: string;
  name: string;
  quantity: number;
  unit: string;
  unitCost: number; // in cents
  total: number; // in cents
}

export interface PurchaseOrder {
  id: string;
  businessId: string;
  supplierId: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  subtotal: number; // in cents
  tax: number; // in cents
  total: number; // in cents
  expectedDeliveryDate?: Timestamp | Date;
  receivedAt?: Timestamp | Date;
  createdAt: Timestamp | Date;
  createdBy: string;
  updatedAt: Timestamp | Date;
}
