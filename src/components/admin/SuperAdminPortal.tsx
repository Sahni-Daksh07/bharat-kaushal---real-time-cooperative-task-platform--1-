import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Award,
  MapPin,
  Users,
  Building2,
  Building,
  Wrench,
  Activity,
  Zap,
  IndianRupee,
  HeartHandshake,
  GraduationCap,
  TrendingUp,
  Brain,
  ShieldAlert,
  Layers,
  ShieldCheck,
  Sliders,
  Bell,
  HardDrive,
  FileText,
  Settings,
  ChevronRight,
  Shield,
  Search,
  Globe,
  RefreshCw,
  LogOut,
  Sparkles,
  Lock,
  KeyRound,
  UserPlus,
  ArrowRight,
  Fingerprint,
  Mail,
} from 'lucide-react';
import { EmailVerificationModal } from '../common/EmailVerificationModal';

// Import All Super Admin Views
import { NationalDashboardView } from '../superAdmin/views/NationalDashboardView';
import { GovernmentImpactView } from '../superAdmin/views/GovernmentImpactView';
import { NationalMapView } from '../superAdmin/views/NationalMapView';
import { WorkforceCommandView } from '../superAdmin/views/WorkforceCommandView';
import { SocietyManagementView } from '../superAdmin/views/SocietyManagementView';
import { FederationManagementView } from '../superAdmin/views/FederationManagementView';
import { ServicesDirectoryView } from '../superAdmin/views/ServicesDirectoryView';
import { BookingIntelligenceView } from '../superAdmin/views/BookingIntelligenceView';
import { DispatchIntelligenceView } from '../superAdmin/views/DispatchIntelligenceView';
import { FinanceCommandView } from '../superAdmin/views/FinanceCommandView';
import { WelfareCommandView } from '../superAdmin/views/WelfareCommandView';
import { SkillDevelopmentView } from '../superAdmin/views/SkillDevelopmentView';
import { DemandForecastingView } from '../superAdmin/views/DemandForecastingView';
import { AiIntelligenceView } from '../superAdmin/views/AiIntelligenceView';
import { FraudRiskView } from '../superAdmin/views/FraudRiskView';
import { IntegrationsView } from '../superAdmin/views/IntegrationsView';
import { AuditLogsView } from '../superAdmin/views/AuditLogsView';
import { PoliciesView } from '../superAdmin/views/PoliciesView';
import { NotificationsView } from '../superAdmin/views/NotificationsView';
import { SystemHealthView } from '../superAdmin/views/SystemHealthView';
import { ReportsView } from '../superAdmin/views/ReportsView';
import { SettingsView } from '../superAdmin/views/SettingsView';

export type SuperAdminTab =
  | 'DASHBOARD'
  | 'GOVERNMENT_IMPACT'
  | 'NATIONAL_MAP'
  | 'WORKFORCE'
  | 'SOCIETIES'
  | 'FEDERATIONS'
  | 'SERVICES'
  | 'BOOKINGS'
  | 'DISPATCH'
  | 'FINANCE'
  | 'WELFARE'
  | 'SKILLS'
  | 'FORECASTING'
  | 'AI_INTELLIGENCE'
  | 'FRAUD_RISK'
  | 'INTEGRATIONS'
  | 'AUDIT_LOGS'
  | 'POLICIES'
  | 'NOTIFICATIONS'
  | 'SYSTEM_HEALTH'
  | 'REPORTS'
  | 'SETTINGS';

