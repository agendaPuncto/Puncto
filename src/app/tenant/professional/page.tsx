'use client';

import { useBusiness } from '@/lib/contexts/BusinessContext';
import { useProfessional } from '@/lib/contexts/ProfessionalContext';
import { useBookings } from '@/lib/queries/bookings';
import { BookingCalendar } from '@/components/admin/BookingCalendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ProfessionalDashboardPage() {
  const { business } = useBusiness();
  const { professional } = useProfessional();

  const { data: bookings } = useBookings(business?.id ?? '', {
    professionalId: professional?.id,
  });

  if (!professional) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-neutral-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Minha agenda</h1>
        <p className="text-neutral-600 mt-1">
          Agendamentos de {format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>
      <BookingCalendar
        bookings={bookings ?? []}
        workingHours={professional.workingHours ?? business?.settings?.workingHours}
        onStatusChange={async () => {}}
      />
    </div>
  );
}
