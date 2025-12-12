import { Timestamp } from 'firebase/firestore';

export type UserType = 'customer' | 'staff' | 'platform_admin';

export interface Dependent {
  id: string;
  name: string;
  relationship: string;
  birthDate?: string;
}

export interface UserPreferences {
  language: string;
  timezone: string;
}

export interface CustomClaims {
  platformAdmin?: boolean;
  businessRoles?: {
    [businessId: string]: 'owner' | 'manager' | 'professional';
  };
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  type: UserType;
  customClaims: CustomClaims;
  phone?: string;
  preferences: UserPreferences;
  dependents?: Dependent[];
  createdAt: Timestamp | Date;
  lastLoginAt: Timestamp | Date;
  consentVersion?: string;
  marketingConsent?: boolean;
}

export interface PlatformAdmin {
  id: string;
  userId: string;
  role: 'super_admin' | 'support' | 'analyst';
  permissions: {
    accessAllBusinesses: boolean;
    manageSubscriptions: boolean;
    viewAuditLogs: boolean;
    manageSupportTickets: boolean;
    manageFeatureFlags: boolean;
  };
  active: boolean;
  createdAt: Timestamp | Date;
}

export interface AuditLog {
  id: string;
  timestamp: Timestamp | Date;
  userId: string;
  userEmail: string;
  businessId?: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  businessIdTimestamp?: string;
}

export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TicketMessage {
  id: string;
  userId: string;
  message: string;
  timestamp: Timestamp | Date;
  attachments?: string[];
}

export interface SupportTicket {
  id: string;
  businessId: string;
  createdBy: string;
  assignedTo?: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  messages: TicketMessage[];
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  resolvedAt?: Timestamp | Date;
}