interface NavGroup {
  label: string;
  items: {
    id: SuperAdminTab;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    badge?: string;
    badgeColor?: string;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Governance & Impact',
    items: [
      { id: 'DASHBOARD', label: 'National Command', icon: LayoutDashboard },
      { id: 'GOVERNMENT_IMPACT', label: 'Government Impact', icon: Award, badge: 'Pivotal', badgeColor: 'bg-amber-500' },
      { id: 'NATIONAL_MAP', label: 'Geospatial Radar', icon: MapPin },
    ],
  },
  {
    label: 'Workforce & Cooperatives',
    items: [
      { id: 'WORKFORCE', label: 'Artisan Registry', icon: Users, badge: '184k', badgeColor: 'bg-emerald-600' },
      { id: 'SOCIETIES', label: 'Cooperative Societies', icon: Building2 },
      { id: 'FEDERATIONS', label: 'Apex Federations', icon: Building },
      { id: 'SKILLS', label: 'Skills & RPL Training', icon: GraduationCap },
    ],
  },
  {
    label: 'Operations & Dispatch',
    items: [
      { id: 'BOOKINGS', label: 'Booking Analytics', icon: Activity },
      { id: 'DISPATCH', label: 'Dispatch Intelligence', icon: Zap },
      { id: 'SERVICES', label: 'Services & Price Bands', icon: Wrench },
    ],
  },
  {
    label: 'Finance & Social Welfare',
    items: [
      { id: 'FINANCE', label: 'Finance Command (94.5%)', icon: IndianRupee, badge: '₹128Cr', badgeColor: 'bg-blue-600' },
      { id: 'WELFARE', label: 'Welfare Fund (2.0%)', icon: HeartHandshake, badge: '₹2.5Cr', badgeColor: 'bg-teal-600' },
    ],
  },
  {
    label: 'Predictive & Risk Intelligence',
    items: [
      { id: 'FORECASTING', label: 'Demand Forecasting', icon: TrendingUp },
      { id: 'AI_INTELLIGENCE', label: 'AI Strategy & Advice', icon: Brain, badge: 'AI', badgeColor: 'bg-indigo-600' },
      { id: 'FRAUD_RISK', label: 'Fraud & Threat Center', icon: ShieldAlert, badge: '2', badgeColor: 'bg-rose-600' },
    ],
  },
  {
    label: 'Compliance, Gateways & Admin',
    items: [
      { id: 'INTEGRATIONS', label: 'DPI Gateways (e-Shram)', icon: Layers },
      { id: 'AUDIT_LOGS', label: 'Statutory Audit Trail', icon: ShieldCheck },
      { id: 'POLICIES', label: 'Cooperative Policies', icon: Sliders },
      { id: 'NOTIFICATIONS', label: 'National Broadcasts', icon: Bell },
      { id: 'SYSTEM_HEALTH', label: 'Infrastructure Health', icon: HardDrive },
      { id: 'REPORTS', label: 'Statutory Reports', icon: FileText },
      { id: 'SETTINGS', label: 'Security & Access (RBAC)', icon: Settings },
    ],
  },
];

