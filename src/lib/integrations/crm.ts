/**
 * CRM Integration Layer
 * 
 * This module provides an abstraction layer for CRM integrations.
 * Currently supports: HubSpot, Pipedrive, RD Station
 * 
 * To use a specific CRM, set the CRM_PROVIDER environment variable
 * and provide the necessary API keys.
 */

export interface Lead {
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  customFields?: Record<string, unknown>;
}

export interface Contact extends Lead {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  score?: number;
}

export interface Deal {
  id?: string;
  contactId: string;
  title: string;
  value?: number;
  currency?: string;
  stage?: string;
  expectedCloseDate?: Date;
  customFields?: Record<string, unknown>;
}

export interface CRMProvider {
  name: string;
  createLead(lead: Lead): Promise<Contact>;
  updateContact(id: string, data: Partial<Lead>): Promise<Contact>;
  getContact(email: string): Promise<Contact | null>;
  addTag(contactId: string, tag: string): Promise<void>;
  createDeal(deal: Deal): Promise<Deal>;
  trackEvent(contactId: string, event: string, properties?: Record<string, unknown>): Promise<void>;
}

// HubSpot implementation stub
class HubSpotProvider implements CRMProvider {
  name = 'HubSpot';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createLead(lead: Lead): Promise<Contact> {
    // TODO: Implement HubSpot API call
    // const response = await fetch('https://api.hubapi.com/contacts/v1/contact', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${this.apiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     properties: [
    //       { property: 'email', value: lead.email },
    //       { property: 'firstname', value: lead.name },
    //       { property: 'phone', value: lead.phone },
    //       { property: 'company', value: lead.company },
    //     ],
    //   }),
    // });
    console.log('[HubSpot] Creating lead:', lead.email);
    return {
      ...lead,
      id: `hs_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async updateContact(id: string, data: Partial<Lead>): Promise<Contact> {
    console.log('[HubSpot] Updating contact:', id, data);
    return {
      id,
      email: data.email || '',
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async getContact(email: string): Promise<Contact | null> {
    console.log('[HubSpot] Getting contact:', email);
    return null;
  }

  async addTag(contactId: string, tag: string): Promise<void> {
    console.log('[HubSpot] Adding tag:', contactId, tag);
  }

  async createDeal(deal: Deal): Promise<Deal> {
    console.log('[HubSpot] Creating deal:', deal.title);
    return { ...deal, id: `hs_deal_${Date.now()}` };
  }

  async trackEvent(contactId: string, event: string, properties?: Record<string, unknown>): Promise<void> {
    console.log('[HubSpot] Tracking event:', contactId, event, properties);
  }
}

// Pipedrive implementation stub
class PipedriveProvider implements CRMProvider {
  name = 'Pipedrive';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createLead(lead: Lead): Promise<Contact> {
    console.log('[Pipedrive] Creating lead:', lead.email);
    return {
      ...lead,
      id: `pd_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async updateContact(id: string, data: Partial<Lead>): Promise<Contact> {
    console.log('[Pipedrive] Updating contact:', id, data);
    return {
      id,
      email: data.email || '',
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async getContact(email: string): Promise<Contact | null> {
    console.log('[Pipedrive] Getting contact:', email);
    return null;
  }

  async addTag(contactId: string, tag: string): Promise<void> {
    console.log('[Pipedrive] Adding tag:', contactId, tag);
  }

  async createDeal(deal: Deal): Promise<Deal> {
    console.log('[Pipedrive] Creating deal:', deal.title);
    return { ...deal, id: `pd_deal_${Date.now()}` };
  }

  async trackEvent(contactId: string, event: string, properties?: Record<string, unknown>): Promise<void> {
    console.log('[Pipedrive] Tracking event:', contactId, event, properties);
  }
}

// RD Station implementation stub
class RDStationProvider implements CRMProvider {
  name = 'RD Station';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createLead(lead: Lead): Promise<Contact> {
    console.log('[RD Station] Creating lead:', lead.email);
    return {
      ...lead,
      id: `rd_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async updateContact(id: string, data: Partial<Lead>): Promise<Contact> {
    console.log('[RD Station] Updating contact:', id, data);
    return {
      id,
      email: data.email || '',
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async getContact(email: string): Promise<Contact | null> {
    console.log('[RD Station] Getting contact:', email);
    return null;
  }

  async addTag(contactId: string, tag: string): Promise<void> {
    console.log('[RD Station] Adding tag:', contactId, tag);
  }

  async createDeal(deal: Deal): Promise<Deal> {
    console.log('[RD Station] Creating deal:', deal.title);
    return { ...deal, id: `rd_deal_${Date.now()}` };
  }

  async trackEvent(contactId: string, event: string, properties?: Record<string, unknown>): Promise<void> {
    console.log('[RD Station] Tracking event:', contactId, event, properties);
  }
}

// Null/No-op provider for when no CRM is configured
class NullProvider implements CRMProvider {
  name = 'None';

  async createLead(lead: Lead): Promise<Contact> {
    console.log('[CRM] No CRM configured. Lead not synced:', lead.email);
    return {
      ...lead,
      id: `local_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async updateContact(id: string, data: Partial<Lead>): Promise<Contact> {
    return {
      id,
      email: data.email || '',
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async getContact(): Promise<Contact | null> {
    return null;
  }

  async addTag(): Promise<void> {}
  async createDeal(deal: Deal): Promise<Deal> {
    return { ...deal, id: `local_deal_${Date.now()}` };
  }
  async trackEvent(): Promise<void> {}
}

// Factory function to get the configured CRM provider
function getCRMProvider(): CRMProvider {
  const provider = process.env.CRM_PROVIDER?.toLowerCase();
  
  switch (provider) {
    case 'hubspot':
      const hubspotKey = process.env.HUBSPOT_API_KEY;
      if (!hubspotKey) {
        console.warn('HUBSPOT_API_KEY not configured');
        return new NullProvider();
      }
      return new HubSpotProvider(hubspotKey);
      
    case 'pipedrive':
      const pipedriveKey = process.env.PIPEDRIVE_API_KEY;
      if (!pipedriveKey) {
        console.warn('PIPEDRIVE_API_KEY not configured');
        return new NullProvider();
      }
      return new PipedriveProvider(pipedriveKey);
      
    case 'rdstation':
      const rdKey = process.env.RDSTATION_API_KEY;
      if (!rdKey) {
        console.warn('RDSTATION_API_KEY not configured');
        return new NullProvider();
      }
      return new RDStationProvider(rdKey);
      
    default:
      return new NullProvider();
  }
}

// Export singleton instance
export const crmIntegration = getCRMProvider();

// Convenience functions
export async function syncLead(lead: Lead): Promise<Contact> {
  return crmIntegration.createLead(lead);
}

export async function syncDemoRequest(lead: Lead): Promise<{ contact: Contact; deal: Deal }> {
  const contact = await crmIntegration.createLead(lead);
  await crmIntegration.addTag(contact.id, 'demo-request');
  
  const deal = await crmIntegration.createDeal({
    contactId: contact.id,
    title: `Demo - ${lead.company || lead.name || lead.email}`,
    stage: 'demo-scheduled',
  });
  
  return { contact, deal };
}

export async function syncNewsletterSubscription(email: string): Promise<Contact> {
  const contact = await crmIntegration.createLead({ email });
  await crmIntegration.addTag(contact.id, 'newsletter');
  return contact;
}
