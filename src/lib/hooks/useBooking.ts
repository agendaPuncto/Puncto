'use client';

import { useState, useMemo } from 'react';
import { useCreateBooking } from '@/lib/queries/bookings';
import { useServices } from '@/lib/queries/services';
import { useProfessionals } from '@/lib/queries/professionals';
import { useBusiness } from '@/lib/contexts/BusinessContext';
import { format } from 'date-fns';

export function useBookingFlow() {
  const { business } = useBusiness();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedPro, setSelectedPro] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const { data: services } = useServices(business.id, { active: true });
  const { data: professionals } = useProfessionals(business.id, { active: true, canBookOnline: true });
  const createBooking = useCreateBooking(business.id);

  const currentService = useMemo(
    () => services?.find((s) => s.id === selectedService) || null,
    [services, selectedService]
  );

  const currentPro = useMemo(
    () => professionals?.find((p) => p.id === selectedPro) || null,
    [professionals, selectedPro]
  );

  const visibleServices = useMemo(() => {
    if (!selectedPro) return services || [];
    return services?.filter((s) => s.professionalIds.includes(selectedPro)) || [];
  }, [services, selectedPro]);

  const visibleProfessionals = useMemo(() => {
    if (!selectedService) return professionals || [];
    return professionals?.filter((p) => currentService?.professionalIds.includes(p.id)) || [];
  }, [professionals, selectedService, currentService]);

  const handleCreateBooking = async (customerData: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
  }, notes?: string) => {
    if (!currentService || !currentPro || !selectedDate || !selectedTime) {
      throw new Error('Missing booking information');
    }

    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const endDateTime = new Date(scheduledDateTime.getTime() + currentService.durationMinutes * 60 * 1000);

    return await createBooking.mutateAsync({
      businessId: business.id,
      serviceId: currentService.id,
      serviceName: currentService.name,
      professionalId: currentPro.id,
      professionalName: currentPro.name,
      locationId: currentPro.locationIds[0] || '',
      scheduledDate: selectedDate,
      scheduledTime: selectedTime,
      scheduledDateTime,
      durationMinutes: currentService.durationMinutes,
      endDateTime,
      customerData,
      status: 'pending',
      price: currentService.price,
      currency: currentService.currency,
      notes: notes || '',
      reminders: {},
    });
  };

  return {
    services: services || [],
    professionals: professionals || [],
    visibleServices,
    visibleProfessionals,
    selectedService,
    selectedPro,
    selectedDate,
    selectedTime,
    currentService,
    currentPro,
    setSelectedService,
    setSelectedPro,
    setSelectedDate,
    setSelectedTime,
    handleCreateBooking,
    isLoading: createBooking.isPending,
  };
}
