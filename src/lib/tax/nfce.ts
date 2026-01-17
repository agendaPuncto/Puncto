import { Order } from '@/types/restaurant';
import { Business } from '@/types/business';

/**
 * Generate NFC-e data structure for Brazilian tax compliance
 * This prepares the data to be sent to tax service providers (TecnoSpeed/eNotas/PlugNotas)
 */
export interface NFCeData {
  business: {
    cnpj: string;
    name: string;
    address: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  order: {
    id: string;
    tableNumber: string;
    items: Array<{
      name: string;
      quantity: number;
      unitPrice: number;
      total: number;
      ncm?: string; // NCM code for tax classification
      cst?: string; // CST code for tax situation
    }>;
    subtotal: number;
    tax: number;
    tip: number;
    total: number;
    paymentMethod: string;
    createdAt: Date;
  };
  customer?: {
    cpf?: string;
    name?: string;
    email?: string;
  };
}

/**
 * Prepare NFC-e data from order and business
 */
export function prepareNFCeData(order: Order, business: Business): NFCeData {
  return {
    business: {
      cnpj: business.taxId,
      name: business.legalName,
      address: {
        street: business.address.street,
        number: business.address.number,
        complement: business.address.complement,
        neighborhood: business.address.neighborhood,
        city: business.address.city,
        state: business.address.state,
        zipCode: business.address.zipCode,
      },
    },
    order: {
      id: order.id,
      tableNumber: order.tableNumber,
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.unitPrice * item.quantity,
        // NCM and CST would come from product configuration
        ncm: '21069090', // Default NCM for food services
        cst: '060', // Default CST for services
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      tip: order.tip,
      total: order.total,
      paymentMethod: order.paymentMethod || 'card',
      createdAt: order.createdAt as Date,
    },
  };
}

/**
 * Generate NFC-e via TecnoSpeed API
 */
export async function generateNFCeTecnoSpeed(
  nfceData: NFCeData,
  apiKey: string,
  apiUrl: string
): Promise<{ nfceNumber: string; accessKey: string; xml: string }> {
  // This is a placeholder - actual implementation would call TecnoSpeed API
  // TecnoSpeed API documentation: https://doc.tecnospeed.com.br
  
  const response = await fetch(`${apiUrl}/nfce/emitir`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(nfceData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`TecnoSpeed API error: ${error.message || 'Unknown error'}`);
  }

  const result = await response.json();
  return {
    nfceNumber: result.numero,
    accessKey: result.chaveAcesso,
    xml: result.xml,
  };
}

/**
 * Generate NFC-e via eNotas API
 */
export async function generateNFCeENotas(
  nfceData: NFCeData,
  apiKey: string,
  apiUrl: string
): Promise<{ nfceNumber: string; accessKey: string; xml: string }> {
  // This is a placeholder - actual implementation would call eNotas API
  // eNotas API documentation: https://enotas.com.br/api
  
  const response = await fetch(`${apiUrl}/nfce`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${apiKey}`,
    },
    body: JSON.stringify(nfceData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`eNotas API error: ${error.message || 'Unknown error'}`);
  }

  const result = await response.json();
  return {
    nfceNumber: result.numero,
    accessKey: result.chaveAcesso,
    xml: result.xml,
  };
}

/**
 * Generate NFC-e via PlugNotas API
 */
export async function generateNFCePlugNotas(
  nfceData: NFCeData,
  apiKey: string,
  apiUrl: string
): Promise<{ nfceNumber: string; accessKey: string; xml: string }> {
  // This is a placeholder - actual implementation would call PlugNotas API
  // PlugNotas API documentation: https://plugnotas.com.br/api
  
  const response = await fetch(`${apiUrl}/nfce`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
    },
    body: JSON.stringify(nfceData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`PlugNotas API error: ${error.message || 'Unknown error'}`);
  }

  const result = await response.json();
  return {
    nfceNumber: result.numero,
    accessKey: result.chaveAcesso,
    xml: result.xml,
  };
}
