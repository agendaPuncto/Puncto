import './globals.css';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { QueryProvider } from '@/components/providers/QueryProvider';

export const metadata = {
  title: 'Puncto - Agendamentos',
  description: 'Plataforma de agendamentos para clínicas, salões e estabelecimentos',
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Puncto',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}