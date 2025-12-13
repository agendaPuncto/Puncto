import './globals.css';
import { AuthProvider } from '@/lib/contexts/AuthContext';

export const metadata = {
  title: 'Puncto - Agendamentos',
  description: 'Plataforma de agendamentos para clínicas, salões e estabelecimentos'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}