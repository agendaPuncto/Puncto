'use client';

import { useMemo } from 'react';
import { Booking } from '@/types/booking';
import { format, subDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsDashboardProps {
  stats: {
    totalBookings: number;
    confirmedBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    noShows: number;
    occupancyRate: number;
    totalRevenue: number;
  };
  bookings: Booking[];
}

const COLORS = ['#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#6366f1'];

export function AnalyticsDashboard({ stats, bookings }: AnalyticsDashboardProps) {
  const dailyBookings = useMemo(() => {
    const daysMap = new Map();
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();

    last7Days.forEach((day) => {
      const dayKey = format(day, 'yyyy-MM-dd');
      daysMap.set(dayKey, 0);
    });

    bookings.forEach((booking) => {
      const bookingDate = booking.scheduledDateTime instanceof Date
        ? booking.scheduledDateTime
        : new Date(booking.scheduledDateTime as any);
      const dayKey = format(bookingDate, 'yyyy-MM-dd');
      if (daysMap.has(dayKey)) {
        daysMap.set(dayKey, daysMap.get(dayKey) + 1);
      }
    });

    return Array.from(daysMap.entries()).map(([date, count]) => ({
      date: format(new Date(date), 'dd/MM'),
      bookings: count,
    }));
  }, [bookings]);

  const statusData = [
    { name: 'Confirmados', value: stats.confirmedBookings },
    { name: 'Concluídos', value: stats.completedBookings },
    { name: 'Cancelados', value: stats.cancelledBookings },
    { name: 'Não compareceu', value: stats.noShows },
    { name: 'Pendentes', value: stats.totalBookings - stats.confirmedBookings - stats.completedBookings - stats.cancelledBookings - stats.noShows },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <p className="text-sm text-neutral-600">Total de Agendamentos</p>
          <p className="text-3xl font-bold mt-2">{stats.totalBookings}</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <p className="text-sm text-neutral-600">Taxa de Ocupação</p>
          <p className="text-3xl font-bold mt-2">{stats.occupancyRate}%</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <p className="text-sm text-neutral-600">Receita Total</p>
          <p className="text-3xl font-bold mt-2">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalRevenue / 100)}
          </p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <p className="text-sm text-neutral-600">Taxa de Comparecimento</p>
          <p className="text-3xl font-bold mt-2">
            {stats.totalBookings > 0
              ? Math.round(((stats.completedBookings / (stats.completedBookings + stats.noShows)) || 0) * 100)
              : 0}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <h3 className="text-lg font-semibold mb-4">Agendamentos nos Últimos 7 Dias</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyBookings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <h3 className="text-lg font-semibold mb-4">Status dos Agendamentos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
