'use client';

import { ReactNode } from 'react';
import { useFeatureAccess } from '@/lib/hooks/useFeatureAccess';
import { Business } from '@/types/business';

interface FeatureGuardProps {
  /**
   * Feature key to check access for
   */
  feature: keyof Business['features'];
  /**
   * Children to render if feature is accessible
   */
  children: ReactNode;
  /**
   * Optional fallback to render if feature is not accessible
   */
  fallback?: ReactNode;
  /**
   * If true, shows a message when feature is not available
   */
  showMessage?: boolean;
}

/**
 * FeatureGuard Component
 * 
 * Renders children only if the current business has access to the specified feature.
 * Useful for conditionally showing UI elements based on subscription tier and business type.
 * 
 * @example
 * ```tsx
 * <FeatureGuard feature="restaurantMenu">
 *   <RestaurantMenu />
 * </FeatureGuard>
 * ```
 */
export function FeatureGuard({
  feature,
  children,
  fallback = null,
  showMessage = false,
}: FeatureGuardProps) {
  const hasAccess = useFeatureAccess(feature);

  if (!hasAccess) {
    if (showMessage) {
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Esta funcionalidade não está disponível para o seu tipo de negócio ou plano.
          </p>
        </div>
      );
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Higher-order component version of FeatureGuard
 */
export function withFeatureGuard<P extends object>(
  Component: React.ComponentType<P>,
  feature: keyof Business['features'],
  fallback?: ReactNode
) {
  return function FeatureGuardedComponent(props: P) {
    return (
      <FeatureGuard feature={feature} fallback={fallback}>
        <Component {...props} />
      </FeatureGuard>
    );
  };
}
