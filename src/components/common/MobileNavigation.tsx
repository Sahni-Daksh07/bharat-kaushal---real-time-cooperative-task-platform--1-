import React, { useState } from 'react';
import { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useRealtime } from '../../context/RealtimeContext';
import { SupportedLanguage, SUPPORTED_LANGUAGES, getTranslation } from '../../utils/i18n';
import {
  Home,
  Briefcase,
  Calendar,
  Wallet,
  User,
  Search,
  MapPin,
  LifeBuoy,
  X,
  LogOut,
  Shield,
  Building2,
  HardHat,
  Sliders,
  Settings,
  HelpCircle,
  Menu,
  PhoneCall,
  FileText,
  ChevronRight,
  Globe,
  ChevronDown,
} from 'lucide-react';

interface MobileNavigationProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  lang: SupportedLanguage;
  onSelectLang?: (lang: SupportedLanguage) => void;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  onOpenProfile?: () => void;
  onOpenHistory?: () => void;
  onNavigateHome?: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentRole,
  onSelectRole,
  lang,
  onSelectLang,
  activeTab = 'HOME',
  onSelectTab,
  onOpenProfile,
  onOpenHistory,
  onNavigateHome,
}) => {
  const {
    customerUser,
    workerUser,
    societyAdminUser,
    federationAdminUser,
    superAdminUser,
    logoutCustomer,
    logoutWorker,
    logoutSocietyAdmin,
    logoutFederationAdmin,
    logoutSuperAdmin,
    openAuthModal,
  } = useAuth();

  const { bookings } = useRealtime();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<string>(
    activeTab || (currentRole === 'WORKER' ? 'DASHBOARD' : 'SERVICES')
  );

  const t = (key: string, fallback?: string) => getTranslation(lang, key, fallback);

  const handleTabClick = (tabKey: string, customEventName?: string) => {
    setActiveMobileTab(tabKey);
    onSelectTab?.(tabKey);
    if (customEventName) {
      document.dispatchEvent(new CustomEvent(customEventName));
    }
  };

  const getUserDetails = () => {
    switch (currentRole) {
      case 'WORKER':
        return {
          name: workerUser?.name || 'Rohit Sharma',
          roleTitle: `${workerUser?.primaryTrade || 'Electrician'} • Indore, MP`,
          trustScore: workerUser?.trustScore || 86,
          avatarInitials: 'RS',
          isAuth: !!workerUser,
        };
      case 'CUSTOMER':
        return {
          name: customerUser?.name || 'Priya Sharma',
          roleTitle: `Citizen Customer • Indore, MP`,
          trustScore: null,
          avatarInitials: 'PS',
          isAuth: !!customerUser,
        };
      case 'SOCIETY_ADMIN':
        return {
          name: societyAdminUser?.name || 'Rekha Malviya',
          roleTitle: `Society Registrar • SOC-IND-02`,
          trustScore: null,
          avatarInitials: 'RM',
          isAuth: !!societyAdminUser,
        };
      case 'FEDERATION_ADMIN':
        return {
          name: federationAdminUser?.name || 'Dr. Anand Verma',
          roleTitle: `Federation Directorate`,
          trustScore: null,
          avatarInitials: 'AV',
          isAuth: !!federationAdminUser,
        };
      case 'SUPER_ADMIN':
        return {
          name: superAdminUser?.name || 'Govt Director',
          roleTitle: `National Apex Clearance`,
          trustScore: null,
          avatarInitials: 'GD',
          isAuth: !!superAdminUser,
        };
    }
  };

  const user = getUserDetails();

  const handleLogout = () => {
    setIsDrawerOpen(false);
    if (currentRole === 'CUSTOMER') logoutCustomer();
    else if (currentRole === 'WORKER') logoutWorker();
    else if (currentRole === 'SOCIETY_ADMIN') logoutSocietyAdmin();
    else if (currentRole === 'FEDERATION_ADMIN') logoutFederationAdmin();
    else if (currentRole === 'SUPER_ADMIN') logoutSuperAdmin();
    onNavigateHome?.();
  };

  const hasPendingOrders = bookings.some(
    (b) => b.status === 'ACCEPTED' || b.status === 'TRAVELLING' || b.status === 'IN_PROGRESS' || b.status === 'WORKER_DISPATCHED'
  );

  return (
    <>
      {/* Persistent Native Mobile App Bottom Navigation Bar (< 640px) */}
      <nav
        aria-label="Mobile Navigation Dock"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-slate-200/90 px-3 py-1.5 flex items-center justify-around shadow-[0_-6px_25px_rgba(15,23,42,0.08)] select-none"
      >
        {currentRole === 'WORKER' ? (
          <>
            <button
              onClick={() => handleTabClick('DASHBOARD', 'OPEN_WORKER_DASHBOARD')}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl text-[10px] font-bold active:scale-95 transition-all ${
                activeMobileTab === 'DASHBOARD'
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Home size={19} strokeWidth={activeMobileTab === 'DASHBOARD' ? 2.5 : 2} />
              <span>Home</span>
              {activeMobileTab === 'DASHBOARD' && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-0.5 animate-in fade-in" />
              )}
            </button>

            <button
              onClick={() => handleTabClick('FIND_WORK', 'OPEN_FIND_WORK')}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl text-[10px] font-bold active:scale-95 transition-all ${
                activeMobileTab === 'FIND_WORK'
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Search size={19} strokeWidth={activeMobileTab === 'FIND_WORK' ? 2.5 : 2} />
              <span>Find Work</span>
              {activeMobileTab === 'FIND_WORK' && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-0.5 animate-in fade-in" />
              )}
            </button>

            <button
              onClick={() => handleTabClick('ORDER_CARD', 'OPEN_ORDER_CARD')}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl text-[10px] font-bold active:scale-95 transition-all relative ${
                activeMobileTab === 'ORDER_CARD'
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Briefcase size={19} strokeWidth={activeMobileTab === 'ORDER_CARD' ? 2.5 : 2} />
                {hasPendingOrders && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </div>
              <span>Jobs</span>
              {activeMobileTab === 'ORDER_CARD' && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-0.5 animate-in fade-in" />
              )}
            </button>

            <button
              onClick={() => handleTabClick('INCOME_HISTORY', 'OPEN_INCOME_HISTORY')}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl text-[10px] font-bold active:scale-95 transition-all ${
                activeMobileTab === 'INCOME_HISTORY'
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Wallet size={19} strokeWidth={activeMobileTab === 'INCOME_HISTORY' ? 2.5 : 2} />
              <span>Earnings</span>
              {activeMobileTab === 'INCOME_HISTORY' && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-0.5 animate-in fade-in" />
              )}
            </button>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl text-[10px] font-bold text-slate-500 hover:text-slate-800 active:scale-95 transition-all"
            >
              <User size={19} />
              <span>Profile</span>
            </button>
          </>
        ) : currentRole === 'CUSTOMER' ? (
          <>
            <button
              onClick={() => handleTabClick('SERVICES', 'OPEN_CUSTOMER_SERVICES')}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl text-[10px] font-bold active:scale-95 transition-all ${
                activeMobileTab === 'SERVICES'
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Home size={19} strokeWidth={activeMobileTab === 'SERVICES' ? 2.5 : 2} />
              <span>Services</span>
              {activeMobileTab === 'SERVICES' && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-0.5 animate-in fade-in" />
              )}
            </button>

            <button
              onClick={() => handleTabClick('HISTORY', 'OPEN_CUSTOMER_HISTORY')}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl text-[10px] font-bold active:scale-95 transition-all relative ${
                activeMobileTab === 'HISTORY'
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Calendar size={19} strokeWidth={activeMobileTab === 'HISTORY' ? 2.5 : 2} />
                {hasPendingOrders && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </div>
              <span>Bookings</span>
              {activeMobileTab === 'HISTORY' && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-0.5 animate-in fade-in" />
              )}
            </button>

            <button
              onClick={() => handleTabClick('MAP', 'OPEN_CUSTOMER_MAP')}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl text-[10px] font-bold active:scale-95 transition-all ${
                activeMobileTab === 'MAP'
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <MapPin size={19} strokeWidth={activeMobileTab === 'MAP' ? 2.5 : 2} />
              <span>Live Map</span>
              {activeMobileTab === 'MAP' && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-0.5 animate-in fade-in" />
              )}
            </button>

            <button
              onClick={() => {
                document.dispatchEvent(new CustomEvent('OPEN_SUPPORT'));
              }}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl text-[10px] font-bold text-slate-500 hover:text-slate-800 active:scale-95 transition-all"
            >
              <LifeBuoy size={19} />
              <span>Help</span>
            </button>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl text-[10px] font-bold text-slate-500 hover:text-slate-800 active:scale-95 transition-all"
            >
              <User size={19} />
              <span>Profile</span>
            </button>
          </>
        ) : (
          /* Admins Bottom Navigation */
          <>
            <button
              onClick={() => handleTabClick('OVERVIEW')}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl text-[10px] font-bold text-blue-600 active:scale-95 transition-all"
            >
              <Home size={19} strokeWidth={2.5} />
              <span>Command</span>
            </button>

            <button
              onClick={() => openAuthModal(currentRole)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl text-[10px] font-bold text-slate-500 active:scale-95 transition-all"
            >
              <Shield size={19} />
              <span>Clearance</span>
            </button>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl text-[10px] font-bold text-slate-500 active:scale-95 transition-all"
            >
              <Menu size={19} />
              <span>Menu</span>
            </button>
          </>
        )}
      </nav>

      {/* Slide-over Mobile Navigation Drawer (Mockup #1 Screen 11) */}
      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
            {/* Drawer Header & Profile */}
            <div className="p-5 border-b border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Navigation Menu</span>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              {/* User Identity Card */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                  {user.avatarInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-slate-900 truncate">{user.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{user.roleTitle}</div>
                  {user.trustScore && (
                    <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded mt-1">
                      Trust: {user.trustScore}/100
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 text-xs font-semibold text-slate-700">
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onSelectTab?.(currentRole === 'WORKER' ? 'DASHBOARD' : 'SERVICES');
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <Home size={16} className="text-slate-500" />
                <span>Home Dashboard</span>
              </button>

              {currentRole === 'WORKER' && (
                <>
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onSelectTab?.('FIND_WORK');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <Search size={16} className="text-slate-500" />
                    <span>Find Work Marketplace</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onSelectTab?.('ORDER_CARD');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <Briefcase size={16} className="text-slate-500" />
                    <span>My Jobs & Orders</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onSelectTab?.('INCOME_HISTORY');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <Wallet size={16} className="text-slate-500" />
                    <span>Earnings & Welfare</span>
                  </button>
                </>
              )}

              {currentRole === 'CUSTOMER' && (
                <>
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onSelectTab?.('SERVICES');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <Search size={16} className="text-slate-500" />
                    <span>Book a Service</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onSelectTab?.('HISTORY');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <FileText size={16} className="text-slate-500" />
                    <span>Booking History & Invoices</span>
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  document.dispatchEvent(new CustomEvent('OPEN_PROFILE'));
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <User size={16} className="text-slate-500" />
                <span>My Profile & Settings</span>
              </button>

              <div className="h-px bg-slate-100 my-2"></div>

              {/* Role Switcher in Drawer */}
              <div className="px-3 pt-1 pb-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Switch Active Role
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <button
                    onClick={() => {
                      onSelectRole('CUSTOMER');
                      setIsDrawerOpen(false);
                    }}
                    className={`p-2 rounded-lg border text-left font-medium ${
                      currentRole === 'CUSTOMER' ? 'bg-blue-50 border-blue-300 text-blue-800' : 'border-slate-200'
                    }`}
                  >
                    Citizen Customer
                  </button>
                  <button
                    onClick={() => {
                      onSelectRole('WORKER');
                      setIsDrawerOpen(false);
                    }}
                    className={`p-2 rounded-lg border text-left font-medium ${
                      currentRole === 'WORKER' ? 'bg-amber-50 border-amber-300 text-amber-800' : 'border-slate-200'
                    }`}
                  >
                    Coop Worker
                  </button>
                  <button
                    onClick={() => {
                      onSelectRole('SOCIETY_ADMIN');
                      setIsDrawerOpen(false);
                    }}
                    className={`p-2 rounded-lg border text-left font-medium ${
                      currentRole === 'SOCIETY_ADMIN' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'border-slate-200'
                    }`}
                  >
                    Society Admin
                  </button>
                  <button
                    onClick={() => {
                      onSelectRole('SUPER_ADMIN');
                      setIsDrawerOpen(false);
                    }}
                    className={`p-2 rounded-lg border text-left font-medium ${
                      currentRole === 'SUPER_ADMIN' ? 'bg-purple-50 border-purple-300 text-purple-800' : 'border-slate-200'
                    }`}
                  >
                    Super Admin
                  </button>
                </div>
              </div>

              <div className="h-px bg-slate-100 my-2"></div>

              {/* Language Selector */}
              {onSelectLang && (
                <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 text-slate-700">
                    <Globe size={16} className="text-blue-600" />
                    <span className="font-medium text-xs">Language</span>
                  </div>
                  <div className="relative">
                    <select
                      aria-label="Change Language"
                      value={lang}
                      onChange={(e) => onSelectLang(e.target.value as SupportedLanguage)}
                      className="h-8 pl-2.5 pr-6 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none"
                    >
                      {SUPPORTED_LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.nativeName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  document.dispatchEvent(new CustomEvent('OPEN_SUPPORT'));
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <LifeBuoy size={16} className="text-slate-500" />
                <span>Help & Helpline (1915)</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut size={16} />
                <span>Logout Session</span>
              </button>
            </div>

            {/* Bottom Tagline & Tricolor Ribbon */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center space-y-2">
              <div className="text-[10px] text-slate-500">Skills for a Stronger India</div>
              <div className="h-1 rounded-full bg-gradient-to-r from-amber-500 via-slate-300 to-emerald-500 mx-auto w-24"></div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
