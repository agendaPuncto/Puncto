export const features = [
  {
    id: 'automacao',
    icon: 'clock',
    title: 'Automação de Processos',
    description:
      'Elimine tarefas repetitivas. Lembretes automáticos, confirmações e organização de agenda sem intervenção manual.',
    benefits: [
      'Redução de erro humano',
      'Economia de horas da equipe',
      'Processos padronizados',
      'Lembretes WhatsApp/Email automáticos',
    ],
  },
  {
    id: 'financeiro',
    icon: 'creditCard',
    title: 'Gestão Financeira Descomplicada',
    description:
      'Tenha clareza total do seu fluxo de caixa. Contas a pagar, receber e emissão de notas fiscais em poucos cliques.',
    benefits: [
      'Visão clara de lucros e gastos',
      'Emissão de NFs automatizada',
      'Conciliação bancária',
      'Relatórios de inadimplência',
    ],
  },
  {
    id: 'dashboards',
    icon: 'chart',
    title: 'Dashboards de Decisão',
    description:
      'Pare de decidir no "achismo". Tenha painéis visuais que mostram a saúde do seu negócio em tempo real.',
    benefits: [
      'Indicadores de desempenho (KPIs)',
      'Visualização de metas',
      'Comparativos mensais',
      'Acesso rápido pelo celular',
    ],
  },
  {
    id: 'estoque',
    icon: 'package',
    title: 'Controle de Materiais e Estoque',
    description:
      'Evite desperdícios e compras de última hora. Saiba exatamente o que entra e sai da sua empresa.',
    benefits: [
      'Alertas de estoque baixo',
      'Histórico de compras',
      'Gestão de fornecedores',
      'Cálculo de custo por produto',
    ],
  },
  {
    id: 'crm',
    icon: 'users',
    title: 'Gestão de Clientes (CRM)',
    description:
      'Centralize os dados dos seus clientes. Histórico de compras, preferências e contatos em um só lugar seguro.',
    benefits: [
      'Cadastro centralizado',
      'Histórico de atendimentos',
      'Segmentação de clientes',
      'Pós-venda eficiente',
    ],
  },
  {
    id: 'integracao',
    icon: 'code',
    title: 'Integração de Sistemas',
    description:
      'Conecte o Puncto com suas ferramentas favoritas através de API REST, webhooks e integrações prontas.',
    benefits: [
      'API REST e GraphQL',
      'Webhooks para eventos',
      'Integrações com calendários',
      'Segurança da informação',
    ],
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
