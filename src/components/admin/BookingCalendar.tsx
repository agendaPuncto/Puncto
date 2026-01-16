'use client';

import { useState } from 'react';
import { Booking } from '@/types/booking';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BookingCalendarProps {
  bookings: Booking[];
  onStatusChange: (bookingId: string, status: any) => void;
}

export function BookingCalendar({ bookings, onStatusChange }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { locale: ptBR });
  const calendarEnd = endOfWeek(monthEnd, { locale: ptBR });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getBookingsForDay = (day: Date) => {
    return bookings.filter((booking) => {
      const bookingDate = booking.scheduledDateTime instanceof Date
        ? booking.scheduledDateTime
        : new Date(booking.scheduledDateTime as any);
      return isSameDay(bookingDate, day);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'no_show':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
        >
          ←
        </button>
        <h2 className="text-xl font-semibold">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-neutral-600 py-2">
            {day}
          </div>
        ))}

        {days.map((day, idx) => {
          const dayBookings = getBookingsForDay(day);
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();

          return (
            <div
              key={idx}
              className={`min-h-[100px] border border-neutral-200 rounded-lg p-2 ${
                !isCurrentMonth ? 'bg-neutral-50 opacity-50' : 'bg-white'
              }`}
            >
              <div className="text-sm font-medium mb-1">{format(day, 'd')}</div>
              <div className="space-y-1">
                {dayBookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    className={`text-xs p-1 rounded border ${getStatusColor(booking.status)}`}
                    title={`${booking.serviceName} - ${booking.customerData?.firstName} ${booking.customerData?.lastName}`}
                  >
                    <div className="truncate">
                      {format(
                        booking.scheduledDateTime instanceof Date
                          ? booking.scheduledDateTime
                          : new Date(booking.scheduledDateTime as any),
                        'HH:mm'
                      )}{' '}
                      {booking.serviceName}
                    </div>
                  </div>
                ))}
                {dayBookings.length > 3 && (
                  <div className="text-xs text-neutral-500">+{dayBookings.length - 3} mais</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
