/**
 * WhatsApp message templates
 */

export interface WhatsAppTemplate {
  name: string;
  language: 'pt_BR' | 'en_US';
  components?: Array<{
    type: 'body';
    parameters: Array<{ type: 'text'; text: string }>;
  }>;
}

/**
 * Booking confirmation template
 */
export function bookingConfirmationTemplate(
  customerName: string,
  serviceName: string,
  professionalName: string,
  date: string,
  time: string,
  businessName: string
): WhatsAppTemplate {
  return {
    name: 'booking_confirmation',
    language: 'pt_BR',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: customerName },
          { type: 'text', text: serviceName },
          { type: 'text', text: professionalName },
          { type: 'text', text: date },
          { type: 'text', text: time },
          { type: 'text', text: businessName },
        ],
      },
    ],
  };
}

/**
 * Booking reminder template (48h, 24h, 3h before)
 */
export function bookingReminderTemplate(
  customerName: string,
  serviceName: string,
  date: string,
  time: string,
  hoursUntil: number
): string {
  const timeText =
    hoursUntil >= 48 ? 'em 48 horas' : hoursUntil >= 24 ? 'em 24 horas' : 'em 3 horas';

  return `Olá, ${customerName}! 

Lembrete: Você tem um agendamento de ${serviceName} ${timeText}.

📅 Data: ${date}
🕐 Horário: ${time}

Por favor, confirme sua presença ou entre em contato conosco para reagendar.

Até breve!`;
}

/**
 * Booking cancellation template
 */
export function bookingCancellationTemplate(
  customerName: string,
  serviceName: string,
  date: string,
  time: string,
  refundInfo?: string
): string {
  return `Olá, ${customerName}!

Seu agendamento foi cancelado:

📅 ${serviceName} - ${date} às ${time}

${refundInfo || 'Entre em contato conosco para reagendar ou esclarecer dúvidas.'}

Obrigado!`;
}
