// SendGrid Email Marketing Integration
// For email campaigns, automation, and transactional emails

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@puncto.com.br';
const SENDGRID_FROM_NAME = process.env.SENDGRID_FROM_NAME || 'Puncto';

interface EmailRecipient {
  email: string;
  name?: string;
}

interface EmailContent {
  subject: string;
  text?: string;
  html?: string;
}

interface SendEmailOptions {
  to: EmailRecipient | EmailRecipient[];
  content: EmailContent;
  templateId?: string;
  dynamicTemplateData?: Record<string, unknown>;
  categories?: string[];
  replyTo?: string;
  attachments?: {
    content: string; // Base64 encoded
    filename: string;
    type: string;
    disposition?: 'attachment' | 'inline';
  }[];
}

// Send a single email
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured');
    return false;
  }

  try {
    const recipients = Array.isArray(options.to) ? options.to : [options.to];
    
    const payload: Record<string, unknown> = {
      personalizations: [
        {
          to: recipients.map(r => ({ email: r.email, name: r.name })),
          ...(options.dynamicTemplateData && { dynamic_template_data: options.dynamicTemplateData }),
        },
      ],
      from: {
        email: SENDGRID_FROM_EMAIL,
        name: SENDGRID_FROM_NAME,
      },
      ...(options.replyTo && { reply_to: { email: options.replyTo } }),
      ...(options.categories && { categories: options.categories }),
      ...(options.attachments && { attachments: options.attachments }),
    };

    if (options.templateId) {
      payload.template_id = options.templateId;
    } else {
      payload.subject = options.content.subject;
      payload.content = [];
      if (options.content.text) {
        (payload.content as unknown[]).push({ type: 'text/plain', value: options.content.text });
      }
      if (options.content.html) {
        (payload.content as unknown[]).push({ type: 'text/html', value: options.content.html });
      }
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch (error) {
    console.error('SendGrid send email error:', error);
    return false;
  }
}

// Add contact to SendGrid marketing list
export async function addToMarketingList(
  email: string,
  listIds: string[],
  customFields?: Record<string, string>
): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured');
    return false;
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        list_ids: listIds,
        contacts: [
          {
            email,
            ...customFields,
          },
        ],
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('SendGrid add to list error:', error);
    return false;
  }
}

// Remove contact from marketing list
export async function removeFromMarketingList(
  email: string,
  listId: string
): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured');
    return false;
  }

  try {
    // First, get contact ID
    const searchResponse = await fetch(
      'https://api.sendgrid.com/v3/marketing/contacts/search',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `email = '${email}'`,
        }),
      }
    );

    const searchData = await searchResponse.json();
    if (!searchData.result || searchData.result.length === 0) {
      return true; // Contact not found, consider success
    }

    const contactId = searchData.result[0].id;

    // Remove from list
    const response = await fetch(
      `https://api.sendgrid.com/v3/marketing/lists/${listId}/contacts?contact_ids=${contactId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        },
      }
    );

    return response.ok;
  } catch (error) {
    console.error('SendGrid remove from list error:', error);
    return false;
  }
}

// Unsubscribe contact globally
export async function unsubscribeContact(email: string): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured');
    return false;
  }

  try {
    const response = await fetch(
      'https://api.sendgrid.com/v3/asm/suppressions/global',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient_emails: [email],
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error('SendGrid unsubscribe error:', error);
    return false;
  }
}

// Email templates for common scenarios
export const emailTemplates = {
  welcome: process.env.SENDGRID_TEMPLATE_WELCOME || '',
  newsletterWelcome: process.env.SENDGRID_TEMPLATE_NEWSLETTER_WELCOME || '',
  demoConfirmation: process.env.SENDGRID_TEMPLATE_DEMO_CONFIRMATION || '',
  trialStarted: process.env.SENDGRID_TEMPLATE_TRIAL_STARTED || '',
  trialEnding: process.env.SENDGRID_TEMPLATE_TRIAL_ENDING || '',
  subscriptionConfirmation: process.env.SENDGRID_TEMPLATE_SUBSCRIPTION_CONFIRMATION || '',
  invoiceReceipt: process.env.SENDGRID_TEMPLATE_INVOICE_RECEIPT || '',
  passwordReset: process.env.SENDGRID_TEMPLATE_PASSWORD_RESET || '',
};

// Marketing lists
export const marketingLists = {
  newsletter: process.env.SENDGRID_LIST_NEWSLETTER || '',
  leads: process.env.SENDGRID_LIST_LEADS || '',
  customers: process.env.SENDGRID_LIST_CUSTOMERS || '',
  churned: process.env.SENDGRID_LIST_CHURNED || '',
};

// Send welcome email to new newsletter subscriber
export async function sendNewsletterWelcome(email: string, name?: string): Promise<boolean> {
  return sendEmail({
    to: { email, name },
    content: { subject: 'Bem-vindo à newsletter do Puncto!' },
    templateId: emailTemplates.newsletterWelcome,
    dynamicTemplateData: {
      name: name || 'Visitante',
      email,
    },
    categories: ['newsletter', 'welcome'],
  });
}

// Send demo confirmation email
export async function sendDemoConfirmation(
  email: string,
  name: string,
  scheduledDate?: string
): Promise<boolean> {
  return sendEmail({
    to: { email, name },
    content: { subject: 'Sua demonstração do Puncto foi agendada!' },
    templateId: emailTemplates.demoConfirmation,
    dynamicTemplateData: {
      name,
      email,
      scheduledDate: scheduledDate || 'Em breve entraremos em contato',
    },
    categories: ['demo', 'confirmation'],
  });
}

// Send trial started email
export async function sendTrialStartedEmail(
  email: string,
  name: string,
  businessName: string,
  trialEndDate: string
): Promise<boolean> {
  return sendEmail({
    to: { email, name },
    content: { subject: 'Seu período de teste começou!' },
    templateId: emailTemplates.trialStarted,
    dynamicTemplateData: {
      name,
      businessName,
      trialEndDate,
      loginUrl: 'https://app.puncto.com.br/auth/login',
    },
    categories: ['trial', 'onboarding'],
  });
}

// Send trial ending reminder
export async function sendTrialEndingReminder(
  email: string,
  name: string,
  daysRemaining: number
): Promise<boolean> {
  return sendEmail({
    to: { email, name },
    content: { subject: `Seu período de teste termina em ${daysRemaining} dias` },
    templateId: emailTemplates.trialEnding,
    dynamicTemplateData: {
      name,
      daysRemaining,
      upgradeUrl: 'https://app.puncto.com.br/admin/subscription',
    },
    categories: ['trial', 'reminder'],
  });
}
