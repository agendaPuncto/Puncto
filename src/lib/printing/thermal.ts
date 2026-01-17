import { Order } from '@/types/restaurant';

/**
 * Generate ESC/POS commands for thermal printer
 * This creates a byte array that can be sent to ESC/POS compatible printers
 */
export function generateEscPosCommands(order: Order): Uint8Array {
  const commands: number[] = [];

  // Initialize printer
  commands.push(0x1B, 0x40); // ESC @ - Initialize printer

  // Center align and bold for header
  commands.push(0x1B, 0x61, 0x01); // ESC a 1 - Center align
  commands.push(0x1B, 0x45, 0x01); // ESC E 1 - Bold on
  addText(commands, 'PEDIDO #' + order.id.slice(0, 8) + '\n');
  addText(commands, 'Mesa ' + order.tableNumber + '\n');
  commands.push(0x1B, 0x45, 0x00); // ESC E 0 - Bold off
  commands.push(0x1B, 0x61, 0x00); // ESC a 0 - Left align

  // Date/time
  const now = new Date();
  addText(commands, now.toLocaleString('pt-BR') + '\n');
  addText(commands, '--------------------------------\n');

  // Items
  order.items.forEach((item, index) => {
    addText(commands, `${item.quantity}x ${item.name}\n`);
    if (item.notes) {
      addText(commands, `   Obs: ${item.notes}\n`);
    }
    const itemTotal = item.unitPrice * item.quantity;
    addText(commands, `   ${formatPrice(itemTotal)}\n`);
    if (index < order.items.length - 1) {
      addText(commands, '\n');
    }
  });

  addText(commands, '--------------------------------\n');
  addText(commands, `Subtotal: ${formatPrice(order.subtotal)}\n`);
  addText(commands, `Taxa: ${formatPrice(order.tax)}\n`);
  if (order.tip > 0) {
    addText(commands, `Gorjeta: ${formatPrice(order.tip)}\n`);
  }
  commands.push(0x1B, 0x45, 0x01); // Bold on
  addText(commands, `TOTAL: ${formatPrice(order.total)}\n`);
  commands.push(0x1B, 0x45, 0x00); // Bold off

  // Cut paper
  commands.push(0x1D, 0x56, 0x41, 0x03); // GS V A 3 - Partial cut

  return new Uint8Array(commands);
}

/**
 * Add text to command array (convert string to bytes)
 */
function addText(commands: number[], text: string): void {
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    if (charCode < 128) {
      commands.push(charCode);
    } else {
      // Handle special characters (simplified - in production, use proper encoding)
      commands.push(0x3F); // '?' as fallback
    }
  }
}

/**
 * Format price for printing
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price / 100);
}

/**
 * Convert ESC/POS commands to base64 for API transmission
 */
export function encodeEscPos(order: Order): string {
  const commands = generateEscPosCommands(order);
  // Convert to base64
  const binary = Array.from(commands)
    .map((byte) => String.fromCharCode(byte))
    .join('');
  return btoa(binary);
}
