'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await resetPassword(email);
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Puncto</h1>
          <p className="mt-2 text-neutral-600">Redefinir senha</p>
        </div>

        {/* Reset Password Form */}
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          {success ? (
            <div className="space-y-4">
              {/* Success Message */}
              <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-4 text-sm text-green-800">
                <p className="font-medium">E-mail enviado com sucesso!</p>
                <p className="mt-2">
                  Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                </p>
              </div>

              {/* Back to Login */}
              <Link
                href="/auth/login"
                className="block w-full text-center rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Voltar para login
              </Link>

              {/* Resend Email */}
              <button
                onClick={() => setSuccess(false)}
                className="block w-full text-center text-sm text-neutral-600 hover:text-neutral-900"
              >
                Não recebeu o e-mail? Tentar novamente
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Instructions */}
              <p className="text-sm text-neutral-600">
                Digite seu e-mail e enviaremos instruções para redefinir sua senha.
              </p>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  placeholder="seu@email.com"
                  autoComplete="email"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar link de redefinição'}
              </button>
            </form>
          )}

          {/* Link to Login */}
          {!success && (
            <div className="mt-6 text-center text-sm text-neutral-600">
              Lembrou sua senha?{' '}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Voltar para login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
