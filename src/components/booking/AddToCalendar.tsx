'use client';

import React from 'react';
import { downloadICS, CalendarEventData } from '@/lib/calendar/ics';
import { Booking } from '@/types/booking';
import { Business } from '@/types/business';

interface AddToCalendarProps {
  booking: Booking;
  business: Business;
  className?: string;
}

export function AddToCalendar({ booking, business, className = '' }: AddToCalendarProps) {
  const handleAddToCalendar = () => {
    const startDate = booking.scheduledDateTime instanceof Date 
      ? booking.scheduledDateTime 
      : new Date(booking.scheduledDateTime as any);
    
    const endDate = new Date(startDate.getTime() + booking.durationMinutes * 60 * 1000);

    const eventData: CalendarEventData = {
      title: `${booking.serviceName} - ${business.displayName}`,
      description: `Agendamento com ${booking.professionalName}\n\n${booking.notes || ''}`,
      location: business.address 
        ? `${business.address.street}, ${business.address.number} - ${business.address.city}`
        : undefined,
      start: startDate,
      end: endDate,
      organizer: {
        name: business.displayName,
        email: business.email,
      },
      attendees: booking.customerData?.email
        ? [
            {
              name: `${booking.customerData.firstName} ${booking.customerData.lastName}`,
              email: booking.customerData.email,
              rsvp: false,
            },
          ]
        : undefined,
    };

    downloadICS(eventData, `agendamento-${booking.id}.ics`);
  };

  return (
    <button
      onClick={handleAddToCalendar}
      className={`inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      Adicionar ao Calendário
    </button>
  );
}
