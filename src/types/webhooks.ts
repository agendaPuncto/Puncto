import { Timestamp } from 'firebase/firestore';

export type WebhookEvent =
  | 'booking.created'
  | 'booking.updated'
  | 'booking.cancelled'
  | 'booking.completed'
  | 'payment.succeeded'
  | 'payment.failed'
  | 'payment.refunded'
  | 'order.created'
  | 'order.updated'
  | 'order.paid'
  | 'customer.created'
  | 'customer.updated';

export interface Webhook {
  id: string;
  businessId: string;
  url: string;
  events: WebhookEvent[];
  secret: string; // HMAC secret for signature verification
  active: boolean;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  businessId: string;
  event: WebhookEvent;
  payload: Record<string, any>;
  status: 'pending' | 'success' | 'failed';
  attempts: number;
  maxAttempts: number;
  responseCode?: number;
  responseBody?: string;
  error?: string;
  deliveredAt?: Timestamp | Date;
  nextRetryAt?: Timestamp | Date;
  createdAt: Timestamp | Date;
}

export interface WebhookSubscription {
  webhookId: string;
  event: WebhookEvent;
}
