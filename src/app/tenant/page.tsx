'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBusiness } from '@/lib/contexts/BusinessContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { Service, Professional } from '@/types';

// Helper functions
const money = (cents: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);

const formatDate = (d: Date) =>
  d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });

export default function BookingPage() {
  const router = useRouter();
  const { business } = useBusiness();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'book' | 'gallery' | 'reviews'>('book');
  const [filterMode, setFilterMode] = useState<'service' | 'pro'>('service');

  // Debug logging
  useEffect(() => {
    console.log('[BookingPage] User state:', user);
    console.log('[BookingPage] User logged in:', !!user);
    if (user) {
      console.log('[BookingPage] User display name:', user.displayName);
      console.log('[BookingPage] User email:', user.email);
    }
  }, [user]);

  // Data from Firestore
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking flow state
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedPro, setSelectedPro] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  // Fetch services and professionals from Firestore
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch services
        const servicesRef = collection(db, 'businesses', business.id, 'services');
        const servicesQuery = query(servicesRef, where('active', '==', true));
        const servicesSnap = await getDocs(servicesQuery);
        const servicesData = servicesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Service));
        setServices(servicesData);

        // Fetch professionals
        const prosRef = collection(db, 'businesses', business.id, 'professionals');
        const prosQuery = query(prosRef, where('active', '==', true), where('canBookOnline', '==', true));
        const prosSnap = await getDocs(prosQuery);
        const prosData = prosSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Professional));
        setProfessionals(prosData);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [business.id]);

  // Auto-fill customer data if user is logged in
  useEffect(() => {
    console.log('[Auto-fill] User changed:', user);
    if (user && user.displayName) {
      console.log('[Auto-fill] Display name found:', user.displayName);
      const nameParts = user.displayName.split(' ');
      const first = nameParts[0] || '';
      const last = nameParts.slice(1).join(' ') || '';
      console.log('[Auto-fill] Setting firstName:', first, 'lastName:', last);
      setFirstName(first);
      setLastName(last);
    } else {
      console.log('[Auto-fill] No user or no display name');
    }
  }, [user]);

  // Filter services based on selected professional
  const visibleServices = React.useMemo(() => {
    if (filterMode === 'service' || !selectedPro) return services;
    return services.filter(s => s.professionalIds.includes(selectedPro));
  }, [filterMode, selectedPro, services]);

  // Filter professionals based on selected service
  const visibleProfessionals = React.useMemo(() => {
    if (filterMode === 'pro' || !selectedService) return professionals;
    const svc = services.find(s => s.id === selectedService);
    if (!svc) return professionals;
    return professionals.filter(p => svc.professionalIds.includes(p.id));
  }, [filterMode, selectedService, professionals, services]);

  // Mock time slots (in real app, would check availability in Firestore)
  const timeSlots = React.useMemo(() => {
    // For now, return mock slots - will be replaced with real availability checking
    return ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  }, [selectedPro, selectedService]);

  const currentService = React.useMemo(() =>
    services.find(s => s.id === selectedService) || null,
    [selectedService, services]
  );

  const currentPro = React.useMemo(() =>
    professionals.find(p => p.id === selectedPro) || null,
    [selectedPro, professionals]
  );

  function canContinueStep1() {
    if (filterMode === 'service') return Boolean(selectedService && (selectedPro || currentService?.professionalIds.length));
    return Boolean(selectedPro && (selectedService || visibleServices.length));
  }

  function onContinue() {
    if (step === 1 && canContinueStep1()) setStep(2);
    else if (step === 2 && selectedTime) setStep(3);
    else if (step === 3 && firstName && lastName && phone) setStep(4);
  }

  function onBack() {
    if (step > 1) setStep(step - 1);
  }

  async function submitBooking() {
    if (!currentService || !currentPro) {
      console.error('[submitBooking] Missing service or professional');
      return;
    }

    console.log('[submitBooking] Starting booking submission...');
    console.log('[submitBooking] User:', user);
    console.log('[submitBooking] Customer data:', { firstName, lastName, phone });

    setSubmitting(true);
    try {
      // Create booking in Firestore
      const bookingsRef = collection(db, 'businesses', business.id, 'bookings');

      const bookingData = {
        businessId: business.id,
        serviceId: currentService.id,
        serviceName: currentService.name,
        professionalId: currentPro.id,
        professionalName: currentPro.name,
        locationId: currentPro.locationIds[0] || '', // Default to first location
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
        scheduledDateTime: Timestamp.fromDate(new Date(`${selectedDate}T${selectedTime}`)),
        durationMinutes: currentService.durationMinutes,
        endDateTime: Timestamp.fromDate(
          new Date(new Date(`${selectedDate}T${selectedTime}`).getTime() + currentService.durationMinutes * 60000)
        ),
        customerId: user?.id || null, // Link to user account if logged in
        customerData: {
          firstName,
          lastName,
          phone,
          email: user?.email || '',
        },
        status: 'pending',
        price: currentService.price,
        currency: currentService.currency,
        notes,
        reminders: {},
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      console.log('[submitBooking] Booking data:', bookingData);

      const docRef = await addDoc(bookingsRef, bookingData);
      console.log('[submitBooking] Booking created with ID:', docRef.id);

      setCreatedId(docRef.id);
      setStep(5);
    } catch (error) {
      console.error('[submitBooking] Error creating booking:', error);
      alert('Erro ao criar agendamento. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-900 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Top Cover */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={business.branding.coverUrl || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop'}
          alt={business.displayName}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Header */}
      <header className="mx-auto -mt-14 max-w-6xl px-4">
        <div className="rounded-2xl bg-white p-5 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{business.displayName}</h1>
              <p className="mt-1 text-sm text-neutral-600">
                {business.address.street}, {business.address.number} — {business.address.city}/{business.address.state}
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm">
                {business.rating && (
                  <>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800">
                      ★ {business.rating.toFixed(1)}
                    </span>
                    <span className="text-neutral-500">({business.reviewsCount} avaliações)</span>
                    <span className="text-neutral-400">•</span>
                  </>
                )}
                <a href={`tel:${business.phone}`} className="text-blue-600 hover:underline">
                  {business.phone}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="text-sm">
                    <span className="text-neutral-600">Olá, </span>
                    <span className="font-medium">{user.displayName || user.email}</span>
                  </div>
                  <button
                    onClick={async () => {
                      await logout();
                      router.refresh();
                    }}
                    className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/auth/login"
                    className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50 inline-block"
                  >
                    Entrar
                  </a>
                  <a
                    href="/auth/signup"
                    className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800 inline-block"
                  >
                    Criar conta
                  </a>
                </>
              )}
            </div>
          </div>

          {/* About */}
          <div className="mt-5">
            <h2 className="text-base font-medium">Sobre</h2>
            <p className="mt-2 text-sm text-neutral-700">{business.about}</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="mx-auto mt-6 max-w-6xl px-4">
        <div className="flex gap-2">
          {[
            { key: 'book' as const, label: 'Agendar' },
            { key: 'gallery' as const, label: 'Galeria' },
            { key: 'reviews' as const, label: 'Avaliações' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`rounded-xl px-4 py-2 text-sm ${
                activeTab === t.key ? 'bg-neutral-900 text-white' : 'border'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto mt-4 max-w-6xl px-4 pb-24">
        {activeTab === 'book' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {/* Left: Booking Flow */}
            <section className="md:col-span-7">
              {step < 5 && (
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  {/* Filter Toggle */}
                  <div className="mb-4 flex gap-2">
                    <button
                      onClick={() => setFilterMode('service')}
                      className={`rounded-xl px-4 py-2 text-sm ${
                        filterMode === 'service' ? 'bg-neutral-900 text-white' : 'border'
                      }`}
                    >
                      Filtrar por Serviço
                    </button>
                    <button
                      onClick={() => setFilterMode('pro')}
                      className={`rounded-xl px-4 py-2 text-sm ${
                        filterMode === 'pro' ? 'bg-neutral-900 text-white' : 'border'
                      }`}
                    >
                      Filtrar por Profissional
                    </button>
                  </div>

                  {/* Services or Professionals List */}
                  {filterMode === 'service' ? (
                    <div>
                      <h3 className="mb-3 text-base font-medium">Serviços</h3>
                      {visibleServices.length === 0 ? (
                        <p className="text-sm text-neutral-500">Nenhum serviço disponível.</p>
                      ) : (
                        <ul className="space-y-3">
                          {visibleServices.map(s => (
                            <li
                              key={s.id}
                              className={`flex items-center justify-between rounded-xl border p-4 ${
                                selectedService === s.id ? 'ring-2 ring-neutral-900' : ''
                              }`}
                            >
                              <div>
                                <div className="text-sm font-medium">{s.name}</div>
                                <div className="text-xs text-neutral-600">
                                  {money(s.price)} • {s.durationMinutes} min
                                </div>
                                {s.description && (
                                  <p className="mt-1 text-xs text-neutral-600">{s.description}</p>
                                )}
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedService(s.id);
                                  if (!selectedPro && s.professionalIds.length) {
                                    setSelectedPro(s.professionalIds[0]);
                                  }
                                }}
                                className="rounded-lg bg-neutral-900 px-3 py-2 text-xs text-white"
                              >
                                {selectedService === s.id ? 'Selecionado' : 'Selecionar'}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <div>
                      <h3 className="mb-3 text-base font-medium">Profissionais</h3>
                      {visibleProfessionals.length === 0 ? (
                        <p className="text-sm text-neutral-500">Nenhum profissional disponível.</p>
                      ) : (
                        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          {visibleProfessionals.map(p => (
                            <li
                              key={p.id}
                              className={`rounded-xl border p-4 ${
                                selectedPro === p.id ? 'ring-2 ring-neutral-900' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {p.avatarUrl && (
                                  <img
                                    src={p.avatarUrl}
                                    alt={p.name}
                                    className="h-12 w-12 rounded-full object-cover"
                                  />
                                )}
                                <div>
                                  <div className="text-sm font-medium">{p.name}</div>
                                  <div className="text-xs text-neutral-600">
                                    {p.rating && `★ ${p.rating.toFixed(1)}`}
                                    {p.specialties && p.specialties.length > 0 &&
                                      ` • ${p.specialties.join(', ')}`}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3">
                                <button
                                  onClick={() => setSelectedPro(p.id)}
                                  className="rounded-lg bg-neutral-900 px-3 py-2 text-xs text-white w-full"
                                >
                                  {selectedPro === p.id ? 'Selecionado' : 'Selecionar'}
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={onBack}
                      className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50"
                      disabled={step === 1}
                    >
                      Voltar
                    </button>
                    <button
                      onClick={onContinue}
                      className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50"
                      disabled={!canContinueStep1()}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {/* Date & Time Selection */}
              {step >= 2 && step < 5 && (
                <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-base font-medium">Escolha a data e o horário</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="text-xs text-neutral-600">Data</label>
                      <input
                        type="date"
                        min={new Date().toISOString().slice(0, 10)}
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs text-neutral-600">Horários disponíveis</label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {timeSlots.length === 0 && (
                          <span className="text-sm text-neutral-500">
                            Selecione um serviço/profissional para ver os horários.
                          </span>
                        )}
                        {timeSlots.map(t => (
                          <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={`rounded-lg border px-3 py-2 text-xs ${
                              selectedTime === t ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-50'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <button onClick={onBack} className="rounded-xl border px-4 py-2 text-sm">
                      Voltar
                    </button>
                    <button
                      onClick={onContinue}
                      className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50"
                      disabled={!selectedTime}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {/* Customer Information */}
              {step >= 3 && step < 5 && (
                <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-base font-medium">Seus dados</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs text-neutral-600">Nome</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        placeholder="Seu nome"
                        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-600">Sobrenome</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        placeholder="Seu sobrenome"
                        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs text-neutral-600">Telefone (WhatsApp)</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="(DDD) 9 0000-0000"
                        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs text-neutral-600">Comentários (opcional)</label>
                      <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Alguma observação (ex.: alergias, preferências)?"
                        className="mt-1 h-24 w-full rounded-xl border px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <button onClick={onBack} className="rounded-xl border px-4 py-2 text-sm">
                      Voltar
                    </button>
                    <button
                      onClick={onContinue}
                      className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50"
                      disabled={!firstName || !lastName || !phone}
                    >
                      Revisar
                    </button>
                  </div>
                </div>
              )}

              {/* Review */}
              {step === 4 && (
                <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-base font-medium">Revise seu agendamento</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <span className="text-neutral-500">Serviço:</span> {currentService?.name}
                    </li>
                    <li>
                      <span className="text-neutral-500">Profissional:</span> {currentPro?.name}
                    </li>
                    <li>
                      <span className="text-neutral-500">Data:</span>{' '}
                      {formatDate(new Date(selectedDate))}
                    </li>
                    <li>
                      <span className="text-neutral-500">Horário:</span> {selectedTime}
                    </li>
                    <li>
                      <span className="text-neutral-500">Preço:</span>{' '}
                      {currentService ? money(currentService.price) : '—'}
                    </li>
                  </ul>
                  <div className="mt-4 text-sm">
                    <p>
                      Ao continuar, você concorda com a{' '}
                      <a className="text-blue-600 hover:underline" href="#">
                        política de cancelamento
                      </a>{' '}
                      do estabelecimento.
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <button onClick={onBack} className="rounded-xl border px-4 py-2 text-sm">
                      Voltar
                    </button>
                    <button
                      onClick={submitBooking}
                      className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50"
                      disabled={submitting}
                    >
                      {submitting ? 'Enviando...' : 'Confirmar agendamento'}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirmation */}
              {step === 5 && (
                <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="mb-2 text-base font-medium">Agendamento criado! 🎉</h3>
                  <p className="text-sm text-neutral-700">
                    Enviamos uma confirmação para seu WhatsApp/e‑mail. Código da reserva:{' '}
                    <span className="font-mono">{createdId}</span>
                  </p>
                  <div className="mt-4">
                    <a href="#" className="text-sm text-blue-600 hover:underline">
                      Ver meus agendamentos
                    </a>
                  </div>
                </div>
              )}
            </section>

            {/* Right: Quick Info */}
            <aside className="md:col-span-5">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="text-base font-medium">Informações</h3>
                <ul className="mt-2 space-y-2 text-sm text-neutral-700">
                  <li>
                    <span className="text-neutral-500">Endereço:</span> {business.address.street},{' '}
                    {business.address.number}
                  </li>
                  <li>
                    <span className="text-neutral-500">Telefone:</span> {business.phone}
                  </li>
                  <li>
                    <span className="text-neutral-500">Horário:</span> Seg–Sáb 9h–19h
                  </li>
                  <li>
                    <span className="text-neutral-500">Política de cancelamento:</span> até 24h antes
                    sem custo
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        )}

        {activeTab === 'gallery' && (
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-base font-medium">Galeria de fotos</h3>
            {business.branding.gallery && business.branding.gallery.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {business.branding.gallery.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`galeria-${i}`}
                    className="h-40 w-full rounded-xl object-cover md:h-56"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">Nenhuma foto disponível.</p>
            )}
          </section>
        )}

        {activeTab === 'reviews' && (
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="text-base font-medium">Avaliações ({business.reviewsCount || 0})</h3>
            <div className="mt-3">
              <p className="text-sm text-neutral-500">Sistema de avaliações em breve.</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
