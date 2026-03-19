/**
 * Builds wa.me URL for opening WhatsApp with pre-filled message.
 * Phone is normalized to international format (Brazil: 55 + DDD + number).
 */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, '');
  let normalized = digits;

  // Brazilian numbers: if 10 or 11 digits without country code, add 55
  if (digits.length === 10 && digits.startsWith('1')) {
    // Landline: 1199999999 -> 551199999999
    normalized = '55' + digits;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    // Cell: 11999999999 -> 5511999999999
    normalized = '55' + digits;
  } else if (!digits.startsWith('55') && digits.length >= 10) {
    normalized = '55' + digits;
  }

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${normalized}?text=${encoded}`;
}
