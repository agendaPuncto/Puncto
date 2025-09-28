'use client';
import React, { useMemo, useState } from "react";

// ---------------------- Tipos & Mock ----------------------

type Service = {
  id: string;
  name: string;
  price: number;
  durationMin: number;
  description?: string;
  professionalIds: string[];
};

type Professional = {
  id: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  rating?: number;
  specialties?: string[];
};

type Business = {
  id: string;
  displayName: string;
  about: string;
  address: string;
  phone?: string;
  coverUrl?: string;
  gallery: string[];
  rating: number;
  reviewsCount: number;
};

const mockBusiness: Business = {
  id: "org_demo",
  displayName: "Studio Lumière — Beleza & Estética",
  about:
    "Serviços de corte, coloração, manicure e estética. Atendimento com hora marcada, conforto e equipe premiada.",
  address: "Av. Central, 1234 — Curitiba/PR",
  phone: "+55 41 99999-9999",
  coverUrl:
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop",
  gallery: [
    "https://images.unsplash.com/photo-1519415387722-a1c3bbef7161?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop",
  ],
  rating: 4.8,
  reviewsCount: 327,
};

const mockProfessionals: Professional[] = [
  { id: "p1", name: "Andreia Santos", bio: "Colorista sênior e técnicas de mechas avançadas.", avatarUrl: "https://i.pravatar.cc/150?img=47", rating: 4.9, specialties: ["Coloração", "Luzes", "Tonalização"] },
  { id: "p2", name: "Rafael Costa", bio: "Cortes masculinos & barbearia clássica.", avatarUrl: "https://i.pravatar.cc/150?img=12", rating: 4.7, specialties: ["Corte masculino", "Navalha"] },
  { id: "p3", name: "Bianca Moreira", bio: "Design de sobrancelhas e maquiagem para eventos.", avatarUrl: "https://i.pravatar.cc/150?img=32", rating: 4.8, specialties: ["Sobrancelhas", "Make up"] },
];

const mockServices: Service[] = [
  { id: "s1", name: "Corte Feminino", price: 9500, durationMin: 60, description: "Consultoria + corte personalizado.", professionalIds: ["p1", "p3"] },
  { id: "s2", name: "Coloração", price: 22000, durationMin: 120, description: "Coloração completa com tonalização.", professionalIds: ["p1"] },
  { id: "s3", name: "Corte Masculino", price: 6000, durationMin: 45, description: "Máquina + tesoura, acabamento.", professionalIds: ["p2"] },
  { id: "s4", name: "Sobrancelhas", price: 4500, durationMin: 30, description: "Design + finalização.", professionalIds: ["p3"] },
];

const mockAvailability: Record<string, string[]> = {
  p1: ["09:00", "09:30", "10:00", "14:00", "14:30", "16:00"],
  p2: ["09:00", "11:30", "15:00", "15:30", "16:00"],
  p3: ["10:30", "11:00", "13:00", "13:30", "17:00"],
};

// ---------------------- Helpers ----------------------

