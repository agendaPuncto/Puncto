'use client';

import { useEffect, useCallback } from 'react';
import { useCentrifugo } from '@/components/providers/CentrifugoProvider';

/**
 * Hook to subscribe to real-time updates via Centrifugo
 */
export function useRealtime(channel: string, onUpdate: (data: any) => void) {
  const { subscribe, connected } = useCentrifugo();

  useEffect(() => {
    if (!connected) {
      return;
    }

    const unsubscribe = subscribe(channel, onUpdate);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [channel, onUpdate, subscribe, connected]);
}

/**
 * Hook for real-time booking updates
 */
export function useRealtimeBookings(orgId: string, onBookingUpdate: (booking: any) => void) {
  const { subscribe, connected } = useCentrifugo();

  useEffect(() => {
    if (!connected || !orgId) {
      return;
    }

    const channel = `org:${orgId}:bookings`;
    const unsubscribe = subscribe(channel, (data) => {
      if (data.type === 'booking.created' || data.type === 'booking.updated' || data.type === 'booking.deleted') {
        onBookingUpdate(data.booking);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [orgId, onBookingUpdate, subscribe, connected]);
}
