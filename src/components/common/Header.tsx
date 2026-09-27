import React, { useState, useEffect, useRef } from 'react';
import { BharatKaushalLogo } from './BharatKaushalLogo';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useRealtime } from '../../context/RealtimeContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SupportedLanguage, SUPPORTED_LANGUAGES, getTranslation } from '../../utils/i18n';
import {
  Bell,
  RotateCcw,
  Database,
  Radio,
  User,
  HardHat,
  Building2,
  Sliders,
  X,
  PhoneCall,
  Shield,
  ShieldCheck,
  Users,
  KeyRound,
  LogIn,
  ChevronDown,
  ChevronUp,
  Check,
  Menu,
  LogOut,
  History,
  Wallet,
  Globe,
  Headphones,
  LifeBuoy,
  FileText,
  ClipboardList,
} from 'lucide-react';

import { UserRole } from '../../types';
export type { UserRole };

interface HeaderProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  lang: SupportedLanguage;
  onSelectLang: (lang: SupportedLanguage) => void;
  onOpenBenchmark: () => void;
  currentView?: 'LANDING' | 'PORTAL';
  onNavigateHome?: () => void;
  onOpenUnifiedAuth?: (role?: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onSelectRole,
  lang,
  onSelectLang,
  onOpenBenchmark,
  currentView = 'PORTAL',
  onNavigateHome,
  onOpenUnifiedAuth,
}) => {
  const { connectionStatus, notifications, resetDemo, bookings } = useRealtime();
  const { isStarryNight } = useTheme();
  const {
    customerUser,
    isCustomerAuthenticated,
    workerUser,
    isWorkerAuthenticated,
    societyAdminUser,
    isSocietyAdminAuthenticated,
    federationAdminUser,
    isFederationAdminAuthenticated,
    superAdminUser,
    isSuperAdminAuthenticated,
    openAuthModal,
    logoutCustomer,
    logoutWorker,
    logoutSocietyAdmin,
    logoutFederationAdmin,
    logoutSuperAdmin,
    logoutAll,
    availableAccounts,
  } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [isToggleMenuOpen, setIsToggleMenuOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const toggleMenuContainerRef = useRef<HTMLDivElement>(null);
  const mobileMenuContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideDesktop = toggleMenuContainerRef.current?.contains(target);
      const insideMobile = mobileMenuContainerRef.current?.contains(target);
      const desktopBtn = document.getElementById('btn-desktop-toggle-menu')?.contains(target);
      const mobileBtn = document.getElementById('btn-mobile-toggle-menu')?.contains(target);

      if (!insideDesktop && !insideMobile && !desktopBtn && !mobileBtn) {
        setIsToggleMenuOpen(false);
      }
    };
    if (isToggleMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isToggleMenuOpen]);

  const t = (key: string, fallback?: string) => getTranslation(lang, key, fallback);

  const handleReset = async () => {
    if (isResetting) return;
    setIsResetting(true);
    try {
      await resetDemo();
    } finally {
      setTimeout(() => {
        setIsResetting(false);
      }, 600);
    }
  };

  // Compute active user details based on currentRole
  const getRoleAuthInfo = () => {
    switch (currentRole) {
      case 'CUSTOMER':
        return {
          name: customerUser?.name || t('customer', 'Citizen Customer'),
          subtitle: isCustomerAuthenticated ? `+91 ${customerUser?.phone}` : t('clickToSignIn', 'Tap to Login / OTP'),
          isAuth: isCustomerAuthenticated,
          badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
          dotColor: 'bg-emerald-500',
          icon: <User size={13} className="text-emerald-700" />,
          roleLabel: t('customer', 'Customer'),
        };
      case 'WORKER':
        return {
          name: workerUser?.name || t('worker', 'Cooperative Worker'),
          subtitle: isWorkerAuthenticated ? `${workerUser?.primaryTrade} • Trust: ${workerUser?.trustScore}` : t('clickToSignIn', 'Tap to Login / PIN'),
          isAuth: isWorkerAuthenticated,
          badgeColor: 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100',
          dotColor: 'bg-amber-500',
          icon: <HardHat size={13} className="text-amber-700" />,
          roleLabel: t('worker', 'Worker'),
        };
      case 'SOCIETY_ADMIN':
        return {
          name: societyAdminUser?.name || t('societyAdmin', 'Society Officer'),
          subtitle: isSocietyAdminAuthenticated ? `${societyAdminUser?.societyName.split(' ')[0]} • DSC Active` : t('tapToAuthorize', 'Tap to Authorize'),
          isAuth: isSocietyAdminAuthenticated,
          badgeColor: 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100',
          dotColor: 'bg-blue-500',
          icon: <Building2 size={13} className="text-blue-700" />,
          roleLabel: t('societyAdmin', 'Society Admin'),
        };
      case 'FEDERATION_ADMIN':
        return {
          name: federationAdminUser?.name || t('federationAdmin', 'Command Clearance'),
          subtitle: isFederationAdminAuthenticated ? `${federationAdminUser?.clearanceLevel.replace(/_/g, ' ')}` : t('tapToAuthorize', 'Tap for 2FA Clearance'),
          isAuth: isFederationAdminAuthenticated,
          badgeColor: 'bg-purple-50 text-purple-950 border-purple-200 hover:bg-purple-100',
          dotColor: 'bg-purple-600',
          icon: <Shield size={13} className="text-purple-700" />,
          roleLabel: t('federationAdmin', 'Federation'),
        };
      case 'SUPER_ADMIN':
        return {
          name: superAdminUser?.name || 'Government Super Admin',
          subtitle: isSuperAdminAuthenticated
            ? `${superAdminUser?.officialDesignation || 'National Director'} • Level 5 Clearance`
            : 'Tap to Authorize Govt Login',
          isAuth: isSuperAdminAuthenticated,
          badgeColor: 'bg-amber-50 text-amber-950 border-amber-300 hover:bg-amber-100',
          dotColor: isSuperAdminAuthenticated ? 'bg-amber-500' : 'bg-slate-400',
          icon: <Shield size={13} className="text-amber-600" />,
          roleLabel: 'Super Admin',
        };
    }
  };

  
  

    useEffect(() => {
    const handleCycleLang = () => {
      const idx = SUPPORTED_LANGUAGES.findIndex(l => l.code === lang);
      const nextIdx = (idx + 1) % SUPPORTED_LANGUAGES.length;
      onSelectLang(SUPPORTED_LANGUAGES[nextIdx].code);
    };
    document.addEventListener('CYCLE_LANGUAGE', handleCycleLang);
    return () => document.removeEventListener('CYCLE_LANGUAGE', handleCycleLang);
  }, [lang, onSelectLang]);

  const activeAuthInfo = getRoleAuthInfo();

  const itemHoverClass = isStarryNight
    ? 'hover:bg-white/10 text-slate-200'
    : 'hover:bg-slate-50 text-slate-700';
  const dividerClass = isStarryNight ? 'bg-white/10' : 'bg-slate-100';
  const selectClass = isStarryNight
    ? 'bg-slate-800 text-slate-200 border-white/15 hover:bg-slate-700'
    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80';

  const renderToggleMenuItems = () => (
    <div className={`flex flex-col text-sm ${isStarryNight ? 'text-slate-200' : 'text-slate-700'}`}>
      {currentRole === 'CUSTOMER' && (
        <>
          <button
            id="btn-toggle-menu-profile"
            onClick={() => {
              setIsToggleMenuOpen(false);
              document.dispatchEvent(new CustomEvent('OPEN_PROFILE'));
            }}
            className={`flex items-center gap-3 px-4 py-2.5 transition-colors w-full text-left cursor-pointer ${itemHoverClass}`}
          >
            <User size={16} className={isStarryNight ? 'text-slate-400' : 'text-slate-500'} />
            <span className="font-medium">{t('Profile', 'Profile')}</span>
          </button>
          {/* Demo Profiles Button */}
          <button
            id="btn-toggle-menu-customer-demo-profiles"
            onClick={() => {
              setIsToggleMenuOpen(false);
              openAuthModal('CUSTOMER', 'DEMO');
            }}
            className={`flex items-center gap-3 px-4 py-2.5 transition-colors w-full text-left cursor-pointer ${itemHoverClass}`}
          >
            <Users size={16} className="text-emerald-500" />
            <span className={`font-medium ${isStarryNight ? 'text-white' : 'text-slate-800'}`}>
              {t('Demo_Profiles__3__ethvy', `Demo Profiles (${availableAccounts.customers.length})`)}
            </span>
          </button>
          <button
            id="btn-toggle-menu-booking-history-invoices"
            onClick={() => {
              setIsToggleMenuOpen(false);
              document.dispatchEvent(new CustomEvent('OPEN_HISTORY'));
            }}
            className={`flex items-center justify-between px-4 py-2.5 transition-colors w-full text-left cursor-pointer ${itemHoverClass}`}
          >
            <div className="flex items-center gap-3">
              <FileText size={16} className={isStarryNight ? 'text-slate-400' : 'text-slate-500'} />
              <span className="font-medium">{t('Booking_history___invoices', 'Booking history & invoices')}</span>
            </div>
            {bookings.some((b) => b.status === 'PAYMENT_PENDING') && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                Due
              </span>
            )}
          </button>

          {/* Language Selector in Customer Toggle Menu */}
          <div className={`px-4 py-2.5 flex items-center justify-between gap-3 transition-colors ${itemHoverClass}`}>
            <div className="flex items-center gap-3">
              <Globe size={16} className="text-blue-500" />
              <span className="font-medium">{t('Language', 'Language')}</span>
            </div>
            <div className="relative">
              <select
                id="toggle-menu-customer-lang"
                aria-label="Select Language"
                value={lang}
                onChange={(e) => {
                  onSelectLang(e.target.value as SupportedLanguage);
                }}
                className={`h-8 pl-2.5 pr-6 text-xs font-semibold rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none transition-colors border ${selectClass}`}
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className={isStarryNight ? 'bg-slate-900 text-white' : ''}>
                    {l.nativeName}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <button
            id="btn-customer-logout"
            onClick={() => {
              setIsToggleMenuOpen(false);
              logoutCustomer();
              onNavigateHome?.();
            }}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-rose-500/10 transition-colors w-full text-left text-rose-500 cursor-pointer"
          >
            <LogOut size={16} className="text-rose-500" />
            <span className="font-medium">{t('Logging_Out', 'Logging Out')}</span>
          </button>
          <div className={`h-px my-1 mx-2 ${dividerClass}`}></div>
          <button
            onClick={() => {
              setIsToggleMenuOpen(false);
              document.dispatchEvent(new CustomEvent('OPEN_SUPPORT'));
            }}
            className={`flex items-center gap-3 px-4 py-2.5 transition-colors w-full text-left cursor-pointer ${itemHoverClass}`}
          >
            <LifeBuoy size={16} className={isStarryNight ? 'text-slate-400' : 'text-slate-500'} />
            <span className="font-medium">{t('Support', 'Support')}</span>
          </button>
          <button
            onClick={() => {
              setIsToggleMenuOpen(false);
              document.dispatchEvent(new CustomEvent('OPEN_SUPPORT'));
            }}
            className={`flex items-center gap-3 px-4 py-2.5 transition-colors w-full text-left cursor-pointer ${itemHoverClass}`}
          >
            <Headphones size={16} className={isStarryNight ? 'text-slate-400' : 'text-slate-500'} />
            <span className="font-medium">{t('Customer_Care', 'Customer Care')}</span>
          </button>
        </>
      )}

      {currentRole === 'WORKER' && (
        <>
          <button
            id="btn-toggle-menu-worker-profile"
            onClick={() => {
              setIsToggleMenuOpen(false);
              document.dispatchEvent(new CustomEvent('OPEN_PROFILE'));
            }}
            className={`flex items-center gap-3 px-4 py-2.5 transition-colors w-full text-left cursor-pointer ${itemHoverClass}`}
          >
            <User size={16} className={isStarryNight ? 'text-slate-400' : 'text-slate-500'} />
            <span className="font-medium">{t('Profile', 'Profile')}</span>
          </button>
          {/* Switch Active Craftsman Button */}
          <button
            id="btn-toggle-menu-worker-switch-craftsman"
            onClick={() => {
              setIsToggleMenuOpen(false);
              openAuthModal('WORKER', 'DEMO');
            }}
            className={`flex items-center gap-3 px-4 py-2.5 transition-colors w-full text-left cursor-pointer ${itemHoverClass}`}
          >
            <HardHat size={16} className="text-amber-500" />
            <span className={`font-medium ${isStarryNight ? 'text-white' : 'text-slate-800'}`}>
              {t('Switch_Active_Craftsman___m3bbo', `Switch Active Craftsman (${availableAccounts.workers.length})`)}
            </span>
          </button>
          <button
            id="btn-toggle-menu-order-card"
            onClick={() => {
              setIsToggleMenuOpen(false);
              document.dispatchEvent(new CustomEvent('OPEN_ORDER_CARD'));
            }}
            className={`flex items-center gap-3 px-4 py-2.5 transition-colors w-full text-left cursor-pointer ${itemHoverClass}`}
          >
            <ClipboardList size={16} className={isStarryNight ? 'text-slate-400' : 'text-slate-500'} />
            <span className="font-medium">{t('Order_Card', 'Order Card')}</span>
          </button>
          <button
            id="btn-toggle-menu-income-history"
            onClick={() => {
              setIsToggleMenuOpen(false);
              document.dispatchEvent(new CustomEvent('OPEN_INCOME_HISTORY'));
            }}
            className={`flex items-center gap-3 px-4 py-2.5 transition-colors w-full text-left cursor-pointer ${itemHoverClass}`}
          >
            <Wallet size={16} className={isStarryNight ? 'text-slate-400' : 'text-slate-500'} />
            <span className="font-medium">{t('Income_History', 'Income History')}</span>
          </button>

          {/* Language Selector in Worker Toggle Menu */}
          <div className={`px-4 py-2.5 flex items-center justify-between gap-3 transition-colors ${itemHoverClass}`}>
            <div className="flex items-center gap-3">
              <Globe size={16} className="text-blue-500" />
              <span className="font-medium">{t('Language', 'Language')}</span>
            </div>
            <div className="relative">
              <select
                id="toggle-menu-worker-lang"
                aria-label="Select Language"
                value={lang}
                onChange={(e) => {
                  onSelectLang(e.target.value as SupportedLanguage);
                }}
                className={`h-8 pl-2.5 pr-6 text-xs font-semibold rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none transition-colors border ${selectClass}`}
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className={isStarryNight ? 'bg-slate-900 text-white' : ''}>
                    {l.nativeName}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <button
            id="btn-worker-logout"
            onClick={() => {
              setIsToggleMenuOpen(false);
              logoutWorker();
              onNavigateHome?.();
            }}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-rose-500/10 transition-colors w-full text-left text-rose-500 cursor-pointer"
          >
            <LogOut size={16} className="text-rose-500" />
            <span className="font-medium">{t('Logging_Out', 'Logging Out')}</span>
          </button>
          <div className={`h-px my-1 mx-2 ${dividerClass}`}></div>
          <button
            onClick={() => {
              setIsToggleMenuOpen(false);
              document.dispatchEvent(new CustomEvent('OPEN_SUPPORT'));
            }}
            className={`flex items-center gap-3 px-4 py-2.5 transition-colors w-full text-left cursor-pointer ${itemHoverClass}`}
          >
            <LifeBuoy size={16} className={isStarryNight ? 'text-slate-400' : 'text-slate-500'} />
            <span className="font-medium">{t('Support', 'Support')}</span>
          </button>
        </>
      )}

      {(currentRole === 'SOCIETY_ADMIN' || currentRole === 'FEDERATION_ADMIN' || currentRole === 'SUPER_ADMIN') && (
        <>
          {currentRole === 'SOCIETY_ADMIN' && (
            <button
              id="btn-toggle-menu-society-roster"
              onClick={() => {
                setIsToggleMenuOpen(false);
                openAuthModal('SOCIETY_ADMIN', 'DEMO');
              }}
              className={`flex items-center gap-3 px-4 py-2.5 transition-colors w-full text-left cursor-pointer ${itemHoverClass}`}
            >
              <Building2 size={16} className="text-blue-500" />
              <span className={`font-medium ${isStarryNight ? 'text-white' : 'text-slate-800'}`}>
                {t('Society_Registrar_Roster___z6lfo', `Society Registrar Roster (${availableAccounts.societyAdmins.length})`)}
              </span>
            </button>
          )}

          {currentRole === 'FEDERATION_ADMIN' && (
            <button
              id="btn-toggle-menu-federation-officers"
              onClick={() => {
                setIsToggleMenuOpen(false);
                openAuthModal('FEDERATION_ADMIN', 'DEMO');
              }}
              className={`flex items-center gap-3 px-4 py-2.5 transition-colors w-full text-left cursor-pointer ${itemHoverClass}`}
            >
              <Shield size={16} className="text-purple-500" />
              <span className={`font-medium ${isStarryNight ? 'text-white' : 'text-slate-800'}`}>
                {t('Command_Officers___cmzy3', `Command Officers (${availableAccounts.federationAdmins.length})`)}
              </span>
            </button>
          )}

          {currentRole === 'SUPER_ADMIN' && (
            <button
              id="btn-toggle-menu-superadmin-dignitaries"
              onClick={() => {
                setIsToggleMenuOpen(false);
                openAuthModal('SUPER_ADMIN', 'DEMO');
              }}
              className={`flex items-center gap-3 px-4 py-2.5 transition-colors w-full text-left cursor-pointer ${itemHoverClass}`}
            >
              <ShieldCheck size={16} className="text-amber-500" />
              <span className={`font-medium ${isStarryNight ? 'text-white' : 'text-slate-800'}`}>
                {t('Authorized_Dignitaries_g1hey', `Authorized Dignitaries`)}
              </span>
            </button>
          )}

          {/* Pricing Dataset Button in Admin Toggle Menu */}
          <button
            id="btn-toggle-menu-dataset-benchmark"
            onClick={() => {
              setIsToggleMenuOpen(false);
              onOpenBenchmark();
            }}
            className={`flex items-center gap-3 px-4 py-2.5 transition-colors w-full text-left cursor-pointer ${itemHoverClass}`}
          >
            <Database size={16} className="text-emerald-500" />
            <span className={`font-medium ${isStarryNight ? 'text-emerald-400' : 'text-emerald-800'}`}>
              {t('pricingDataset', 'Pricing Dataset (140)')}
            </span>
          </button>

          {/* Language Selector in Admin Toggle Menu */}
          <div className={`px-4 py-2.5 flex items-center justify-between gap-3 transition-colors ${itemHoverClass}`}>
            <div className="flex items-center gap-3">
              <Globe size={16} className="text-blue-500" />
              <span className="font-medium">{t('Language', 'Language')}</span>
            </div>
            <div className="relative">
              <select
                id="toggle-menu-admin-lang"
                aria-label="Select Language"
                value={lang}
                onChange={(e) => {
                  onSelectLang(e.target.value as SupportedLanguage);
                }}
                className={`h-8 pl-2.5 pr-6 text-xs font-semibold rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none transition-colors border ${selectClass}`}
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className={isStarryNight ? 'bg-slate-900 text-white' : ''}>
                    {l.nativeName}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <button
            id="btn-admin-logout"
            onClick={() => {
              setIsToggleMenuOpen(false);
              if (currentRole === 'SOCIETY_ADMIN') logoutSocietyAdmin();
              else if (currentRole === 'FEDERATION_ADMIN') logoutFederationAdmin();
              else if (currentRole === 'SUPER_ADMIN') logoutSuperAdmin();
              onNavigateHome?.();
            }}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-rose-500/10 transition-colors w-full text-left text-rose-500 cursor-pointer"
          >
            <LogOut size={16} className="text-rose-500" />
            <span className="font-medium">{t('Logging_Out', 'Logging Out')}</span>
          </button>
        </>
      )}
    </div>
  );

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-2xl border-b transition-colors duration-300 ${
      isStarryNight
        ? 'bg-[#020817]/92 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] text-slate-100'
        : 'bg-white/95 border-slate-200/90 shadow-xs text-slate-900'
    }`}>
      {/* Top micro-bar for Helplines & Realtime Status */}
      <div className={`text-xs px-3 sm:px-6 py-1 sm:py-1.5 flex flex-row items-center justify-between gap-1.5 sm:gap-2 border-b min-w-0 overflow-hidden ${
        isStarryNight ? 'bg-[#070d1e] text-slate-300 border-white/5' : 'bg-slate-900 text-slate-300 border-slate-800'
      }`}>
        <div className="flex items-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs min-w-0 overflow-hidden">
          <div className="flex items-center gap-1 sm:gap-1.5 font-medium text-emerald-400 shrink-0">
            <Radio size={11} className={connectionStatus === 'CONNECTED' ? 'animate-pulse text-emerald-400' : 'text-amber-400'} />
            <span className="hidden sm:inline">{connectionStatus === 'CONNECTED' ? 'WebSockets: Live Sync' : 'Reconnecting...'}</span>
            <span className="sm:hidden">{connectionStatus === 'CONNECTED' ? 'Live' : '...'}</span>
          </div>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-slate-400 truncate hidden md:inline">{t('Indore_Municipal_Corporation___d73zu', `Indore Municipal Corporation (IMC) Cooperative Labour Zone`)}</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 text-[9px] sm:text-[11px] shrink-0">
          <a
            href="tel:1915"
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors"
            title={t('National_Consumer_Helpline_dwo4g', `National Consumer Helpline`)}
          >
            <PhoneCall size={11} />
            <span className="hidden sm:inline">{t('National_Consumer_Helpline__3jpsq', `National Consumer Helpline:`)}</span>
            <strong>{t('1915_a94oz', `1915`)}</strong>
            <span className="hidden lg:inline">{t('_8_AM___8_PM__szw20', `(8 AM - 8 PM)`)}</span>
          </a>
          <span className="text-slate-600">|</span>
          <a
            href="tel:112"
            className="flex items-center gap-1 text-rose-400 hover:text-rose-300 font-semibold transition-colors"
            title={t('National_Emergency_Service_ktd88', `National Emergency Service`)}
          >
            <span className="hidden sm:inline">{t('Emergency_SOS__6cki1', `Emergency SOS:`)}</span>
            <strong>{t('112_f7utb', `112`)}</strong>
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4 relative min-w-0">
        {/* Brand Logo & Mobile Quick Controls */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-start gap-2 sm:gap-3 shrink-0">
          {onNavigateHome ? (
            <button
              id="btn-header-logo-home"
              onClick={onNavigateHome}
              className="cursor-pointer text-left focus:outline-none hover:opacity-90 transition-opacity"
              title="Return to Bharat Kaushal Home"
            >
              <BharatKaushalLogo size="md" inline={true} showTagline={false} />
            </button>
          ) : (
            <BharatKaushalLogo size="md" inline={true} showTagline={false} />
          )}
          
          {/* Mobile Quick Controls: Uniform touch targets, zero layout shift */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            <ThemeSwitcher variant="icon" />
            <button
              id="btn-mobile-reset-demo"
              onClick={handleReset}
              disabled={isResetting}
              title={t('Refresh_and_reset_data', `Refresh & Reset System Data`)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors shrink-0 cursor-pointer ${
                isStarryNight
                  ? 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 active:bg-white/20'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200/80 active:bg-slate-200'
              }`}
            >
              <RotateCcw size={15} className={isResetting ? 'animate-spin' : ''} />
            </button>
            <button
              id="btn-mobile-notifications-toggle"
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (isToggleMenuOpen) setIsToggleMenuOpen(false);
              }}
              title={t('Notifications', 'Notifications')}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors relative shrink-0 cursor-pointer ${
                showNotifications
                  ? isStarryNight
                    ? 'bg-blue-500/20 border border-blue-400/40 text-blue-300'
                    : 'bg-blue-50 border border-blue-200 text-blue-700'
                  : isStarryNight
                  ? 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 active:bg-white/20'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200/80 active:bg-slate-200'
              }`}
            >
              <Bell size={17} />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-blue-400 animate-pulse"></span>
              )}
            </button>
            <div className="relative shrink-0 flex items-center">
              <button
                id="btn-mobile-toggle-menu"
                onClick={() => {
                  const nextState = !isToggleMenuOpen;
                  setIsToggleMenuOpen(nextState);
                  if (showNotifications) setShowNotifications(false);
                }}
                title={t('Menu', 'Menu')}
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors shrink-0 cursor-pointer ${
                  isToggleMenuOpen
                    ? isStarryNight
                      ? 'bg-blue-500/20 border border-blue-400/40 text-blue-300'
                      : 'bg-blue-50 border border-blue-200 text-blue-700'
                    : isStarryNight
                    ? 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 active:bg-white/20'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200/80 active:bg-slate-200'
                }`}
              >
                <Menu size={17} />
              </button>

              {isToggleMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[1px]"
                    onClick={() => {
                      setIsToggleMenuOpen(false);
                    }}
                  />
                  <div
                    ref={mobileMenuContainerRef}
                    className={`absolute right-0 top-full mt-2 w-[calc(100vw-1.5rem)] max-w-xs rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[calc(100dvh-8rem)] overflow-y-auto ${
                      isStarryNight
                        ? 'bg-[#0b132b]/95 border border-white/15 text-slate-100 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)]'
                        : 'bg-white border border-slate-200/90 text-slate-900 shadow-2xl'
                    }`}
                  >
                    {renderToggleMenuItems()}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Multi-role Navigation Tabs - Dynamically adapts to any aspect ratio */}
        <div className={`hidden md:flex items-center p-1 rounded-xl border text-xs font-semibold overflow-x-auto no-scrollbar scroll-smooth max-w-full shrink min-w-0 ${
          isStarryNight ? 'bg-[#0b132b]/85 border-white/10' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            id="nav-role-customer"
            onClick={() => onSelectRole('CUSTOMER')}
            className={`flex items-center gap-1.5 px-2.5 lg:px-3.5 py-1.5 rounded-lg transition-all shrink-0 whitespace-nowrap cursor-pointer ${
              currentRole === 'CUSTOMER'
                ? 'bg-blue-600 text-white shadow-xs'
                : isStarryNight
                ? 'text-slate-300 hover:text-white hover:bg-white/10'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <User size={14} className="shrink-0" />
            <span>{t('customer', 'Customer')}</span>
          </button>

          <button
            id="nav-role-worker"
            onClick={() => onSelectRole('WORKER')}
            className={`flex items-center gap-1.5 px-2.5 lg:px-3.5 py-1.5 rounded-lg transition-all shrink-0 whitespace-nowrap cursor-pointer ${
              currentRole === 'WORKER'
                ? 'bg-blue-600 text-white shadow-xs'
                : isStarryNight
                ? 'text-slate-300 hover:text-white hover:bg-white/10'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <HardHat size={14} className="shrink-0" />
            <span>{t('worker', 'Cooperative Worker')}</span>
          </button>

          <button
            id="nav-role-society"
            onClick={() => onSelectRole('SOCIETY_ADMIN')}
            className={`flex items-center gap-1.5 px-2.5 lg:px-3.5 py-1.5 rounded-lg transition-all shrink-0 whitespace-nowrap cursor-pointer ${
              currentRole === 'SOCIETY_ADMIN'
                ? 'bg-blue-600 text-white shadow-xs'
                : isStarryNight
                ? 'text-slate-300 hover:text-white hover:bg-white/10'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Building2 size={14} className="shrink-0" />
            <span>
              <span className="hidden lg:inline">{t('society', 'Society')} </span>
              {t('Admin', 'Admin')}
            </span>
          </button>

          <button
            id="nav-role-federation"
            onClick={() => onSelectRole('FEDERATION_ADMIN')}
            className={`flex items-center gap-1.5 px-2.5 lg:px-3.5 py-1.5 rounded-lg transition-all shrink-0 whitespace-nowrap cursor-pointer ${
              currentRole === 'FEDERATION_ADMIN'
                ? 'bg-blue-600 text-white shadow-xs'
                : isStarryNight
                ? 'text-slate-300 hover:text-white hover:bg-white/10'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Sliders size={14} className="shrink-0" />
            <span>
              {t('Federation', 'Federation')}
              <span className="hidden xl:inline"> {t('Command', 'Command')}</span>
            </span>
          </button>

          <button
            id="nav-role-super-admin"
            onClick={() => onSelectRole('SUPER_ADMIN')}
            className={`flex items-center gap-1.5 px-2.5 lg:px-3.5 py-1.5 rounded-lg transition-all font-bold shrink-0 whitespace-nowrap cursor-pointer ${
              currentRole === 'SUPER_ADMIN'
                ? 'bg-amber-600 text-white shadow-xs'
                : isStarryNight
                ? 'text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30'
                : 'text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Shield size={14} className={`shrink-0 ${currentRole === 'SUPER_ADMIN' ? 'text-white' : 'text-amber-500'}`} />
            <span>{t('Super_Admin_d4d1r', `Super Admin`)}</span>
            <span className="hidden xl:inline text-[9px] bg-amber-400/20 text-amber-300 px-1 rounded uppercase tracking-wider font-mono">
              {t('Govt_2ti61', `Govt`)}</span>
          </button>
        </div>

        {/* Right Tools: Reset, Notifications, Desktop Toggle Menu */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 w-full md:w-auto shrink-0">

          {/* Desktop Action Tools Cluster: Theme Toggle, Reset, Notifications, Toggle Menu */}
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            {/* Theme Switcher Toggle */}
            <ThemeSwitcher variant="icon" />

            {/* Desktop Reset Demo State Button */}
            <button
              id="btn-reset-demo"
              onClick={handleReset}
              disabled={isResetting}
              title={t('Refresh_and_reset_data', `Refresh & Reset System Data`)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors shrink-0 cursor-pointer border ${
                isStarryNight
                  ? 'text-slate-300 hover:text-white hover:bg-white/10 border-white/10 active:bg-white/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200/80 active:bg-slate-200'
              }`}
            >
              <RotateCcw size={16} className={isResetting ? 'animate-spin' : ''} />
            </button>

            {/* Desktop Notifications Bell */}
            <div className="relative shrink-0 flex items-center">
              <button
                id="btn-notifications-toggle"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (isToggleMenuOpen) setIsToggleMenuOpen(false);
                }}
                title={t('Notifications', 'Notifications')}
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors relative shrink-0 cursor-pointer border ${
                  showNotifications
                    ? isStarryNight
                      ? 'bg-blue-500/20 border-blue-400/40 text-blue-300'
                      : 'bg-blue-50 border-blue-200 text-blue-700'
                    : isStarryNight
                    ? 'text-slate-300 hover:text-white hover:bg-white/10 border-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200/80'
                }`}
              >
                <Bell size={17} />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-blue-400 animate-pulse"></span>
                )}
              </button>
            </div>

            {/* Desktop Toggle Menu Button */}
            <div className="relative shrink-0 flex items-center">
              <button
                id="btn-desktop-toggle-menu"
                onClick={() => {
                  const nextState = !isToggleMenuOpen;
                  setIsToggleMenuOpen(nextState);
                  if (showNotifications) setShowNotifications(false);
                }}
                title={t('Menu', 'Menu')}
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors shrink-0 cursor-pointer border ${
                  isToggleMenuOpen
                    ? isStarryNight
                      ? 'bg-blue-500/20 border-blue-400/40 text-blue-300'
                      : 'bg-blue-50 border-blue-200 text-blue-700'
                    : isStarryNight
                    ? 'text-slate-300 hover:text-white hover:bg-white/10 border-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200/80'
                }`}
              >
                <Menu size={18} />
              </button>

              {isToggleMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => {
                      setIsToggleMenuOpen(false);
                    }}
                  />
                  <div
                    ref={toggleMenuContainerRef}
                    className={`absolute right-0 top-full mt-2 w-72 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[calc(100dvh-8rem)] overflow-y-auto ${
                      isStarryNight
                        ? 'bg-[#0b132b]/95 border border-white/15 text-slate-100 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)]'
                        : 'bg-white border border-slate-200/90 text-slate-900 shadow-2xl'
                    }`}
                  >
                    {renderToggleMenuItems()}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dropdown Menu (Renders absolutely, shared between mobile/desktop trigger) */}
        {showNotifications && (
          <>
            <div
              className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[1px]"
              onClick={() => setShowNotifications(false)}
            />
            <div className={`absolute right-3 sm:right-6 top-full mt-2 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[calc(100dvh-8rem)] overflow-y-auto ${
              isStarryNight
                ? 'bg-[#0b132b]/95 border border-white/15 text-slate-100 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)]'
                : 'bg-white border border-slate-200/90 text-slate-900 shadow-2xl'
            }`}>
              <div className={`px-4 py-2 border-b flex items-center justify-between ${
                isStarryNight ? 'border-white/10' : 'border-slate-100'
              }`}>
                <span className={`font-bold text-xs uppercase tracking-wider ${
                  isStarryNight ? 'text-slate-300' : 'text-slate-700'
                }`}>{t('realtimeStream', 'Real-time Stream')}</span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                    isStarryNight ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <X size={14} />
                </button>
              </div>
              <div className={`max-h-72 overflow-y-auto divide-y text-xs ${
                isStarryNight ? 'divide-white/10' : 'divide-slate-100'
              }`}>
                {notifications.length === 0 ? (
                  <div className={`p-4 text-center ${isStarryNight ? 'text-slate-400' : 'text-slate-400'}`}>
                    {t('noRecentAlerts', 'No recent alerts')}
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`p-3 transition-colors ${
                      isStarryNight ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                    }`}>
                      <div className={`font-semibold ${isStarryNight ? 'text-white' : 'text-slate-900'}`}>{n.title}</div>
                      <div className={`mt-0.5 ${isStarryNight ? 'text-slate-300' : 'text-slate-600'}`}>{n.body}</div>
                      <div className={`text-[10px] mt-1 ${isStarryNight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {new Date(n.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile Role Switcher Bar */}
      <div className={`md:hidden flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar px-2.5 sm:px-4 py-1.5 sm:py-2 border-t text-[11px] sm:text-xs font-semibold scroll-smooth transition-colors ${
        isStarryNight ? 'bg-[#070d1e]/95 border-white/10' : 'bg-slate-50 border-slate-200'
      }`}>
        <button
          onClick={() => onSelectRole('CUSTOMER')}
          className={`shrink-0 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            currentRole === 'CUSTOMER'
              ? 'bg-blue-600 text-white shadow-xs'
              : isStarryNight
              ? 'text-slate-300 hover:bg-white/10 hover:text-white'
              : 'text-slate-700 hover:bg-slate-200/60'
          }`}
        >
          <User size={13} />
          <span>{t('Customer_0hxu2', `Customer`)}</span>
        </button>
        <button
          onClick={() => onSelectRole('WORKER')}
          className={`shrink-0 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            currentRole === 'WORKER'
              ? 'bg-blue-600 text-white shadow-xs'
              : isStarryNight
              ? 'text-slate-300 hover:bg-white/10 hover:text-white'
              : 'text-slate-700 hover:bg-slate-200/60'
          }`}
        >
          <HardHat size={13} />
          <span>{t('Worker_m0acm', `Worker`)}</span>
        </button>
        <button
          onClick={() => onSelectRole('SOCIETY_ADMIN')}
          className={`shrink-0 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            currentRole === 'SOCIETY_ADMIN'
              ? 'bg-blue-600 text-white shadow-xs'
              : isStarryNight
              ? 'text-slate-300 hover:bg-white/10 hover:text-white'
              : 'text-slate-700 hover:bg-slate-200/60'
          }`}
        >
          <Building2 size={13} />
          <span>{t('Society_0e11t', `Society`)}</span>
        </button>
        <button
          onClick={() => onSelectRole('FEDERATION_ADMIN')}
          className={`shrink-0 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            currentRole === 'FEDERATION_ADMIN'
              ? 'bg-blue-600 text-white shadow-xs'
              : isStarryNight
              ? 'text-slate-300 hover:bg-white/10 hover:text-white'
              : 'text-slate-700 hover:bg-slate-200/60'
          }`}
        >
          <Sliders size={13} />
          <span>{t('Federation_r6vmj', `Federation`)}</span>
        </button>
        <button
          onClick={() => onSelectRole('SUPER_ADMIN')}
          className={`shrink-0 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-bold cursor-pointer ${
            currentRole === 'SUPER_ADMIN'
              ? 'bg-amber-600 text-white shadow-xs'
              : isStarryNight
              ? 'text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30'
              : 'text-amber-900 bg-amber-100 hover:bg-amber-200/80 border border-amber-300/60'
          }`}
        >
          <Shield size={13} className={currentRole === 'SUPER_ADMIN' ? 'text-white' : 'text-amber-400'} />
          <span>{t('Super_Admin_pagpx', `Super Admin`)}</span>
        </button>
      </div>
    </header>
  );
};
