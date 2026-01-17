import { Timestamp } from 'firebase/firestore';

export interface ApiKey {
  id: string;
  businessId: string;
  name: string;
  keyPrefix: string; // First 8 chars for identification
  hashedKey: string; // Full hashed key
  active: boolean;
  lastUsedAt?: Timestamp | Date;
  expiresAt?: Timestamp | Date;
  createdAt: Timestamp | Date;
  createdBy: string;
}

export interface RateLimit {
  apiKeyId: string;
  requests: number;
  windowStart: Date;
}

export interface ApiKeyUsage {
  apiKeyId: string;
  endpoint: string;
  method: string;
  timestamp: Timestamp | Date;
  statusCode: number;
  responseTime: number;
}
