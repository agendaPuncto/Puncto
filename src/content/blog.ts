export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  featured?: boolean;
  image?: string;
}

export const blogCategories = [
  { id: 'all', name: 'Todos' },
  { id: 'gestao', name: 'Gestão' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'tecnologia', name: 'Tecnologia' },
  { id: 'dicas', name: 'Dicas' },
  { id: 'novidades', name: 'Novidades' },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'como-reduzir-no-shows-seu-salao',
    title: 'Como Reduzir No-Shows no Seu Salão: 10 Estratégias Comprovadas',
    excerpt:
      'Descubra técnicas eficazes para diminuir as faltas dos clientes e aumentar a ocupação do seu salão de beleza.',
    content: `
# Como Reduzir No-Shows no Seu Salão

Os no-shows são um dos maiores desafios para salões de beleza. Estudos mostram que a taxa média de faltas pode chegar a 20% dos agendamentos, representando uma perda significativa de receita.

## Por que os clientes faltam?

- Esquecimento
- Imprevistos de última hora
- Dificuldade de cancelar
- Falta de compromisso

## 10 Estratégias para Reduzir No-Shows

### 1. Lembretes Automáticos
Envie lembretes por WhatsApp, SMS ou email 48h, 24h e 3h antes do horário.

### 2. Confirmação Ativa
Peça que o cliente confirme o agendamento respondendo a mensagem.

### 3. Política de Cancelamento Clara
Estabeleça e comunique uma política de cancelamento com antecedência mínima.

### 4. Depósito Antecipado
Para serviços de maior valor, considere cobrar um sinal.

### 5. Lista de Espera
Mantenha uma lista de espera para preencher cancelamentos.

...
    `,
    author: {
      name: 'Maria Santos',
      role: 'CEO & Co-fundadora',
    },
    category: 'gestao',
    tags: ['no-shows', 'salão', 'agendamento', 'produtividade'],
    publishedAt: '2024-01-15',
    readingTime: 8,
    featured: true,
  },
  {
    id: '2',
    slug: 'guia-completo-pagamentos-digitais-pix',
    title: 'Guia Completo: Pagamentos Digitais e PIX para Negócios de Serviços',
    excerpt:
      'Tudo que você precisa saber sobre PIX, cartões e pagamentos online para modernizar seu negócio.',
    content: `
# Guia Completo de Pagamentos Digitais

O PIX revolucionou a forma como os brasileiros fazem pagamentos. Descubra como aproveitar essa e outras formas de pagamento digital.

## Vantagens do PIX para seu negócio

- Recebimento instantâneo
- Sem taxas para pessoa física
- Disponível 24/7
- Facilidade de conciliação

...
    `,
    author: {
      name: 'João Silva',
      role: 'CTO & Co-fundador',
    },
    category: 'tecnologia',
    tags: ['PIX', 'pagamentos', 'digital', 'financeiro'],
    publishedAt: '2024-01-10',
    readingTime: 12,
    featured: true,
  },
  {
    id: '3',
    slug: 'marketing-instagram-negocios-locais',
    title: 'Marketing no Instagram para Negócios Locais: O Guia Definitivo',
    excerpt:
      'Aprenda a usar o Instagram para atrair mais clientes para seu salão, restaurante ou clínica.',
    content: `
# Marketing no Instagram para Negócios Locais

O Instagram é uma das ferramentas mais poderosas para negócios locais. Veja como usar a plataforma para atrair clientes.

## Por que o Instagram funciona?

- Alcance visual
- Público local
- Engajamento alto
- Stories e Reels

...
    `,
    author: {
      name: 'Ana Costa',
      role: 'Head de Produto',
    },
    category: 'marketing',
    tags: ['instagram', 'marketing', 'redes sociais', 'digital'],
    publishedAt: '2024-01-05',
    readingTime: 10,
  },
  {
    id: '4',
    slug: 'gestao-estoque-restaurantes',
    title: 'Gestão de Estoque para Restaurantes: Evite Desperdícios e Aumente Lucros',
    excerpt:
      'Técnicas práticas para controlar estoque, reduzir desperdícios e melhorar a margem do seu restaurante.',
    content: `
# Gestão de Estoque para Restaurantes

O controle de estoque é fundamental para a saúde financeira de qualquer restaurante.

## Principais desafios

- Perecibilidade
- Sazonalidade
- Variação de demanda
- Controle de porções

...
    `,
    author: {
      name: 'Carlos Oliveira',
      role: 'Head de Vendas',
    },
    category: 'gestao',
    tags: ['estoque', 'restaurante', 'desperdício', 'financeiro'],
    publishedAt: '2023-12-20',
    readingTime: 7,
  },
  {
    id: '5',
    slug: 'fidelizacao-clientes-programas-pontos',
    title: 'Fidelização de Clientes: Como Criar um Programa de Pontos Eficiente',
    excerpt:
      'Descubra como criar um programa de fidelidade que realmente funciona e aumenta a retenção de clientes.',
    content: `
# Fidelização de Clientes

Conquistar um novo cliente custa 5x mais do que manter um existente. Veja como fidelizar.

## Tipos de programas

- Pontos
- Cashback
- Níveis/Tiers
- Assinatura

...
    `,
    author: {
      name: 'Maria Santos',
      role: 'CEO & Co-fundadora',
    },
    category: 'dicas',
    tags: ['fidelização', 'pontos', 'clientes', 'retenção'],
    publishedAt: '2023-12-15',
    readingTime: 6,
  },
  {
    id: '6',
    slug: 'puncto-lanca-modulo-restaurantes',
    title: 'Novidade: Puncto Lança Módulo Completo para Restaurantes',
    excerpt:
      'Conheça as novas funcionalidades de cardápio digital, comanda virtual e gestão de mesas.',
    content: `
# Puncto Lança Módulo para Restaurantes

Temos o prazer de anunciar o lançamento do nosso módulo completo para restaurantes e cafés.

## Novas funcionalidades

- Cardápio digital com QR Code
- Comanda virtual por mesa
- Pedidos direto para cozinha
- Divisão de conta inteligente

...
    `,
    author: {
      name: 'João Silva',
      role: 'CTO & Co-fundador',
    },
    category: 'novidades',
    tags: ['restaurante', 'novidades', 'funcionalidades', 'cardápio'],
    publishedAt: '2023-12-01',
    readingTime: 4,
  },
];
