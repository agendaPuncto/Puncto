/**
 * Format phone input for Brazilian mobile: (00) 00000-0000
 * - Accepts only digits
 * - Limits to 11 digits (2 DDD + 9 digits)
 * - Strips Brazilian country code (55) if present
 */
export function formatPhoneInput(value: string): string {
  let numbers = value.replace(/\D/g, '');
  if (numbers.startsWith('55') && numbers.length > 11) {
    numbers = numbers.slice(2);
  }
  numbers = numbers.slice(0, 11);
  if (numbers.length <= 2) {
    return numbers ? `(${numbers}` : '';
  }
  if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
}
