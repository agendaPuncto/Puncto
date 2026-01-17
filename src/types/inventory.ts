import { Timestamp } from 'firebase/firestore';

export type InventoryMovementType = 'in' | 'out' | 'adjustment' | 'waste' | 'transfer';

export interface InventoryItem {
  id: string;
  businessId: string;
  name: string;
  sku?: string;
  category: string; // "ingredients", "supplies", "equipment"
  unit: string; // "kg", "L", "unit", "box"
  currentStock: number;
  minStock: number; // Alert threshold
  maxStock?: number;
  cost: number; // Average cost in cents
  supplierId?: string;
  location?: string; // Storage location
  expiryDate?: Timestamp | Date;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface InventoryMovement {
  id: string;
  businessId: string;
  itemId: string;
  type: InventoryMovementType;
  quantity: number;
  unitCost?: number; // Cost per unit in cents
  reason?: string;
  purchaseOrderId?: string;
  orderId?: string; // If consumed by order
  createdBy: string;
  createdAt: Timestamp | Date;
}
