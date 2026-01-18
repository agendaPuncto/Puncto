// A/B Testing Framework
// Simple client-side A/B testing with analytics integration

import { trackEvent } from '@/components/analytics/GoogleAnalytics';

export interface Experiment {
  id: string;
  name: string;
  variants: Variant[];
  traffic: number; // Percentage of traffic to include (0-100)
  startDate?: Date;
  endDate?: Date;
}

export interface Variant {
  id: string;
  name: string;
  weight: number; // Relative weight for distribution
}

// Storage key prefix
const AB_STORAGE_PREFIX = 'puncto_ab_';

// Get or assign variant for an experiment
export function getVariant(experiment: Experiment): Variant | null {
  if (typeof window === 'undefined') {
    return null;
  }

  // Check if experiment is active
  const now = new Date();
  if (experiment.startDate && now < experiment.startDate) return null;
  if (experiment.endDate && now > experiment.endDate) return null;

  // Check if user is in traffic allocation
  const trafficKey = `${AB_STORAGE_PREFIX}traffic_${experiment.id}`;
  let isInTraffic = localStorage.getItem(trafficKey);
  
  if (isInTraffic === null) {
    isInTraffic = Math.random() * 100 < experiment.traffic ? 'true' : 'false';
    localStorage.setItem(trafficKey, isInTraffic);
  }

  if (isInTraffic !== 'true') {
    return null; // User not in experiment traffic
  }

  // Get or assign variant
  const variantKey = `${AB_STORAGE_PREFIX}variant_${experiment.id}`;
  let assignedVariantId = localStorage.getItem(variantKey);

  if (!assignedVariantId) {
    // Assign variant based on weights
    const totalWeight = experiment.variants.reduce((sum, v) => sum + v.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const variant of experiment.variants) {
      random -= variant.weight;
      if (random <= 0) {
        assignedVariantId = variant.id;
        break;
      }
    }
    
    if (assignedVariantId) {
      localStorage.setItem(variantKey, assignedVariantId);
      
      // Track experiment assignment
      trackExperimentAssignment(experiment.id, assignedVariantId);
    }
  }

  return experiment.variants.find(v => v.id === assignedVariantId) || null;
}

// Track when user is assigned to an experiment
function trackExperimentAssignment(experimentId: string, variantId: string) {
  trackEvent('experiment_assignment', 'ab_testing', `${experimentId}:${variantId}`);
  
  // Also set as user property for segmentation
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', {
      [`exp_${experimentId}`]: variantId,
    });
  }
}

// Track conversion for an experiment
export function trackExperimentConversion(experimentId: string, conversionName: string, value?: number) {
  const variantKey = `${AB_STORAGE_PREFIX}variant_${experimentId}`;
  const variantId = localStorage.getItem(variantKey);
  
  if (variantId) {
    trackEvent(
      'experiment_conversion',
      'ab_testing',
      `${experimentId}:${variantId}:${conversionName}`,
      value
    );
  }
}

// React hook for A/B testing
import { useState, useEffect } from 'react';

export function useExperiment(experiment: Experiment): {
  variant: Variant | null;
  isLoading: boolean;
} {
  const [variant, setVariant] = useState<Variant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const assignedVariant = getVariant(experiment);
    setVariant(assignedVariant);
    setIsLoading(false);
  }, [experiment]);

  return { variant, isLoading };
}

// Predefined experiments
export const experiments = {
  heroHeadline: {
    id: 'hero_headline_v1',
    name: 'Hero Headline Test',
    traffic: 100,
    variants: [
      { id: 'control', name: 'Control', weight: 50 },
      { id: 'variant_a', name: 'Variant A - Action Focus', weight: 50 },
    ],
  } as Experiment,

  pricingLayout: {
    id: 'pricing_layout_v1',
    name: 'Pricing Page Layout',
    traffic: 100,
    variants: [
      { id: 'control', name: 'Control - Cards', weight: 50 },
      { id: 'variant_a', name: 'Variant A - Table', weight: 50 },
    ],
  } as Experiment,

  ctaColor: {
    id: 'cta_color_v1',
    name: 'CTA Button Color',
    traffic: 100,
    variants: [
      { id: 'primary', name: 'Primary Blue', weight: 33 },
      { id: 'secondary', name: 'Secondary Green', weight: 33 },
      { id: 'accent', name: 'Accent Orange', weight: 34 },
    ],
  } as Experiment,

  signupFlow: {
    id: 'signup_flow_v1',
    name: 'Signup Flow Test',
    traffic: 50, // Only 50% of users
    variants: [
      { id: 'control', name: 'Control - Standard', weight: 50 },
      { id: 'variant_a', name: 'Variant A - Simplified', weight: 50 },
    ],
  } as Experiment,
};

// Utility to render different content based on variant
export function renderVariant<T>(
  variant: Variant | null,
  variants: Record<string, T>,
  defaultContent: T
): T {
  if (!variant) return defaultContent;
  return variants[variant.id] ?? defaultContent;
}

// Admin function to reset all experiments for a user
export function resetAllExperiments() {
  if (typeof window === 'undefined') return;
  
  const keys = Object.keys(localStorage).filter(key => key.startsWith(AB_STORAGE_PREFIX));
  keys.forEach(key => localStorage.removeItem(key));
}

// Admin function to force a specific variant
export function forceVariant(experimentId: string, variantId: string) {
  if (typeof window === 'undefined') return;
  
  const trafficKey = `${AB_STORAGE_PREFIX}traffic_${experimentId}`;
  const variantKey = `${AB_STORAGE_PREFIX}variant_${experimentId}`;
  
  localStorage.setItem(trafficKey, 'true');
  localStorage.setItem(variantKey, variantId);
}
