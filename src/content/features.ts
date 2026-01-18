export const features = [
  {
    id: 'scheduling',
    icon: 'calendar',
    title: 'Agendamento Inteligente',
    description:
      'Sistema de agendamento 24/7 com confirmações automáticas, lista de espera e sincronização com calendários pessoais.',
    benefits: [
      'Agenda online 24 horas',
      'Lembretes automáticos por WhatsApp, SMS e email',
      'Lista de espera automática',
      'Sincronização com Google Calendar',
      'Redução de no-shows em até 80%',
    ],
    stats: { value: '80%', label: 'Menos faltas' },
  },
  {
    id: 'payments',
    icon: 'creditCard',
    title: 'Pagamentos Integrados',
    description:
      'Aceite PIX, cartões de crédito e débito. Gerencie comissões, divida pagamentos e emita notas fiscais automaticamente.',
    benefits: [
      'PIX instantâneo',
      'Cartões via Stripe',
      'Divisão de comissões automática',
      'Links de pagamento personalizados',
      'Notas fiscais (NFS-e/NFC-e)',
    ],
    stats: { value: 'R$ 0', label: 'Taxa de adesão' },
  },
  {
    id: 'restaurant',
    icon: 'utensils',
    title: 'Gestão de Restaurantes',
    description:
      'Cardápio digital, comandas virtuais, controle de mesas e integração com cozinha em tempo real.',
    benefits: [
      'Cardápio digital com QR Code',
      'Comanda virtual por mesa',
      'Pedidos direto para cozinha',
      'Divisão de conta inteligente',
      'Gestão de gorjetas',
    ],
    stats: { value: '40%', label: 'Mais agilidade' },
  },
  {
    id: 'timeClock',
    icon: 'clock',
    title: 'Ponto Eletrônico',
    description:
      'Controle de jornada com PIN ou biometria, gestão de turnos, banco de horas e relatórios para folha de pagamento.',
    benefits: [
      'Registro por PIN ou biometria',
      'Gestão de turnos e escalas',
      'Banco de horas automático',
      'Controle de pausas',
      'Exportação para folha de pagamento',
    ],
    stats: { value: '100%', label: 'Conformidade CLT' },
  },
  {
    id: 'inventory',
    icon: 'package',
    title: 'Controle de Estoque',
    description:
      'Gerencie produtos, insumos, compras e fornecedores. Alertas de estoque baixo e custeio por prato/serviço.',
    benefits: [
      'Controle de entradas e saídas',
      'Alertas de estoque mínimo',
      'Gestão de fornecedores',
      'Custeio de receitas/serviços',
      'Pedidos de compra',
    ],
    stats: { value: '25%', label: 'Redução de perdas' },
  },
  {
    id: 'crm',
    icon: 'users',
    title: 'CRM e Fidelização',
    description:
      'Conheça seus clientes, crie programas de fidelidade, envie campanhas segmentadas e aumente a recorrência.',
    benefits: [
      'Histórico completo do cliente',
      'Programa de pontos e cashback',
      'Campanhas por WhatsApp e email',
      'Lembretes de aniversário',
      'Segmentação inteligente',
    ],
    stats: { value: '35%', label: 'Mais retenção' },
  },
  {
    id: 'api',
    icon: 'code',
    title: 'API e Integrações',
    description:
      'APIs REST e GraphQL para integrar com seus sistemas. Webhooks para automações e white-label para parceiros.',
    benefits: [
      'API REST completa',
      'GraphQL disponível',
      'Webhooks customizáveis',
      'White-label para franquias',
      'Documentação detalhada',
    ],
    stats: { value: '∞', label: 'Possibilidades' },
  },
  {
    id: 'analytics',
    icon: 'chart',
    title: 'Relatórios e BI',
    description:
      'Dashboards customizáveis, relatórios financeiros, métricas de desempenho e insights para decisões estratégicas.',
    benefits: [
      'Dashboards personalizáveis',
      'Relatórios financeiros detalhados',
      'Métricas de ocupação e receita',
      'Exportação CSV/Excel',
      'Comparativos por período',
    ],
    stats: { value: '50+', label: 'Métricas disponíveis' },
  },
];

export const iconComponents: Record<string, string> = {
  calendar:
    'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  creditCard:
    'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  utensils:
    'M3 3v18h18V3H3zm13 12h-2v-2h2v2zm0-4h-2V7h2v4zM6 15h6v2H6v-2zm0-4h6v2H6v-2zm0-4h6v2H6V7z',
  clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  package:
    'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  users:
    'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  code: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  chart:
    'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
};

export type Feature = (typeof features)[0];
