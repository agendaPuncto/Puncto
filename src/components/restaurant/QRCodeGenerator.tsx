'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { generateQRCodeDataUrl } from '@/lib/utils/qrcode';

interface QRCodeGeneratorProps {
  tableUrl: string;
  tableNumber: string;
}

export function QRCodeGenerator({ tableUrl, tableNumber }: QRCodeGeneratorProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    generateQR();
  }, [tableUrl]);

  const generateQR = async () => {
    try {
      setIsGenerating(true);
      const dataUrl = await generateQRCodeDataUrl(tableUrl, { width: 300 });
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `qr-code-mesa-${tableNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center h-64 bg-neutral-50 rounded-lg">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-900"></div>
      </div>
    );
  }

  if (!qrCodeDataUrl) {
    return (
      <div className="flex items-center justify-center h-64 bg-neutral-50 rounded-lg">
        <p className="text-neutral-500">Erro ao gerar QR code</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-white p-4 rounded-lg border border-neutral-200">
        <Image
          src={qrCodeDataUrl}
          alt={`QR Code Mesa ${tableNumber}`}
          width={300}
          height={300}
          className="rounded"
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-neutral-700 mb-2">
          Mesa {tableNumber}
        </p>
        <button
          onClick={downloadQR}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800"
        >
          Baixar QR Code
        </button>
      </div>
    </div>
  );
}
