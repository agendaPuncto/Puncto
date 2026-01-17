import { Timestamp, GeoPoint } from 'firebase/firestore';

export type ClockInType = 'in' | 'out' | 'break_start' | 'break_end';

export interface ClockIn {
  id: string;
  businessId: string;
  userId: string;
  type: ClockInType;
  timestamp: Timestamp | Date;
  location?: GeoPoint | { lat: number; lng: number };
  deviceId?: string;
  ipAddress?: string;
  validated: boolean;
  validatedBy?: string;
  validatedAt?: Timestamp | Date;
  notes?: string;
  createdAt: Timestamp | Date;
}

export type ShiftStatus = 'active' | 'completed' | 'adjusted';

export interface Shift {
  id: string;
  businessId: string;
  userId: string;
  startTime: Timestamp | Date;
  endTime?: Timestamp | Date;
  breakDuration?: number; // minutes
  totalHours?: number; // Calculated
  overtimeHours?: number;
  status: ShiftStatus;
  clockIns: string[]; // Array of clockIn IDs
  createdAt: Timestamp | Date;
}

export interface ShiftSchedule {
  id: string;
  businessId: string;
  userId: string;
  startDate: Timestamp | Date;
  endDate?: Timestamp | Date;
  dayOfWeek?: number; // 0-6 for recurring
  startTime: string; // "09:00"
  endTime: string; // "18:00"
  breakDuration: number; // minutes
  locationId?: string;
  active: boolean;
  createdAt: Timestamp | Date;
}
