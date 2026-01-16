/**
 * Email messaging client
 * Supports Resend and Mailgun providers
 */

interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

/**
 * Send email via Resend or Mailgun
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const provider = process.env.EMAIL_PROVIDER || 'resend';

  if (provider === 'resend') {
    return sendViaResend(options);
  } else if (provider === 'mailgun') {
    return sendViaMailgun(options);
  }

  throw new Error(`Unknown email provider: ${provider}`);
}

/**
 * Send email via Resend
 */
async function sendViaResend(options: EmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const from = options.from || process.env.RESEND_FROM_EMAIL || 'noreply@puncto.app';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
        reply_to: options.replyTo,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || 'Failed to send email' };
    }

    return { success: true, messageId: data.id };
  } catch (error: any) {
    console.error('[Resend] Error sending email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send email via Mailgun
 */
async function sendViaMailgun(options: EmailOptions) {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;

  if (!apiKey || !domain) {
    throw new Error('MAILGUN_API_KEY and MAILGUN_DOMAIN must be configured');
  }

  const from = options.from || `noreply@${domain}`;

  try {
    const formData = new FormData();
    formData.append('from', from);
    if (Array.isArray(options.to)) {
      options.to.forEach((to) => formData.append('to', to));
    } else {
      formData.append('to', options.to);
    }
    formData.append('subject', options.subject);
    if (options.html) formData.append('html', options.html);
    if (options.text) formData.append('text', options.text);
    if (options.replyTo) formData.append('h:Reply-To', options.replyTo);

    const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || 'Failed to send email' };
    }

    return { success: true, messageId: data.id };
  } catch (error: any) {
    console.error('[Mailgun] Error sending email:', error);
    return { success: false, error: error.message };
  }
}
