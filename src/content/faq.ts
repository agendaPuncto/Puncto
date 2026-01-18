export const faqItems = [
  {
    question: 'Como funciona o período de teste gratuito?',
    answer:
      'Você tem 14 dias para testar todas as funcionalidades do Puncto sem compromisso e sem precisar de cartão de crédito. Ao final do período, você pode escolher um dos nossos planos ou continuar usando a versão gratuita com recursos limitados.',
  },
  {
    question: 'Preciso de conhecimento técnico para usar?',
    answer:
      'Não! O Puncto foi desenvolvido para ser intuitivo e fácil de usar. Nossa equipe oferece suporte completo na configuração inicial e temos tutoriais em vídeo, documentação detalhada e suporte por chat para qualquer dúvida.',
  },
  {
    question: 'Quais formas de pagamento são aceitas?',
    answer:
      'Aceitamos PIX, cartões de crédito (Visa, Mastercard, Elo, Amex) e boleto bancário. Para assinatura do Puncto, você pode pagar mensalmente ou anualmente (com desconto). Para receber pagamentos dos seus clientes, oferecemos PIX instantâneo e todas as bandeiras de cartão via Stripe.',
  },
  {
    question: 'O sistema emite nota fiscal?',
    answer:
      'Sim! Nos planos Pro e Enterprise, você pode emitir NFS-e (serviços) e NFC-e (produtos) automaticamente. Temos integração com os principais sistemas de emissão de nota fiscal do Brasil (TecnoSpeed, eNotas, PlugNotas).',
  },
  {
    question: 'Posso usar o Puncto em mais de uma unidade?',
    answer:
      'Sim! O Puncto foi desenvolvido para multi-unidades e franquias. Você pode gerenciar todas as suas unidades em um único lugar, com visão consolidada ou individual, e controle de acesso por localidade.',
  },
  {
    question: 'Como funcionam as integrações com WhatsApp?',
    answer:
      'Usamos a API oficial do WhatsApp Business Platform para enviar lembretes de agendamento, confirmações e campanhas de marketing. É necessário ter uma conta no WhatsApp Business verificada. Ajudamos na configuração inicial.',
  },
  {
    question: 'Meus dados estão seguros?',
    answer:
      'Absolutamente! Utilizamos criptografia de ponta (TLS 1.3), armazenamento em nuvem com redundância (Firebase/Google Cloud), e somos totalmente compatíveis com a LGPD. Realizamos backups automáticos diários e temos certificação de segurança.',
  },
  {
    question: 'Posso migrar dados de outro sistema?',
    answer:
      'Sim! Nossa equipe de suporte pode ajudar a migrar seus dados de clientes, serviços e histórico de outros sistemas. Para planos Pro e Enterprise, oferecemos migração assistida sem custo adicional.',
  },
  {
    question: 'Existe contrato de fidelidade?',
    answer:
      'Não! Nossos planos são mensais e você pode cancelar a qualquer momento sem multa. Acreditamos que a qualidade do nosso produto deve ser o motivo para você ficar, não um contrato.',
  },
  {
    question: 'O Puncto funciona offline?',
    answer:
      'Sim! O Puncto é um PWA (Progressive Web App) que continua funcionando mesmo sem internet. Você pode visualizar a agenda, fazer marcações e registrar vendas. Quando a conexão voltar, tudo é sincronizado automaticamente.',
  },
];

export type FAQItem = (typeof faqItems)[0];