const money = (cents: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

const formatDate = (d: Date) =>
  d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" });

// ---------------------- Componente Principal ----------------------

const BookingPublicPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"book" | "gallery" | "reviews">("book");
  const [filterMode, setFilterMode] = useState<"service" | "pro">("service");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedPro, setSelectedPro] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const visibleServices = React.useMemo(() => {
    if (filterMode === "service" || !selectedPro) return mockServices;
    return mockServices.filter((s) => s.professionalIds.includes(selectedPro));
  }, [filterMode, selectedPro]);

  const visibleProfessionals = React.useMemo(() => {
    if (filterMode === "pro" || !selectedService) return mockProfessionals;
    const svc = mockServices.find((s) => s.id === selectedService);
    if (!svc) return mockProfessionals;
    return mockProfessionals.filter((p) => svc.professionalIds.includes(p.id));
  }, [filterMode, selectedService]);

  const timeSlots = React.useMemo(() => {
    const proId =
      filterMode === "pro"
        ? selectedPro
        : selectedPro || mockServices.find((s) => s.id === selectedService)?.professionalIds[0];
    if (!proId) return [];
    return mockAvailability[proId] || [];
  }, [filterMode, selectedPro, selectedService]);

  const currentService = React.useMemo(() => mockServices.find((s) => s.id === selectedService) || null, [selectedService]);
  const currentPro = React.useMemo(() => mockProfessionals.find((p) => p.id === selectedPro) || null, [selectedPro]);

  function canContinueStep1() {
    if (filterMode === "service") return Boolean(selectedService && (selectedPro || currentService?.professionalIds.length));
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
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const id = Math.random().toString(36).slice(2);
      setCreatedId(id);
      setStep(5);
    } finally {
      setLoading(false);
    }
  }

  // ---------------------- UI ----------------------

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Top Cover */}
      <div className="relative h-56 w-full overflow-hidden">
        <img src={mockBusiness.coverUrl} alt={mockBusiness.displayName} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Header */}
      <header className="mx-auto -mt-14 max-w-6xl px-4">
        <div className="rounded-2xl bg-white p-5 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{mockBusiness.displayName}</h1>
              <p className="mt-1 text-sm text-neutral-600">{mockBusiness.address}</p>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800">★ {mockBusiness.rating}</span>
                <span className="text-neutral-500">({mockBusiness.reviewsCount} avaliações)</span>
                <span className="text-neutral-400">•</span>
                <a href={`tel:${mockBusiness.phone}`} className="text-blue-600 hover:underline">{mockBusiness.phone}</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50">Entrar (opcional)</button>
              <button className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800">Continuar como convidado</button>
            </div>
          </div>

          {/* Sobre */}
          <div className="mt-5">
            <h2 className="text-base font-medium">Sobre</h2>
            <p className="mt-2 text-sm text-neutral-700">{mockBusiness.about}</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="mx-auto mt-6 max-w-6xl px-4">
        <div className="flex gap-2">
          {[
            { key: "book", label: "Agendar" },
            { key: "gallery", label: "Galeria" },
            { key: "reviews", label: "Avaliações" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`rounded-xl px-4 py-2 text-sm ${activeTab === t.key ? "bg-neutral-900 text-white" : "border"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <main className="mx-auto mt-4 max-w-6xl px-4 pb-24">
        {activeTab === "book" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {/* Left: Seleção e Steps */}
            <section className="md:col-span-7">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                {/* Toggle de filtro */}
                <div className="mb-4 flex gap-2">
                  <button onClick={() => setFilterMode("service")} className={`rounded-xl px-4 py-2 text-sm ${filterMode === "service" ? "bg-neutral-900 text-white" : "border"}`}>Filtrar por Serviço</button>
                  <button onClick={() => setFilterMode("pro")} className={`rounded-xl px-4 py-2 text-sm ${filterMode === "pro" ? "bg-neutral-900 text-white" : "border"}`}>Filtrar por Profissional</button>
                </div>

                {/* Listas */}
                {filterMode === "service" ? (
                  <div>
                    <h3 className="mb-3 text-base font-medium">Serviços</h3>
                    <ul className="space-y-3">
                      {visibleServices.map((s) => (
                        <li key={s.id} className={`flex items-center justify-between rounded-xl border p-4 ${selectedService === s.id ? "ring-2 ring-neutral-900" : ""}`}>
                          <div>
                            <div className="text-sm font-medium">{s.name}</div>
                            <div className="text-xs text-neutral-600">{money(s.price)} • {s.durationMin} min</div>
                            {s.description && <p className="mt-1 text-xs text-neutral-600">{s.description}</p>}
                          </div>
                          <button onClick={() => { setSelectedService(s.id); if (!selectedPro && s.professionalIds.length) setSelectedPro(s.professionalIds[0]); }} className="rounded-lg bg-neutral-900 px-3 py-2 text-xs text-white">{selectedService === s.id ? "Selecionado" : "Selecionar"}</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div>
                    <h3 className="mb-3 text-base font-medium">Profissionais</h3>
                    <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {visibleProfessionals.map((p) => (
                        <li key={p.id} className={`rounded-xl border p-4 ${selectedPro === p.id ? "ring-2 ring-neutral-900" : ""}`}>
                          <div className="flex items-center gap-3">
                            <img src={p.avatarUrl} alt={p.name} className="h-12 w-12 rounded-full object-cover" />
                            <div>
                              <div className="text-sm font-medium">{p.name}</div>
                              <div className="text-xs text-neutral-600">★ {p.rating?.toFixed(1)} • {p.specialties?.join(", ")}</div>
                            </div>
                          </div>
                          <div className="mt-3 flex justify-between">
                            <button onClick={() => setSelectedPro(p.id)} className="rounded-lg bg-neutral-900 px-3 py-2 text-xs text-white">{selectedPro === p.id ? "Selecionado" : "Selecionar"}</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {selectedPro && (
                      <div className="mt-5">
                        <h4 className="mb-2 text-sm font-medium">Serviços compatíveis</h4>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                          {visibleServices.filter((s) => s.professionalIds.includes(selectedPro)).map((s) => (
                            <button key={s.id} onClick={() => setSelectedService(s.id)} className={`rounded-lg border p-3 text-left text-sm hover:bg-neutral-50 ${selectedService === s.id ? "ring-2 ring-neutral-900" : ""}`}>
                              <div className="font-medium">{s.name}</div>
                              <div className="text-xs text-neutral-600">{money(s.price)} • {s.durationMin} min</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <button onClick={onBack} className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50" disabled={step === 1}>Voltar</button>
                  <button onClick={onContinue} className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50" disabled={!canContinueStep1()}>Continuar</button>
                </div>
              </div>

              {/* Data/Horário */}
              {step >= 2 && (
                <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-base font-medium">Escolha a data e o horário</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="text-xs text-neutral-600">Data</label>
                      <input type="date" min={new Date().toISOString().slice(0, 10)} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs text-neutral-600">Horários disponíveis</label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {timeSlots.length === 0 && <span className="text-sm text-neutral-500">Selecione um serviço/profissional para ver os horários.</span>}
                        {timeSlots.map((t) => (
                          <button key={t} onClick={() => setSelectedTime(t)} className={`rounded-lg border px-3 py-2 text-xs ${selectedTime === t ? "bg-neutral-900 text-white" : "hover:bg-neutral-50"}`}>{t}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <button onClick={onBack} className="rounded-xl border px-4 py-2 text-sm">Voltar</button>
                    <button onClick={onContinue} className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50" disabled={!selectedTime}>Continuar</button>
                  </div>
                </div>
              )}

              {/* Dados do Cliente */}
              {step >= 3 && (
                <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-base font-medium">Seus dados</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs text-neutral-600">Nome</label>
                      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Seu nome" className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-600">Sobrenome</label>
                      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Seu sobrenome" className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs text-neutral-600">Telefone (WhatsApp)</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(DDD) 9 0000-0000" className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs text-neutral-600">Comentários (opcional)</label>
                      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Alguma observação (ex.: alergias, preferências)?" className="mt-1 h-24 w-full rounded-xl border px-3 py-2 text-sm" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <button onClick={onBack} className="rounded-xl border px-4 py-2 text-sm">Voltar</button>
                    <button onClick={onContinue} className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50" disabled={!firstName || !lastName || !phone}>Revisar</button>
                  </div>
                </div>
              )}

              {/* Revisão */}
              {step >= 4 && (
                <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-base font-medium">Revise seu agendamento</h3>
                  <ul className="space-y-2 text-sm">
                    <li><span className="text-neutral-500">Serviço:</span> {currentService?.name}</li>
                    <li><span className="text-neutral-500">Profissional:</span> {currentPro?.name}</li>
                    <li><span className="text-neutral-500">Data:</span> {formatDate(new Date(selectedDate))}</li>
                    <li><span className="text-neutral-500">Horário:</span> {selectedTime}</li>
                    <li><span className="text-neutral-500">Preço:</span> {currentService ? money(currentService.price) : "—"}</li>
                  </ul>
                  <div className="mt-4 text-sm">
                    <p>
                      Ao continuar, você concorda com a <a className="text-blue-600 hover:underline" href="#">política de cancelamento</a> do estabelecimento.
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <button onClick={onBack} className="rounded-xl border px-4 py-2 text-sm">Voltar</button>
                    <button onClick={submitBooking} className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50" disabled={loading}>{loading ? "Enviando..." : "Confirmar agendamento"}</button>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="mb-2 text-base font-medium">Agendamento criado! 🎉</h3>
                  <p className="text-sm text-neutral-700">Enviamos uma confirmação para seu WhatsApp/e‑mail. Código da reserva: <span className="font-mono">{createdId}</span></p>
                  <div className="mt-4"><a href="#" className="text-sm text-blue-600 hover:underline">Ver meus agendamentos</a></div>
                </div>
              )}
            </section>

            {/* Right: Informações rápidas */}
            <aside className="md:col-span-5">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="text-base font-medium">Informações</h3>
                <ul className="mt-2 space-y-2 text-sm text-neutral-700">
                  <li><span className="text-neutral-500">Endereço:</span> {mockBusiness.address}</li>
                  <li><span className="text-neutral-500">Telefone:</span> {mockBusiness.phone}</li>
                  <li><span className="text-neutral-500">Horário:</span> Seg–Sáb 9h–19h</li>
                  <li><span className="text-neutral-500">Política de cancelamento:</span> até 24h antes sem custo</li>
                </ul>
              </div>
            </aside>
          </div>
        )}

        {activeTab === "gallery" && (
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-base font-medium">Galeria de fotos</h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {mockBusiness.gallery.map((src, i) => (
                <img key={i} src={src} alt={`galeria-${i}`} className="h-40 w-full rounded-xl object-cover md:h-56" />
              ))}
            </div>
          </section>
        )}

        {activeTab === "reviews" && (
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="text-base font-medium">Avaliações ({mockBusiness.reviewsCount})</h3>
            <div className="mt-3 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="rounded-xl border p-3">
                  <div className="flex items-center gap-2">
                    <img className="h-8 w-8 rounded-full" src={`https://i.pravatar.cc/100?img=${10 + i}`} alt="" />
                    <div className="text-sm font-medium">Cliente {i}</div>
                    <div className="ml-auto text-xs text-amber-600">★★★★★</div>
                  </div>
                  <p className="mt-2 text-sm text-neutral-700">Atendimento excelente, pontuais e atenciosos. Recomendo!</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default BookingPublicPage;