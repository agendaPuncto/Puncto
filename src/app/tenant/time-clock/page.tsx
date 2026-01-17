'use client';

import { useState } from 'react';
import { useBusiness } from '@/lib/contexts/BusinessContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { ClockInType } from '@/types/timeClock';

export default function TimeClockPage() {
  const { business } = useBusiness();
  const { user } = useAuth();
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastClockIn, setLastClockIn] = useState<{ type: ClockInType; timestamp: Date } | null>(null);

  const handleClockIn = async (type: ClockInType) => {
    if (!business?.id || !user?.uid) return;

    try {
      setIsSubmitting(true);

      // Get geolocation if available
      let location = undefined;
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        } catch (error) {
          console.warn('Failed to get geolocation:', error);
        }
      }

      const res = await fetch('/api/time-clock/clock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          userId: user.uid,
          type,
          location,
          deviceId: 'web',
          ipAddress: 'unknown',
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to clock in/out');
      }

      const data = await res.json();
      setLastClockIn({
        type,
        timestamp: new Date(data.timestamp),
      });
      setPin('');
    } catch (error) {
      console.error('Failed to clock in/out:', error);
      alert('Erro ao registrar ponto. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Ponto Eletrônico</h1>

        {lastClockIn && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              {lastClockIn.type === 'in' && 'Entrada registrada'}
              {lastClockIn.type === 'out' && 'Saída registrada'}
              {lastClockIn.type === 'break_start' && 'Início de intervalo registrado'}
              {lastClockIn.type === 'break_end' && 'Fim de intervalo registrado'}
            </p>
            <p className="text-xs text-green-600 mt-1">
              {lastClockIn.timestamp.toLocaleString('pt-BR')}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => handleClockIn('in')}
            disabled={isSubmitting}
            className="w-full rounded-lg bg-green-600 px-6 py-4 text-lg font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            Entrada
          </button>

          <button
            onClick={() => handleClockIn('break_start')}
            disabled={isSubmitting}
            className="w-full rounded-lg bg-yellow-600 px-6 py-4 text-lg font-semibold text-white hover:bg-yellow-700 disabled:opacity-50"
          >
            Início Intervalo
          </button>

          <button
            onClick={() => handleClockIn('break_end')}
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-6 py-4 text-lg font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Fim Intervalo
          </button>

          <button
            onClick={() => handleClockIn('out')}
            disabled={isSubmitting}
            className="w-full rounded-lg bg-red-600 px-6 py-4 text-lg font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            Saída
          </button>
        </div>
      </div>
    </div>
  );
}
