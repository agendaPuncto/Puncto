/**
 * WhatsApp Business API client
 * Supports Meta Cloud API (WhatsApp Business Platform)
 */

interface WhatsAppOptions {
  to: string; // Phone number in E.164 format (e.g., +5511999999999)
  template?: string; // Template name
  templateParams?: string[]; // Template parameters
  text?: string; // Plain text message (if not using template)
  businessAccountId?: string;
}

/**
 * Send WhatsApp message via Meta Cloud API
 */
export async function sendWhatsApp(
  options: WhatsAppOptions
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const businessAccountId = options.businessAccountId || process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;

  if (!phoneNumberId || !accessToken) {
    throw new Error('WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN must be configured');
  }

  try {
    let payload: any;

    if (options.template) {
      // Send template message
      payload = {
        messaging_product: 'whatsapp',
        to: options.to,
        type: 'template',
        template: {
          name: options.template,
          language: { code: 'pt_BR' },
          components: options.templateParams
            ? [
                {
                  type: 'body',
                  parameters: options.templateParams.map((param) => ({
                    type: 'text',
                    text: param,
                  })),
                },
              ]
            : undefined,
        },
      };
    } else if (options.text) {
      // Send plain text message
      payload = {
        messaging_product: 'whatsapp',
        to: options.to,
        type: 'text',
        text: { body: options.text },
      };
    } else {
      throw new Error('Either template or text must be provided');
    }

    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[WhatsApp] API Error:', data);
      return { success: false, error: data.error?.message || 'Failed to send WhatsApp message' };
    }

    return { success: true, messageId: data.messages[0]?.id };
  } catch (error: any) {
    console.error('[WhatsApp] Error sending message:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Format phone number to E.164 format
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // If it starts with 0, remove it
  const withoutLeadingZero = digits.startsWith('0') ? digits.slice(1) : digits;

  // If it doesn't start with country code, assume Brazil (+55)
  if (!withoutLeadingZero.startsWith('55')) {
    return `+55${withoutLeadingZero}`;
  }

  return `+${withoutLeadingZero}`;
}
