'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functionality: boolean;
}

const COOKIE_CONSENT_KEY = 'puncto_cookie_consent';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always required
    analytics: false,
    marketing: false,
    functionality: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(consent);
        setPreferences(saved);
        applyPreferences(saved);
      } catch (e) {
        // Invalid stored data, show banner
        setIsVisible(true);
      }
    }
  }, []);

  const applyPreferences = (prefs: CookiePreferences) => {
    // Enable/disable analytics based on preferences
    if (prefs.analytics) {
      // Enable Google Analytics
      window.gtag?.('consent', 'update', {
        analytics_storage: 'granted',
      });
    } else {
      window.gtag?.('consent', 'update', {
        analytics_storage: 'denied',
      });
    }

    if (prefs.marketing) {
      // Enable Facebook Pixel and ad tracking
      window.gtag?.('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    } else {
      window.gtag?.('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
    applyPreferences(prefs);
    setIsVisible(false);
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      functionality: true,
    };
    setPreferences(allAccepted);
    savePreferences(allAccepted);
  };

  const acceptEssentialOnly = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      functionality: false,
    };
    setPreferences(essentialOnly);
    savePreferences(essentialOnly);
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
    setShowSettings(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="container-marketing">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-4xl mx-auto">
              {!showSettings ? (
                // Main banner
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <svg
                        className="w-6 h-6 text-primary-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <h3 className="font-semibold text-slate-900">
                        Sua privacidade é importante
                      </h3>
                    </div>
                    <p className="text-sm text-slate-600">
                      Usamos cookies para melhorar sua experiência, analisar o
                      tráfego do site e personalizar conteúdo. Ao clicar em
                      &quot;Aceitar todos&quot;, você concorda com o uso de cookies
                      conforme nossa{' '}
                      <Link
                        href="/legal/cookies"
                        className="text-primary-600 hover:underline"
                      >
                        Política de Cookies
                      </Link>
                      .
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button
                      onClick={() => setShowSettings(true)}
                      className="btn-ghost btn-sm text-slate-600"
                    >
                      Configurar
                    </button>
                    <button
                      onClick={acceptEssentialOnly}
                      className="btn-secondary btn-sm"
                    >
                      Apenas essenciais
                    </button>
                    <button onClick={acceptAll} className="btn-primary btn-sm">
                      Aceitar todos
                    </button>
                  </div>
                </div>
              ) : (
                // Settings panel
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-slate-900 text-lg">
                      Configurar cookies
                    </h3>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4 mb-6">
                    {/* Essential cookies */}
                    <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-slate-900">
                          Cookies essenciais
                        </h4>
                        <p className="text-sm text-slate-600">
                          Necessários para o funcionamento básico do site.
                          Não podem ser desativados.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={true}
                        disabled
                        className="mt-1 w-5 h-5 rounded border-slate-300"
                      />
                    </div>

                    {/* Analytics cookies */}
                    <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-slate-900">
                          Cookies de análise
                        </h4>
                        <p className="text-sm text-slate-600">
                          Nos ajudam a entender como você usa o site para
                          melhorar sua experiência.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            analytics: e.target.checked,
                          })
                        }
                        className="mt-1 w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>

                    {/* Marketing cookies */}
                    <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-slate-900">
                          Cookies de marketing
                        </h4>
                        <p className="text-sm text-slate-600">
                          Usados para mostrar anúncios relevantes e medir
                          a eficácia de campanhas.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            marketing: e.target.checked,
                          })
                        }
                        className="mt-1 w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>

                    {/* Functionality cookies */}
                    <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-slate-900">
                          Cookies de funcionalidade
                        </h4>
                        <p className="text-sm text-slate-600">
                          Lembram suas preferências como idioma e tema.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.functionality}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            functionality: e.target.checked,
                          })
                        }
                        className="mt-1 w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={acceptEssentialOnly}
                      className="btn-secondary btn-sm"
                    >
                      Apenas essenciais
                    </button>
                    <button
                      onClick={saveCustomPreferences}
                      className="btn-primary btn-sm"
                    >
                      Salvar preferências
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Export function to open cookie settings from footer
export function openCookieSettings() {
  // Clear stored consent to show banner again
  localStorage.removeItem(COOKIE_CONSENT_KEY);
  // Reload to trigger banner
  window.location.reload();
}
