'use client';

import { useMemo, useState } from 'react';
import { addDays, format } from 'date-fns';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getStudentCustomerId } from '@/lib/student/studentSession';
import { useBusiness } from '@/lib/contexts/BusinessContext';
import { useStudentAttendance, useStudentTurmas } from '@/lib/queries/studentPortal';
import {
  useCancelRescheduleRequest,
  useCreateRescheduleRequest,
  useStudentRescheduleRequests,
} from '@/lib/queries/lessonReschedules';
import type { AttendanceRollCall } from '@/types/attendance';

export default function StudentFaltasPage() {
  const { user } = useAuth();
  const { business } = useBusiness();
  const studentCustomerId = getStudentCustomerId(user);
  const { data: attendance = [], isLoading } = useStudentAttendance(business.id, studentCustomerId);
  const { data: turmas = [] } = useStudentTurmas(business.id, studentCustomerId);
  const {
    data: requests = [],
    error: requestsQueryError,
    isError: requestsQueryFailed,
    refetch: refetchRequests,
  } = useStudentRescheduleRequests(business.id, studentCustomerId);
  const createRequest = useCreateRescheduleRequest(business.id);
  const cancelRequest = useCancelRescheduleRequest(business.id);
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceRollCall | null>(null);
  const [requestedDate, setRequestedDate] = useState('');
  const [requestedSlot, setRequestedSlot] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [requestError, setRequestError] = useState<string | null>(null);

  const turmaById = useMemo(() => Object.fromEntries(turmas.map((t) => [t.id, t])), [turmas]);

  const requestByAttendanceId = useMemo(() => {
    const map = new Map<string, (typeof requests)[number]>();
    for (const row of requests) {
      if (!map.has(row.attendanceRollCallId)) {
        map.set(row.attendanceRollCallId, row);
      }
    }
    return map;
  }, [requests]);

  const selectedTurma = selectedAttendance ? turmaById[selectedAttendance.turmaId] : null;
  const selectedSlots = selectedTurma?.schedules || [];

  const openRequestModal = (record: AttendanceRollCall) => {
    setSelectedAttendance(record);
    setRequestReason('');
    setRequestError(null);
    const turma = turmaById[record.turmaId];
    const firstSlot = turma?.schedules?.[0];
    setRequestedSlot(
      firstSlot ? `${firstSlot.startTime}-${firstSlot.endTime}` : '',
    );
    setRequestedDate(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  };

  const closeRequestModal = () => {
    setSelectedAttendance(null);
    setRequestedDate('');
    setRequestedSlot('');
    setRequestReason('');
    setRequestError(null);
  };

  const rescheduleStatusLabel = (status: string) => {
    if (status === 'pending') return 'Pendente de aprovação';
    if (status === 'approved') return 'Aprovada';
    if (status === 'rejected') return 'Reprovada';
    if (status === 'cancelled_by_student') return 'Cancelada por você';
    return status;
  };

  const canCreateRequest = (record: AttendanceRollCall) => {
    if (record.status !== 'absent') return false;
    const request = requestByAttendanceId.get(record.id);
    if (!request) return true;
    return request.status === 'rejected' || request.status === 'cancelled_by_student';
  };

  const submitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAttendance) return;
    if (!requestedDate || !requestedSlot) {
      setRequestError('Selecione data e horário para solicitar a reposição.');
      return;
    }
    const [requestedStartTime, requestedEndTime] = requestedSlot.split('-');
    if (!requestedStartTime || !requestedEndTime) {
      setRequestError('Horário inválido.');
      return;
    }
    try {
      await createRequest.mutateAsync({
        attendanceRollCallId: selectedAttendance.id,
        requestedDate,
        requestedStartTime,
        requestedEndTime,
        professionalId: selectedTurma?.professionalId,
        reason: requestReason.trim() || undefined,
      });
      await refetchRequests();
      closeRequestModal();
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'Erro ao criar solicitação.');
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold text-neutral-900">Minhas faltas</h1>
      {requestsQueryFailed && requestsQueryError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Não foi possível carregar suas solicitações de reposição. Verifique se as regras do Firestore foram
          publicadas e se o projeto do app é o mesmo do Firebase Admin. Detalhes:{' '}
          {requestsQueryError instanceof Error ? requestsQueryError.message : String(requestsQueryError)}
        </div>
      )}
      {isLoading ? (
        <p className="text-sm text-neutral-500">Carregando...</p>
      ) : attendance.length === 0 ? (
        <p className="text-sm text-neutral-500">Sem registros de chamada.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-500">
              <tr>
                <th className="px-4 py-2 text-left">Data</th>
                <th className="px-4 py-2 text-left">Turma</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Reposição</th>
                <th className="px-4 py-2 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((r) => (
                <tr key={r.id} className="border-t border-neutral-100">
                  <td className="px-4 py-2">{r.date}</td>
                  <td className="px-4 py-2">{turmaById[r.turmaId]?.name || r.turmaId}</td>
                  <td className="px-4 py-2">{r.status}</td>
                  <td className="px-4 py-2 text-xs text-neutral-600">
                    {requestByAttendanceId.get(r.id) ? (
                      <div>
                        <p>{rescheduleStatusLabel(requestByAttendanceId.get(r.id)!.status)}</p>
                        <p>
                          {requestByAttendanceId.get(r.id)!.requestedDate} •{' '}
                          {requestByAttendanceId.get(r.id)!.requestedStartTime} -{' '}
                          {requestByAttendanceId.get(r.id)!.requestedEndTime}
                        </p>
                      </div>
                    ) : (
                      'Sem solicitação'
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openRequestModal(r)}
                        disabled={!canCreateRequest(r) || createRequest.isPending}
                        className="rounded-lg border border-neutral-300 px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Solicitar reposição
                      </button>
                      {requestByAttendanceId.get(r.id)?.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() =>
                            cancelRequest.mutate({
                              requestId: requestByAttendanceId.get(r.id)!.id,
                            })
                          }
                          disabled={cancelRequest.isPending}
                          className="rounded-lg border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Cancelar pedido
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedAttendance && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeRequestModal}
          role="presentation"
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            role="dialog"
            aria-labelledby="request-reschedule-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="request-reschedule-title" className="text-lg font-semibold text-neutral-900">
              Solicitar reposição
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Falta em {selectedAttendance.date} • {turmaById[selectedAttendance.turmaId]?.name || 'Turma'}
            </p>

            <form onSubmit={submitRequest} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">Data desejada</label>
                <input
                  type="date"
                  value={requestedDate}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => setRequestedDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">Horário da turma</label>
                <select
                  value={requestedSlot}
                  onChange={(e) => setRequestedSlot(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                >
                  <option value="">Selecione um horário...</option>
                  {selectedSlots.map((slot, idx) => (
                    <option
                      key={`${slot.weekday}-${slot.startTime}-${slot.endTime}-${idx}`}
                      value={`${slot.startTime}-${slot.endTime}`}
                    >
                      {slot.startTime} - {slot.endTime}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">Observação (opcional)</label>
                <textarea
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  placeholder="Ex.: motivo da falta, preferência de reposição..."
                />
              </div>
              {requestError && <p className="text-sm text-red-600">{requestError}</p>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeRequestModal}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  disabled={createRequest.isPending}
                  className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
                >
                  {createRequest.isPending ? 'Enviando...' : 'Enviar solicitação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
