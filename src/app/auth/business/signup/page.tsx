'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BusinessSignupPage() {
  const { signup, loading, user } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push('/onboarding/business');
    }
  }, [user, loading, router]);

  // Password strength indicator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, label: '', color: '' };
    if (pwd.length < 6) return { strength: 1, label: 'Fraca', color: 'bg-red-500' };
    if (pwd.length < 10) return { strength: 2, label: 'Média', color: 'bg-yellow-500' };
    if (pwd.length >= 10 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) {
      return { strength: 3, label: 'Forte', color: 'bg-green-500' };
    }
    return { strength: 2, label: 'Média', color: 'bg-yellow-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!termsAccepted || !privacyAccepted) {
      setError('Você deve aceitar os termos de uso e política de privacidade');
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(email, password, displayName);
      // Redirect to business onboarding flow
      router.push('/onboarding/business');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900">Puncto Business</h1>
          <p className="mt-2 text-neutral-600">Cadastre seu negócio e comece a crescer</p>
        </div>

        {/* Signup Form */}
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-neutral-700">
                Nome completo
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                placeholder="João Silva"
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                E-mail profissional
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                placeholder="seu@negocio.com"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all`}
                        style={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-neutral-600">{passwordStrength.label}</span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    Mínimo 6 caracteres. Recomendado: 10+ caracteres, letras maiúsculas e números
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700">
                Confirmar senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-600">As senhas não coincidem</p>
              )}
            </div>

            {/* LGPD Consent */}
            <div className="space-y-3 border-t border-neutral-200 pt-4">
              <div className="flex items-start gap-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-600"
                />
                <label htmlFor="terms" className="text-xs text-neutral-700">
                  Aceito os{' '}
                  <a href="/legal/terms" target="_blank" className="text-blue-600 hover:underline">
                    Termos de Uso
                  </a>{' '}
                  <span className="text-red-500">*</span>
                </label>
              </div>

              <div className="flex items-start gap-2">
                <input
                  id="privacy"
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-600"
                />
                <label htmlFor="privacy" className="text-xs text-neutral-700">
                  Aceito a{' '}
                  <a href="/legal/privacy" target="_blank" className="text-blue-600 hover:underline">
                    Política de Privacidade
                  </a>{' '}
                  e autorizo o tratamento dos meus dados pessoais conforme LGPD{' '}
                  <span className="text-red-500">*</span>
                </label>
              </div>

              <div className="flex items-start gap-2">
                <input
                  id="marketing"
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-600"
                />
                <label htmlFor="marketing" className="text-xs text-neutral-700">
                  Aceito receber dicas e novidades sobre gestão de negócios (opcional)
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            )}

            {/* Benefits Highlight */}
            <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">
              <p className="text-xs font-medium text-blue-900 mb-2">
                ✨ O que você terá acesso:
              </p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Agendamento online 24/7</li>
                <li>• Gestão de clientes e profissionais</li>
                <li>• Relatórios financeiros completos</li>
                <li>• Notificações automáticas via WhatsApp</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !displayName || !email || !password || !confirmPassword || !termsAccepted || !privacyAccepted}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-medium text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? 'Criando conta...' : 'Criar conta e continuar'}
            </button>
          </form>

          {/* Link to Login */}
          <div className="mt-6 text-center text-sm text-neutral-600">
            Já tem uma conta?{' '}
            <Link
              href="/auth/business/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Fazer login
            </Link>
          </div>
        </div>

        {/* Customer Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-600">
            É cliente de um negócio?{' '}
            <Link
              href="/auth/customer/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              Criar conta de cliente
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
