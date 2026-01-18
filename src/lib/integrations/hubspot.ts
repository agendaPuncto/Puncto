// HubSpot CRM Integration
// API integration for contacts, deals, and marketing automation

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const HUBSPOT_PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;

interface HubSpotContact {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  properties?: Record<string, string>;
}

interface HubSpotDeal {
  dealName: string;
  pipeline?: string;
  stage?: string;
  amount?: number;
  contactId?: string;
  properties?: Record<string, string | number>;
}

// Create or update a contact in HubSpot
export async function upsertContact(contact: HubSpotContact): Promise<{ id: string } | null> {
  if (!HUBSPOT_API_KEY) {
    console.warn('HubSpot API key not configured');
    return null;
  }

  try {
    // First, try to find existing contact
    const searchResponse = await fetch(
      'https://api.hubapi.com/crm/v3/objects/contacts/search',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: 'email',
                  operator: 'EQ',
                  value: contact.email,
                },
              ],
            },
          ],
        }),
      }
    );

    const searchData = await searchResponse.json();

    const properties: Record<string, string> = {
      email: contact.email,
      ...(contact.firstName && { firstname: contact.firstName }),
      ...(contact.lastName && { lastname: contact.lastName }),
      ...(contact.phone && { phone: contact.phone }),
      ...(contact.company && { company: contact.company }),
      ...contact.properties,
    };

    if (searchData.total > 0) {
      // Update existing contact
      const contactId = searchData.results[0].id;
      await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ properties }),
        }
      );
      return { id: contactId };
    } else {
      // Create new contact
      const createResponse = await fetch(
        'https://api.hubapi.com/crm/v3/objects/contacts',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ properties }),
        }
      );
      const createData = await createResponse.json();
      return { id: createData.id };
    }
  } catch (error) {
    console.error('HubSpot upsert contact error:', error);
    return null;
  }
}

// Create a deal in HubSpot
export async function createDeal(deal: HubSpotDeal): Promise<{ id: string } | null> {
  if (!HUBSPOT_API_KEY) {
    console.warn('HubSpot API key not configured');
    return null;
  }

  try {
    const properties: Record<string, string | number> = {
      dealname: deal.dealName,
      pipeline: deal.pipeline || 'default',
      dealstage: deal.stage || 'appointmentscheduled',
      ...(deal.amount && { amount: deal.amount }),
      ...deal.properties,
    };

    const response = await fetch(
      'https://api.hubapi.com/crm/v3/objects/deals',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties }),
      }
    );

    const data = await response.json();

    // Associate deal with contact if provided
    if (deal.contactId) {
      await fetch(
        `https://api.hubapi.com/crm/v3/objects/deals/${data.id}/associations/contacts/${deal.contactId}/deal_to_contact`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
          },
        }
      );
    }

    return { id: data.id };
  } catch (error) {
    console.error('HubSpot create deal error:', error);
    return null;
  }
}

// Track a form submission
export async function trackFormSubmission(
  formId: string,
  fields: Record<string, string>,
  pageUrl?: string,
  pageName?: string
): Promise<boolean> {
  if (!HUBSPOT_PORTAL_ID) {
    console.warn('HubSpot Portal ID not configured');
    return false;
  }

  try {
    const formData = {
      fields: Object.entries(fields).map(([name, value]) => ({ name, value })),
      context: {
        pageUri: pageUrl || (typeof window !== 'undefined' ? window.location.href : ''),
        pageName: pageName || '',
      },
    };

    const response = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${formId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }
    );

    return response.ok;
  } catch (error) {
    console.error('HubSpot form submission error:', error);
    return false;
  }
}

// Add contact to a list
export async function addContactToList(contactId: string, listId: string): Promise<boolean> {
  if (!HUBSPOT_API_KEY) {
    console.warn('HubSpot API key not configured');
    return false;
  }

  try {
    const response = await fetch(
      `https://api.hubapi.com/contacts/v1/lists/${listId}/add`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vids: [parseInt(contactId)],
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error('HubSpot add to list error:', error);
    return false;
  }
}

// Log a custom event for a contact
export async function trackCustomEvent(
  eventName: string,
  contactEmail: string,
  properties?: Record<string, string | number>
): Promise<boolean> {
  if (!HUBSPOT_API_KEY) {
    console.warn('HubSpot API key not configured');
    return false;
  }

  try {
    const response = await fetch(
      'https://api.hubapi.com/events/v3/send',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventName: `pe${HUBSPOT_PORTAL_ID}_${eventName}`,
          email: contactEmail,
          properties: properties || {},
          occurredAt: new Date().toISOString(),
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error('HubSpot track event error:', error);
    return false;
  }
}

// Lead scoring helper
export interface LeadScore {
  email: string;
  score: number;
  factors: {
    name: string;
    points: number;
  }[];
}

export function calculateLeadScore(
  contact: {
    email: string;
    company?: string;
    phone?: string;
    businessType?: string;
    employees?: number;
    visitedPricing?: boolean;
    requestedDemo?: boolean;
    downloadedResource?: boolean;
    subscribedNewsletter?: boolean;
  }
): LeadScore {
  const factors: { name: string; points: number }[] = [];
  let score = 0;

  // Company provided
  if (contact.company) {
    factors.push({ name: 'Company provided', points: 10 });
    score += 10;
  }

  // Phone provided
  if (contact.phone) {
    factors.push({ name: 'Phone provided', points: 15 });
    score += 15;
  }

  // Business type provided
  if (contact.businessType) {
    factors.push({ name: 'Business type provided', points: 10 });
    score += 10;
  }

  // Employee count
  if (contact.employees) {
    if (contact.employees >= 10) {
      factors.push({ name: 'Mid-size company (10+)', points: 20 });
      score += 20;
    } else if (contact.employees >= 5) {
      factors.push({ name: 'Small company (5-9)', points: 10 });
      score += 10;
    }
  }

  // Behavioral signals
  if (contact.visitedPricing) {
    factors.push({ name: 'Visited pricing page', points: 20 });
    score += 20;
  }

  if (contact.requestedDemo) {
    factors.push({ name: 'Requested demo', points: 40 });
    score += 40;
  }

  if (contact.downloadedResource) {
    factors.push({ name: 'Downloaded resource', points: 15 });
    score += 15;
  }

  if (contact.subscribedNewsletter) {
    factors.push({ name: 'Newsletter subscriber', points: 5 });
    score += 5;
  }

  return {
    email: contact.email,
    score,
    factors,
  };
}

// Predefined HubSpot lists
export const hubspotLists = {
  newsletter: process.env.HUBSPOT_LIST_NEWSLETTER || '',
  demoRequests: process.env.HUBSPOT_LIST_DEMO_REQUESTS || '',
  trialUsers: process.env.HUBSPOT_LIST_TRIAL_USERS || '',
  customers: process.env.HUBSPOT_LIST_CUSTOMERS || '',
};

// Predefined HubSpot forms
export const hubspotForms = {
  contact: process.env.HUBSPOT_FORM_CONTACT || '',
  demo: process.env.HUBSPOT_FORM_DEMO || '',
  newsletter: process.env.HUBSPOT_FORM_NEWSLETTER || '',
};
