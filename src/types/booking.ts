import { Timestamp } from 'firebase/firestore';

export interface CustomerData {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
}

export interface Reminders {
  whatsappSent?: Timestamp | Date;
  emailSent?: Timestamp | Date;
  smsSent?: Timestamp | Date;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface Booking {
  id: string;
  businessId: string;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  locationId: string;
  locationName?: string;
  scheduledDate: string;
  scheduledTime: string;
  scheduledDateTime: Timestamp | Date;
  durationMinutes: number;
  endDateTime: Timestamp | Date;
  customerId?: string;
  customerData: CustomerData;
  status: BookingStatus;
  price: number;
  currency: string;
  notes?: string;
  reminders: Reminders;
  cancelledAt?: Timestamp | Date;
  cancelledBy?: string;
  cancellationReason?: string;
  customFields?: Record<string, any>;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  createdBy?: string;
}

export interface Customer {
  id: string;
  businessId: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  lastBookingAt?: Timestamp | Date;
  preferredProfessionalIds?: string[];
  notes?: string;
  consentGiven: boolean;
  consentDate?: Timestamp | Date;
  dataExportRequested?: Timestamp | Date;
  deletionRequested?: Timestamp | Date;
  customFields?: Record<string, any>;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}
