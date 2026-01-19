/**
 * Business type definitions and feature mappings
 * Controls which features are available based on business industry/type
 */

import { Business } from '@/types/business';

/**
 * Business type enum
 * Maps to the `industry` field in Business model
 */
export type BusinessType = 
  | 'salon'           // Beauty salons, barbershops, nail studios
  | 'clinic'          // Medical, dental, aesthetic, dermatology clinics
  | 'restaurant'      // Restaurants, cafes, food service
  | 'bakery'          // Bakeries, confectioneries (custom orders)
  | 'event'           // Event spaces, venues
  | 'general';        // General service businesses

/**
 * Feature IDs that can be enabled/disabled
 */
export type FeatureId = 
  // Core features
  | 'scheduling'
  | 'payments'
  | 'crm'
  | 'analytics'
  // Restaurant features
  | 'restaurantMenu'
  | 'tableOrdering'
  | 'virtualTabs'
  | 'thermalPrinting'
  // Inventory/ERP features
  | 'inventoryManagement'
  | 'purchaseOrders'
  | 'costCalculation'
  // Time tracking
  | 'timeClock'
  | 'attendanceReports'
  // Marketing
  | 'campaigns'
  | 'loyaltyPrograms'
  | 'customerSegmentation';

/**
 * Feature mapping by business type
 * Defines which features are RELEVANT for each business type
 * Note: This doesn't enforce access - subscription tier still controls availability
 * This is used to hide/show features in the UI and guide users
 */
export const INDUSTRY_FEATURE_MAP: Record<BusinessType, FeatureId[]> = {
  salon: [
    'scheduling',
    'payments',
    'crm',
    'analytics',
    'campaigns',
    'loyaltyPrograms',
    'customerSegmentation',
  ],
  clinic: [
    'scheduling',
    'payments',
    'crm',
    'analytics',
    'campaigns',
    'customerSegmentation',
  ],
  restaurant: [
    'scheduling',
    'payments',
    'restaurantMenu',
    'tableOrdering',
    'virtualTabs',
    'inventoryManagement',
    'purchaseOrders',
    'costCalculation',
    'timeClock',
    'attendanceReports',
    'thermalPrinting',
    'crm',
    'analytics',
    'campaigns',
    'loyaltyPrograms',
  ],
  bakery: [
    'scheduling',
    'payments',
    'inventoryManagement',
    'purchaseOrders',
    'costCalculation',
    'timeClock',
    'crm',
    'analytics',
  ],
  event: [
    'scheduling',
    'payments',
    'crm',
    'analytics',
    'campaigns',
  ],
  general: [
    'scheduling',
    'payments',
    'crm',
    'analytics',
  ],
};

/**
 * Feature names for UI display
 */
export const FEATURE_LABELS: Record<FeatureId, string> = {
  scheduling: 'Agendamento',
  payments: 'Pagamentos',
  crm: 'CRM e Clientes',
  analytics: 'Relatórios e Analytics',
  restaurantMenu: 'Cardápio Digital',
  tableOrdering: 'Pedidos por Mesa',
  virtualTabs: 'Comanda Virtual',
  thermalPrinting: 'Impressão Térmica',
  inventoryManagement: 'Gestão de Estoque',
  purchaseOrders: 'Pedidos de Compra',
  costCalculation: 'Cálculo de Custos',
  timeClock: 'Ponto Eletrônico',
  attendanceReports: 'Relatórios de Presença',
  campaigns: 'Campanhas Marketing',
  loyaltyPrograms: 'Programas de Fidelidade',
  customerSegmentation: 'Segmentação de Clientes',
};

/**
 * Check if a business type has access to a specific feature
 * This checks both business type relevance AND subscription tier
 */
export function isFeatureRelevantForBusinessType(
  businessType: string,
  featureId: FeatureId
): boolean {
  const type = businessType as BusinessType;
  const features = INDUSTRY_FEATURE_MAP[type] || INDUSTRY_FEATURE_MAP.general;
  return features.includes(featureId);
}

/**
 * Get all features relevant for a business type
 */
export function getFeaturesForBusinessType(businessType: string): FeatureId[] {
  const type = businessType as BusinessType;
  return INDUSTRY_FEATURE_MAP[type] || INDUSTRY_FEATURE_MAP.general;
}

/**
 * Map feature flag keys to feature IDs
 * This helps connect Business.features flags to FeatureId
 */
export const FEATURE_FLAG_MAP: Record<string, FeatureId> = {
  restaurantMenu: 'restaurantMenu',
  tableOrdering: 'tableOrdering',
  virtualTabs: 'virtualTabs',
  thermalPrinting: 'thermalPrinting',
  inventoryManagement: 'inventoryManagement',
  purchaseOrders: 'purchaseOrders',
  costCalculation: 'costCalculation',
  timeClock: 'timeClock',
  attendanceReports: 'attendanceReports',
  campaigns: 'campaigns',
  loyaltyPrograms: 'loyaltyPrograms',
  customerSegmentation: 'customerSegmentation',
};

/**
 * Check if a business has access to a feature
 * Combines subscription tier check + business type relevance + explicit flag
 */
export function hasFeatureAccess(
  business: Business,
  featureKey: keyof Business['features']
): boolean {
  // 1. Check if feature is explicitly enabled in business.features
  const featureFlag = business.features[featureKey];
  if (featureFlag === false) {
    return false; // Explicitly disabled
  }

  // 2. Map feature key to FeatureId if it exists
  const featureId = FEATURE_FLAG_MAP[featureKey];
  if (featureId) {
    // 3. Check if feature is relevant for this business type
    const isRelevant = isFeatureRelevantForBusinessType(business.industry, featureId);
    if (!isRelevant) {
      return false; // Not relevant for this business type
    }
  }

  // 4. Feature flag value determines access (subscription tier already set this)
  return featureFlag === true;
}

/**
 * Get business type display name
 */
export function getBusinessTypeLabel(type: string): string {
  const labels: Record<BusinessType, string> = {
    salon: 'Salão de Beleza',
    clinic: 'Clínica',
    restaurant: 'Restaurante',
    bakery: 'Padaria',
    event: 'Eventos',
    general: 'Serviços Gerais',
  };
  return labels[type as BusinessType] || type;
}

/**
 * Check if a business type is valid
 */
export function isValidBusinessType(type: string): type is BusinessType {
  return ['salon', 'clinic', 'restaurant', 'bakery', 'event', 'general'].includes(type);
}