export const SuperAdminPortal: React.FC = () => {
  const {
    superAdminUser,
    isSuperAdminAuthenticated,
    openAuthModal,
    logoutSuperAdmin,
    switchSuperAdmin,
    availableAccounts,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<SuperAdminTab>('DASHBOARD');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'SA';
    const parts = name.replace(/Dr\.|Shri|Smt\.|IAS|IES/g, '').trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  // If console is locked / officer logged out
  if (!isSuperAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient National Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center mx-auto text-white shadow-lg border border-amber-400/40">
            <Lock size={32} />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Shield size={13} />
              <span>{t('National_Security_Architecture_bcsxe', `National Security Architecture Level 5`)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t('Apex_Command_Console_Locked_gcat7', `Apex Command Console Locked`)}</h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              {t('Access_to_the_National_Workfor_uuejp', `Access to the National Workforce Governance & Cooperative Intelligence System requires authenticated Government Ministerial Clearance.`)}</p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => openAuthModal('SUPER_ADMIN')}
              className="py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <KeyRound size={15} />
              <span>{t('Officer_Sign_In_yr5xx', `Officer Sign In`)}</span>
            </button>

            <button
              onClick={() => openAuthModal('SUPER_ADMIN')}
              className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 hover:border-amber-500/40 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
            >
              <UserPlus size={15} />
              <span>{t('Register_Personnel_obv7s', `Register Personnel`)}</span>
            </button>
          </div>

          {/* One-Tap Dignitary Selection */}
          <div className="border-t border-slate-800 pt-5 space-y-3 text-left">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>{t('Or_Unlock_with_Authorized_Mini_gizcx', `Or Unlock with Authorized Ministry Dignitary:`)}</span>
              <Fingerprint size={14} className="text-amber-400" />
            </div>

            <div className="space-y-2">
              {availableAccounts.superAdmins.map((admin) => (
                <button
                  key={admin.id}
                  onClick={() => {
                    switchSuperAdmin(admin);
                  }}
                  className="w-full p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/40 rounded-xl transition-all flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap justify-center items-center gap-2">
                      <span className="font-bold text-white text-xs group-hover:text-amber-300">
                        {admin.name}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {admin.id}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {admin.officialDesignation} • {admin.ministry}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{t('Unlock_bbndk', `Unlock`)}</span>
                    <ArrowRight size={13} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* 1. National Sovereign Top Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800 px-3 sm:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-black shadow-inner shrink-0">
            <Shield size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-black tracking-tight text-white uppercase whitespace-nowrap">
                {t('Bharat_Kaushal_gxrdr', `Bharat Kaushal`)}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 whitespace-nowrap">
                {t('GOVERNMENT_OF_INDIA_lmlru', `GOVERNMENT OF INDIA`)}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 whitespace-nowrap">
                {t('APEX_LEVEL_5_83595', `APEX LEVEL 5`)}</span>
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {t('National_Workforce_Governance__m23az', `National Workforce Governance & Cooperative Intelligence System`)}</div>
          </div>
        </div>

        {/* User Identity & Global Telemetry Status */}
        <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-3 text-xs w-full md:w-auto shrink-0">
          <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">{t('Live_Telemetry__oww28', `Live Telemetry:`)}</span>
            <span className="text-white font-bold font-mono">{t('184_520_Artisans_Synchronized_220ae', `184,520 Artisans Synchronized`)}</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap justify-end w-full md:w-auto">
            <button
              onClick={() => openAuthModal('SUPER_ADMIN')}
              title={t('Register_New_Ministry_Official_bb7rq', `Register New Ministry Official`)}
              className="h-9 hidden sm:flex items-center gap-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-bold text-xs transition-colors shrink-0 whitespace-nowrap"
            >
              <UserPlus size={13} />
              <span>{t('Register_lnpok', `Register`)}</span>
            </button>

            <button
              onClick={handleRefresh}
              title={t('Refresh_National_Realtime_Tele_arf55', `Refresh National Realtime Telemetry`)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 shrink-0"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            </button>

            {/* Email Status Button */}
            <button
              onClick={() => setIsEmailModalOpen(true)}
              title={t('Official_Government_Email_Veri_op4zf', `Official Government Email Verification & Settings (Optional)`)}
              className={`h-9 flex items-center justify-center gap-1.5 px-3 rounded-xl border text-xs font-bold transition-colors shrink-0 whitespace-nowrap ${
                superAdminUser?.emailVerified
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                  : 'bg-slate-800 hover:bg-slate-750 text-amber-400 border-slate-700'
              }`}
            >
              <Mail size={13} className="shrink-0" />
              <span className="hidden sm:inline">
                {superAdminUser?.emailVerified ? '✓ Verified' : 'Verify Email'}
              </span>
            </button>

            {/* Officer Designation Badge */}
            <div
              className="h-9 bg-slate-800 px-2.5 sm:px-3 rounded-xl border border-slate-700 flex items-center gap-2 text-left shrink-0"
            >
              <div className="text-right hidden sm:block">
                <div className="font-bold text-white leading-tight truncate max-w-[130px]">
                  {superAdminUser?.name || 'Dr. Amitabh Verma, IAS'}
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[130px]">
                  {superAdminUser?.officialDesignation || 'Joint Secretary, MoL&E'}
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-xs shadow-xs shrink-0">
                {getInitials(superAdminUser?.name)}
              </div>
            </div>

            {/* Logout / Lock Button */}
            <button
              id="btn-superadmin-lock"
              onClick={() => logoutSuperAdmin()}
              title={t('Lock_Console___Sign_Out_of_Sov_ihq2s', `Lock Console & Sign Out of Sovereign System`)}
              className="h-9 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 transition-colors flex items-center justify-center gap-1 px-2.5 shrink-0"
            >
              <LogOut size={13} />
              <span className="text-[11px] font-bold hidden sm:inline">{t('Lock_hst6v', `Lock`)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Module Switcher */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs font-semibold scroll-smooth shrink-0">
        {NAV_GROUPS.flatMap((g) => g.items).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-white' : 'text-slate-500'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Main Body Container with Sidebar and Dynamic Content View */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Navigation Sidebar */}
        <aside className="hidden md:flex w-52 lg:w-64 bg-white border-r border-slate-200 flex-col shrink-0 overflow-y-auto max-h-[calc(100dvh-60px)]">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>{t('Governance_Command_ecpfl', `Governance Command`)}</span>
            <span className="font-mono text-[10px] text-blue-600 font-bold">{t('22_Modules_jin2s', `22 Modules`)}</span>
          </div>

          <div className="p-3 space-y-5">
            {NAV_GROUPS.map((grp) => (
              <div key={grp.label} className="space-y-1">
                <div className="px-2 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  {grp.label}
                </div>
                <div className="space-y-0.5">
                  {grp.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-xs font-bold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[9px] font-black text-white font-mono shrink-0 ${
                              item.badgeColor || 'bg-slate-400'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 py-4 sm:p-6 lg:p-8 space-y-6 dashboard-container" data-dashboard-container="true">
          {/* Breadcrumbs Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-bold text-slate-900">{t('National_Governance_wktoy', `National Governance`)}</span>
              <ChevronRight size={13} />
              <span className="text-blue-700 font-semibold uppercase font-mono text-[11px]">
                {activeTab.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[11px] text-slate-400">{t('Statutory_Framework__k3kp8', `Statutory Framework:`)}</span>
              <span className="font-mono font-bold text-slate-700 bg-slate-200/70 px-2 py-0.5 rounded">
                {t('Multi_State_Co_op_Societies_Ac_cq8dg', `Multi-State Co-op Societies Act 2002`)}</span>
            </div>
          </div>

          {/* Render Active View Component */}
          {activeTab === 'DASHBOARD' && <NationalDashboardView onNavigateSection={(tab) => setActiveTab(tab as any)} />}
          {activeTab === 'GOVERNMENT_IMPACT' && <GovernmentImpactView />}
          {activeTab === 'NATIONAL_MAP' && <NationalMapView />}
          {activeTab === 'WORKFORCE' && <WorkforceCommandView />}
          {activeTab === 'SOCIETIES' && <SocietyManagementView />}
          {activeTab === 'FEDERATIONS' && <FederationManagementView />}
          {activeTab === 'SERVICES' && <ServicesDirectoryView />}
          {activeTab === 'BOOKINGS' && <BookingIntelligenceView />}
          {activeTab === 'DISPATCH' && <DispatchIntelligenceView />}
          {activeTab === 'FINANCE' && <FinanceCommandView />}
          {activeTab === 'WELFARE' && <WelfareCommandView />}
          {activeTab === 'SKILLS' && <SkillDevelopmentView />}
          {activeTab === 'FORECASTING' && <DemandForecastingView />}
          {activeTab === 'AI_INTELLIGENCE' && <AiIntelligenceView />}
          {activeTab === 'FRAUD_RISK' && <FraudRiskView />}
          {activeTab === 'INTEGRATIONS' && <IntegrationsView />}
          {activeTab === 'AUDIT_LOGS' && <AuditLogsView />}
          {activeTab === 'POLICIES' && <PoliciesView />}
          {activeTab === 'NOTIFICATIONS' && <NotificationsView />}
          {activeTab === 'SYSTEM_HEALTH' && <SystemHealthView />}
          {activeTab === 'REPORTS' && <ReportsView />}
          {activeTab === 'SETTINGS' && <SettingsView />}
        </main>
      </div>

      {/* Sovereign Officer Email Verification Modal */}
      <EmailVerificationModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        role="SUPER_ADMIN"
      />
    </div>
  );
};
