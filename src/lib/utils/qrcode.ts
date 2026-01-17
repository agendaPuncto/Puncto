import QRCode from 'qrcode';

/**
 * Generate QR code data URL for a table
 */
export async function generateQRCodeDataUrl(
  tableUrl: string,
  options?: { width?: number; margin?: number }
): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(tableUrl, {
      width: options?.width || 300,
      margin: options?.margin || 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return dataUrl;
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    throw error;
  }
}

/**
 * Generate QR code as SVG string
 */
export async function generateQRCodeSvg(
  tableUrl: string,
  options?: { width?: number; margin?: number }
): Promise<string> {
  try {
    const svg = await QRCode.toString(tableUrl, {
      type: 'svg',
      width: options?.width || 300,
      margin: options?.margin || 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return svg;
  } catch (error) {
    console.error('Failed to generate QR code SVG:', error);
    throw error;
  }
}

/**
 * Generate table URL from business slug and table ID
 */
export function getTableUrl(businessSlug: string, tableId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/tenant/table/${tableId}?subdomain=${businessSlug}`;
}
