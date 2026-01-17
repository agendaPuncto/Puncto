import { Timestamp } from 'firebase/firestore';
import { Business, Professional, Service } from './business';

export interface MarketplaceProfessional {
  professionalId: string;
  businessId: string;
  businessName: string;
  businessSlug: string;
  professionalName: string;
  avatarUrl?: string;
  bio?: string;
  specialties: string[];
  rating?: number;
  totalReviews?: number;
  location?: {
    city: string;
    state: string;
    coordinates?: { lat: number; lng: number };
  };
  services: Array<{
    serviceId: string;
    serviceName: string;
    price: number;
    durationMinutes: number;
  }>;
  marketplaceEnabled: boolean;
}

export interface MarketplaceEstablishment {
  businessId: string;
  businessName: string;
  businessSlug: string;
  displayName: string;
  industry: string;
  address: {
    city: string;
    state: string;
    coordinates?: { lat: number; lng: number };
  };
  branding: {
    logoUrl?: string;
    coverUrl?: string;
  };
  rating?: number;
  reviewsCount?: number;
  about?: string;
  services: Array<{
    serviceId: string;
    serviceName: string;
    price: number;
    category?: string;
  }>;
  professionals: Array<{
    professionalId: string;
    professionalName: string;
    specialties: string[];
    rating?: number;
  }>;
  marketplaceEnabled: boolean;
  marketplaceProfile?: {
    description?: string;
    tags?: string[];
    featured?: boolean;
    verified?: boolean;
  };
}

export interface MarketplaceFilters {
  query?: string;
  location?: {
    city?: string;
    state?: string;
    radius?: number; // in km
    coordinates?: { lat: number; lng: number };
  };
  serviceType?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  rating?: number;
  sortBy?: 'rating' | 'price' | 'distance' | 'name';
  featured?: boolean;
  verified?: boolean;
}

export interface MarketplaceSearchResult {
  professionals: MarketplaceProfessional[];
  establishments: MarketplaceEstablishment[];
  total: number;
  page: number;
  limit: number;
}
