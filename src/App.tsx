import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { RealtimeProvider, useRealtime } from './context/RealtimeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header, UserRole } from './components/common/Header';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { WorkerPortal } from './components/worker/WorkerPortal';
import { SocietyAdminPortal } from './components/society/SocietyAdminPortal';
import { FederationCommandPortal } from './components/federation/FederationCommandPortal';
import { SuperAdminPortal } from './components/admin/SuperAdminPortal';
import { DatasetBenchmarkModal } from './components/benchmark/DatasetBenchmarkModal';
import { BharatKaushalCare } from './components/chatbot/BharatKaushalCare';
import { AuthModalsContainer } from './components/auth/AuthModalsContainer';
import { LandingPage } from './components/landing/LandingPage';
import { UnifiedAuthExperience } from './components/auth/UnifiedAuthExperience';
import { MobileNavigation } from './components/common/MobileNavigation';
import { PlatformLoadingScreen } from './components/common/PlatformLoadingScreen';
import { SupportedLanguage } from './utils/i18n';
import {
  ShieldCheck,
  Building2,
  Info,
  X,
  PhoneCall,
  ExternalLink,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('bk_auth_worker');
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{t('Application_State_Recovered_bwnp0', `Application State Recovered`)}</h2>
              <p className="text-xs text-slate-600 mt-1">
                {t('A_rendering_conflict_occurred__5vjnt', `A rendering conflict occurred. You can restore the default session safely below.`)}</p>
            </div>
            {this.state.error && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-left font-mono text-[11px] text-slate-700 max-h-24 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              {t('Reset_Session___Reload_jatv1', `Reset Session & Reload`)}</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainAppContent() {
  const { isAccountLoggedIn } = useAuth();
  const [currentView, setCurrentView] = useState<'LANDING' | 'PORTAL'>('LANDING');
  const [currentRole, setCurrentRole] = useState<UserRole>('CUSTOMER');
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);
  const [isUnifiedAuthOpen, setIsUnifiedAuthOpen] = useState(false);
  const [unifiedAuthRole, setUnifiedAuthRole] = useState<UserRole>('CUSTOMER');
  const { toasts, dismissToast } = useRealtime();

  // Listen for navigation home events (e.g. on logout)
  useEffect(() => {
    const handleGoHome = () => {
      setCurrentView('LANDING');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('NAVIGATE_HOME', handleGoHome);
    window.addEventListener('ACCOUNT_LOGGED_OUT', handleGoHome);
    return () => {
      window.removeEventListener('NAVIGATE_HOME', handleGoHome);
      window.removeEventListener('ACCOUNT_LOGGED_OUT', handleGoHome);
    };
  }, []);

  // If no account is logged in, automatically keep view on LANDING
  useEffect(() => {
    if (!isAccountLoggedIn && currentView !== 'LANDING') {
      setCurrentView('LANDING');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isAccountLoggedIn, currentView]);

  const isPricingDatasetAllowed = ['SOCIETY_ADMIN', 'FEDERATION_ADMIN', 'SUPER_ADMIN'].includes(currentRole);

  useEffect(() => {
    if (!isPricingDatasetAllowed && isBenchmarkOpen) {
      setIsBenchmarkOpen(false);
    }
  }, [currentRole, isPricingDatasetAllowed, isBenchmarkOpen]);

  const handleOpenBenchmark = () => {
    if (isPricingDatasetAllowed) {
      setIsBenchmarkOpen(true);
    }
  };

  useEffect(() => {
    (window as any).__currentLang = lang;
    
    const triggerTranslation = () => {
      const gTranslateObj = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (gTranslateObj) {
        // Find if language is in the dropdown
        let found = false;
        for (let i = 0; i < gTranslateObj.options.length; i++) {
          if (gTranslateObj.options[i].value === lang) {
            found = true;
            break;
          }
        }
        
        if (found || lang === 'en') {
          gTranslateObj.value = lang === 'en' ? 'en' : lang;
          gTranslateObj.dispatchEvent(new Event('change'));
        }
      }
    };
    
    // Slight delay to ensure script loaded if changed immediately
    setTimeout(triggerTranslation, 500);
    setTimeout(triggerTranslation, 2000); // fallback
  }, [lang]);


  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 pb-24 sm:pb-0">
      {/* Toast Notification Container */}
      <div className="fixed top-14 right-4 z-[80] flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-3 rounded-xl shadow-lg border text-xs flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200 ${
              t.type === 'SUCCESS'
                ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                : t.type === 'ALERT'
                ? 'bg-rose-50 text-rose-950 border-rose-300'
                : t.type === 'WARNING'
                ? 'bg-amber-50 text-amber-950 border-amber-300'
                : 'bg-white text-slate-900 border-slate-200'
            }`}
          >
            <div>
              <div className="font-bold flex items-center gap-1.5">{t.title}</div>
              <div className="mt-0.5 opacity-90">{t.body}</div>
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="text-slate-400 hover:text-slate-700 p-0.5"
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Global Header - ONLY visible when an account is logged in */}
      {isAccountLoggedIn && (
        <Header
          currentRole={currentRole}
          onSelectRole={(role) => {
            setCurrentRole(role);
            setCurrentView('PORTAL');
          }}
          lang={lang}
          onSelectLang={setLang}
          onOpenBenchmark={handleOpenBenchmark}
          currentView={currentView}
          onNavigateHome={() => setCurrentView('LANDING')}
          onOpenUnifiedAuth={(role) => {
            setUnifiedAuthRole(role || currentRole);
            setIsUnifiedAuthOpen(true);
          }}
        />
      )}

      {/* View Switcher: Landing Page vs Portal Views */}
      {currentView === 'LANDING' ? (
        <LandingPage
          lang={lang}
          onSelectLang={setLang}
          onSelectRole={(role) => {
            setCurrentRole(role);
            setCurrentView('PORTAL');
          }}
          onOpenAuth={(role) => {
            setUnifiedAuthRole(role || 'CUSTOMER');
            setIsUnifiedAuthOpen(true);
          }}
          onOpenCustomerBooking={() => {
            if (isAccountLoggedIn) {
              setCurrentRole('CUSTOMER');
              setCurrentView('PORTAL');
            } else {
              setUnifiedAuthRole('CUSTOMER');
              setIsUnifiedAuthOpen(true);
            }
          }}
          onOpenWorkerMarketplace={() => {
            if (isAccountLoggedIn) {
              setCurrentRole('WORKER');
              setCurrentView('PORTAL');
            } else {
              setUnifiedAuthRole('WORKER');
              setIsUnifiedAuthOpen(true);
            }
          }}
          isAccountLoggedIn={isAccountLoggedIn}
        />
      ) : (
        /* Main Workspace Body */
        currentRole === 'SUPER_ADMIN' ? (
          <main className="flex-1 w-full dashboard-container" data-dashboard-container="true">
            <SuperAdminPortal />
          </main>
        ) : (
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 dashboard-container" data-dashboard-container="true">
            {currentRole === 'CUSTOMER' && (
              <CustomerPortal lang={lang} />
            )}

            {currentRole === 'WORKER' && (
              <WorkerPortal lang={lang} />
            )}

            {currentRole === 'SOCIETY_ADMIN' && (
              <SocietyAdminPortal lang={lang} />
            )}

            {currentRole === 'FEDERATION_ADMIN' && (
              <FederationCommandPortal lang={lang} />
            )}
          </main>
        )
      )}

      {/* Floating AI & Helpline Chatbot */}
      <BharatKaushalCare
        lang={lang}
        currentRole={currentRole}
        onOpenBenchmark={handleOpenBenchmark}
      />

      {/* Benchmark Dataset Modal - Restricted to Society Admin, Federation Admin, Super Admin */}
      <DatasetBenchmarkModal
        isOpen={isBenchmarkOpen && isPricingDatasetAllowed}
        onClose={() => setIsBenchmarkOpen(false)}
        currentRole={currentRole}
      />

      {/* Role-Specific Authentication Modals */}
      <AuthModalsContainer />

      {/* Mobile Persistent Navigation Bar (< 640px) - ONLY visible when logged in */}
      {isAccountLoggedIn && (
        <MobileNavigation
          currentRole={currentRole}
          onSelectRole={(role) => {
            setCurrentRole(role);
            setCurrentView('PORTAL');
          }}
          lang={lang}
          onSelectLang={setLang}
          onNavigateHome={() => setCurrentView('LANDING')}
        />
      )}

      {/* Unified Multi-Role Auth Experience Modal */}
      <UnifiedAuthExperience
        isOpen={isUnifiedAuthOpen}
        onClose={() => setIsUnifiedAuthOpen(false)}
        initialRole={unifiedAuthRole}
        lang={lang}
        onSelectLang={setLang}
        onSuccess={(authenticatedRole) => {
          setIsUnifiedAuthOpen(false);
          const finalRole = authenticatedRole || unifiedAuthRole;
          setCurrentRole(finalRole);
          setCurrentView('PORTAL');
        }}
      />
      {/* Statutory Footer - Visible only on logged-in portals */}
      {currentView === 'PORTAL' && (
        <footer className="bg-white border-t border-slate-200 mt-12 text-xs text-slate-500 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <ShieldCheck size={18} className="text-blue-700" />
                  <span>{t('Bharat_Kaushal_Cooperative_Lab_8wsb8', `Bharat Kaushal Cooperative Labour Platform`)}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {t('A_digitally_transparent__coope_mw360', `A digitally transparent, cooperative-owned labour platform operating under the Madhya Pradesh Cooperative Societies Act, 1960. 94.5% to 95.0% of every rupee spent goes directly to certified skilled workers.`)}</p>
              </div>

              <div>
                <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Building2 size={18} className="text-blue-700" />
                  <span>{t('Statutory_Compliance___Social__uwib8', `Statutory Compliance & Social Security`)}</span>
                </div>
                <ul className="mt-2 space-y-1 text-slate-600 text-[11px]">
                  <li>{t('__Unorganized_Workers_apos__So_g13lk', `• Unorganized Workers&apos; Social Security Act, 2008`)}</li>
                  <li>{t('__2_0__Automatic_Allocation_to_r739u', `• 2.0% Automatic Allocation to MP Labour Welfare Fund (MPSLWB)`)}</li>
                  <li>{t('__UIDAI_Aadhaar_Masking___Data_04tld', `• UIDAI Aadhaar Masking & Data Minimization Compliant`)}</li>
                  <li>{t('__100__Explainable_Algorithmic_uk0hj', `• 100% Explainable Algorithmic Trust Scores (Zero Black-Box De-platforming)`)}</li>
                </ul>
              </div>

              <div>
                <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <PhoneCall size={18} className="text-amber-600" />
                  <span>{t('Statutory_Helplines_0yfm3', `Statutory Helplines`)}</span>
                </div>
                <div className="mt-2 space-y-1.5 text-xs text-slate-600">
                  <div>
                    <strong>{t('National_Consumer_Helpline__3katp', `National Consumer Helpline:`)}</strong>{' '}
                    <a href="tel:1915" className="text-blue-700 font-semibold hover:underline">
                      {t('1915_c9ti9', `1915`)}</a>{' '}
                    {t('or_a6b4u', `or`)}{' '}
                    <a href="tel:1800114000" className="text-blue-700 font-semibold hover:underline">
                      {t('1800_11_4000_rgf46', `1800-11-4000`)}</a>{' '}
                    {t('_8_00_AM_to_8_00_PM__0o1ag', `(8:00 AM to 8:00 PM)`)}</div>
                  <div>
                    <strong>{t('Emergency_SOS___Police__dvipo', `Emergency SOS / Police:`)}</strong>{' '}
                    <a href="tel:112" className="text-rose-600 font-bold hover:underline">
                      {t('112_2ukc7', `112`)}</a>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1">
                    {t('IMC_Cooperative_Operations_Com_toke3', `IMC Cooperative Operations Command, Indore, Madhya Pradesh - 452001`)}</div>
                  </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
              <div>
                {t('__2026_Bharat_Kaushal__Coopera_6wocw', `© 2026 Bharat Kaushal. Cooperative Digital Public Infrastructure (DPI) for Fair Skilled Labour.`)}</div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {t('WebSocket_Engine_Online_fnvyr', `WebSocket Engine Online`)}</span>
                <span>{t('140_Indore_Service_Rates_Activ_h1yqv', `140 Indore Service Rates Active`)}</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <PlatformLoadingScreen />
      <RealtimeProvider>
        <AuthProvider>
          <MainAppContent />
        </AuthProvider>
      </RealtimeProvider>
    </ErrorBoundary>
  );
}
