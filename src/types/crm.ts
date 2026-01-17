import { Timestamp } from 'firebase/firestore';

export interface CustomerSegment {
  id: string;
  businessId: string;
  name: string; // "VIP", "Frequent", "At Risk"
  criteria: {
    minBookings?: number;
    minSpend?: number;
    lastVisitDays?: number; // Days since last visit
    tags?: string[];
  };
  customerIds: string[]; // Calculated
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export type LoyaltyProgramType = 'points' | 'cashback' | 'tier';

export interface LoyaltyTier {
  name: string;
  minPoints: number;
  benefits: string[];
}

export interface LoyaltyProgram {
  id: string;
  businessId: string;
  name: string;
  type: LoyaltyProgramType;
  rules: {
    pointsPerReal?: number; // 1 point per R$ 1
    pointsPerVisit?: number;
    cashbackPercent?: number;
    tiers?: LoyaltyTier[];
  };
  active: boolean;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export type CampaignType = 'email' | 'whatsapp' | 'sms' | 'push';
export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';

export interface Campaign {
  id: string;
  businessId: string;
  name: string;
  type: CampaignType;
  segmentIds: string[];
  customerIds?: string[];
  template: string;
  scheduledAt?: Timestamp | Date;
  sentAt?: Timestamp | Date;
  status: CampaignStatus;
  stats: {
    sent: number;
    delivered: number;
    opened?: number;
    clicked?: number;
  };
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}
