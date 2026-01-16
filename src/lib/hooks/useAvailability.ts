'use client';

import { useQuery } from '@tanstack/react-query';
import { useBusiness } from '@/lib/contexts/BusinessContext';

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export function useAvailability(
  date: string,
  professionalId?: string,
  serviceId?: string
) {
  const { business } = useBusiness();

  return useQuery({
    queryKey: ['availability', business.id, date, professionalId, serviceId],
    queryFn: async () => {
      const params = new URLSearchParams({
        businessId: business.id,
        date,
      });

      if (professionalId) params.append('professionalId', professionalId);
      if (serviceId) params.append('serviceId', serviceId);

      const response = await fetch(`/api/availability?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch availability');
      }

      const data = await response.json();
      return data.slots as TimeSlot[];
    },
    enabled: !!date && !!business.id,
  });
}
