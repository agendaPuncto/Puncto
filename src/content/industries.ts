export const industries = [
  {
    id: 'salons',
    slug: 'salons',
    name: 'Salões de Beleza',
    shortName: 'Salões',
    icon: 'scissors',
    description:
      'Agendamento inteligente, gestão de profissionais e fidelização de clientes para salões e barbearias.',
    longDescription:
      'Transforme a experiência do seu salão com agendamento online 24/7, lembretes automáticos por WhatsApp, gestão de comissões e programa de fidelidade. Reduza no-shows e aumente a receita.',
    benefits: [
      'Agenda online disponível 24 horas',
      'Lembretes automáticos reduzem faltas em até 80%',
      'Gestão de comissões por profissional',
      'Programa de fidelidade integrado',
      'Relatórios de desempenho por colaborador',
    ],
    useCases: [
      'Salões de beleza',
      'Barbearias',
      'Estúdios de nail art',
      'Clínicas de estética',
      'SPAs',
    ],
    stats: {
      reduction: '80%',
      reductionLabel: 'menos no-shows',
      increase: '35%',
      increaseLabel: 'aumento na receita',
    },
    color: 'primary',
  },
  {
    id: 'restaurants',
    slug: 'restaurants',
    name: 'Restaurantes e Cafés',
    shortName: 'Restaurantes',
    icon: 'utensils',
    description:
      'Cardápio digital, comandas virtuais, controle de mesas e integração com a cozinha em tempo real.',
    longDescription:
      'Modernize seu restaurante com cardápio QR Code, pedidos direto na mesa, controle de comandas em tempo real e gestão completa da cozinha. Aumente a rotatividade e reduza erros.',
    benefits: [
      'Cardápio digital com QR Code por mesa',
      'Pedidos enviados direto para a cozinha',
      'Divisão de conta inteligente',
      'Controle de gorjetas',
      'Relatórios de vendas em tempo real',
    ],
    useCases: [
      'Restaurantes',
      'Cafeterias',
      'Bares',
      'Bistrôs',
      'Food trucks',
    ],
    stats: {
      reduction: '50%',
      reductionLabel: 'menos tempo de espera',
      increase: '40%',
      increaseLabel: 'mais rotatividade',
    },
    color: 'secondary',
  },
  {
    id: 'clinics',
    slug: 'clinics',
    name: 'Clínicas e Consultórios',
    shortName: 'Clínicas',
    icon: 'stethoscope',
    description:
      'Agendamento médico, prontuário simplificado, lembretes de retorno e gestão financeira.',
    longDescription:
      'Otimize sua clínica com agendamento online, confirmações automáticas, gestão de prontuários e controle financeiro completo. Melhore a experiência do paciente e reduza buracos na agenda.',
    benefits: [
      'Agendamento online com horários disponíveis',
      'Confirmação automática de consultas',
      'Lembretes de retorno programados',
      'Histórico do paciente acessível',
      'Relatórios financeiros detalhados',
    ],
    useCases: [
      'Clínicas médicas',
      'Consultórios odontológicos',
      'Clínicas veterinárias',
      'Centros de fisioterapia',
      'Psicólogos e terapeutas',
    ],
    stats: {
      reduction: '70%',
      reductionLabel: 'menos faltas',
      increase: '25%',
      increaseLabel: 'mais consultas/dia',
    },
    color: 'accent',
  },
  {
    id: 'bakeries',
    slug: 'bakeries',
    name: 'Padarias e Confeitarias',
    shortName: 'Padarias',
    icon: 'cake',
    description:
      'Pedidos personalizados, controle de produção, gestão de encomendas e fidelização de clientes.',
    longDescription:
      'Gerencie encomendas personalizadas, controle a produção diária, mantenha o estoque de insumos em dia e fidelize seus clientes com um programa de pontos. Perfeito para padarias artesanais.',
    benefits: [
      'Sistema de encomendas online',
      'Controle de produção diária',
      'Gestão de insumos e estoque',
      'Custeio de receitas',
      'Programa de fidelidade',
    ],
    useCases: [
      'Padarias artesanais',
      'Confeitarias',
      'Cake designers',
      'Docerias',
      'Casas de pães especiais',
    ],
    stats: {
      reduction: '30%',
      reductionLabel: 'menos desperdício',
      increase: '45%',
      increaseLabel: 'mais encomendas',
    },
    color: 'primary',
  },
  {
    id: 'events',
    slug: 'events',
    name: 'Espaços para Eventos',
    shortName: 'Eventos',
    icon: 'calendar',
    description:
      'Reserva de espaços, gestão de contratos, pagamentos antecipados e comunicação com clientes.',
    longDescription:
      'Simplifique a gestão do seu espaço de eventos com reservas online, contratos digitais, cobrança automática de sinal e comunicação integrada com clientes.',
    benefits: [
      'Calendário de disponibilidade online',
      'Reservas com pagamento de sinal',
      'Contratos digitais',
      'Lembretes automáticos',
      'Gestão de fornecedores',
    ],
    useCases: [
      'Salões de festas',
      'Espaços para casamentos',
      'Salas de reunião',
      'Coworkings',
      'Estúdios fotográficos',
    ],
    stats: {
      reduction: '60%',
      reductionLabel: 'menos tempo administrativo',
      increase: '50%',
      increaseLabel: 'mais reservas',
    },
    color: 'secondary',
  },
];

export const industryIcons: Record<string, string> = {
  scissors:
    'M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z',
  utensils:
    'M3 3v18h18V3H3zm13 12h-2v-2h2v2zm0-4h-2V7h2v4zM6 15h6v2H6v-2zm0-4h6v2H6v-2zm0-4h6v2H6V7z',
  stethoscope:
    'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  cake: 'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z',
  calendar:
    'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
};

export type Industry = (typeof industries)[0];
