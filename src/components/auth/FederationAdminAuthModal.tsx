import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  KeyRound,
  Lock,
  ArrowRight,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Cpu,
  BadgeAlert,
  Flame,
  Globe2,
  Mail,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FederationAdminProfile } from '../../types';

interface FederationAdminAuthModalProps {
  isOpen: boolean;
  initialTab?: 'LOGIN' | 'DEMO';
  onClose: () => void;
  onSuccess?: () => void;
}

export const FederationAdminAuthModal: React.FC<FederationAdminAuthModalProps> = ({
  isOpen,
  initialTab,
  onClose,
  onSuccess,
}) => {
  const {
    federationAdminUser,
    isFederationAdminAuthenticated,
    loginFederationAdmin,
    logoutFederationAdmin,
    switchFederationAdmin,
    availableAccounts,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'LOGIN' | 'DEMO'>(initialTab || 'LOGIN');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);
  const [officerId, setOfficerId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [clearanceLevel, setClearanceLevel] = useState<'LEVEL_4_EXECUTIVE' | 'LEVEL_3_DIRECTOR' | 'LEVEL_2_IMC_COMMAND'>('LEVEL_4_EXECUTIVE');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleFederationLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const res = await loginFederationAdmin({
      officerId,
      clearanceCode: clearanceLevel,
      passcode,
    });
    setLoading(false);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message || 'Federation Command Clearance Granted!' });
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 700);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Authorization denied' });
    }
  };

  const handleSelectOfficer = (officer: FederationAdminProfile) => {
    switchFederationAdmin(officer);
    setOfficerId(officer.id);
    setClearanceLevel(officer.clearanceLevel);
    setFeedback({ type: 'success', message: `Clearance switched to ${officer.name} (${officer.clearanceLevel})` });
    setTimeout(() => {
      onSuccess?.();
      onClose();
    }, 500);
  };

  return (
    <div
      id="federation-admin-auth-modal"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white flex items-center justify-between border-b border-purple-900/50">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-400/30">
              <Shield className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-base tracking-tight text-white">{t('Federation_Command_Auth_vnpoi', `Federation Command Auth`)}</h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 font-medium border border-purple-400/30">
                  {t('Apex_State_Command_8sbij', `Apex State Command`)}</span>
              </div>
              <p className="text-xs text-purple-200/80">{t('MP_State_Cooperative_Labour_Fe_2ra7h', `MP State Cooperative Labour Federation & IMC Command`)}</p>
            </div>
          </div>
          <button
            id="close-federation-auth-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Authenticated Status Bar */}
        <div className="px-6 py-3 bg-purple-50/50 border-b border-purple-100 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${isFederationAdminAuthenticated ? 'bg-purple-600 ring-4 ring-purple-100' : 'bg-slate-400'}`} />
            <div>
              <div className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                {isFederationAdminAuthenticated ? federationAdminUser?.name : 'Command Clearance Unverified'}
                {isFederationAdminAuthenticated && (
                  <>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-purple-100 text-purple-800 font-mono font-medium border border-purple-200">
                      {federationAdminUser?.clearanceLevel}
                    </span>
                    {federationAdminUser?.email && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                        federationAdminUser.emailVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {federationAdminUser.emailVerified ? '✓ Email Verified' : 'Email Unverified'}
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className="text-[11px] text-slate-600">
                {isFederationAdminAuthenticated
                  ? `${federationAdminUser?.department} • ${federationAdminUser?.email || 'No email registered'} • ID: ${federationAdminUser?.id}`
                  : 'Requires Executive Clearance to inspect state metrics & override policy'}
              </div>
            </div>
          </div>
          {isFederationAdminAuthenticated && (
            <button
              id="federation-logout-btn"
              onClick={logoutFederationAdmin}
              className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-md transition-colors w-full sm:w-auto flex items-center justify-center sm:justify-start gap-1.5 border border-rose-200 shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              {t('Sign_Out_lgdtk', `Sign Out`)}</button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100/50 p-1.5 gap-1 text-xs font-medium">
          <button
            id="fed-tab-login"
            onClick={() => { setActiveTab('LOGIN'); setFeedback(null); }}
            className={`flex-1 py-2 px-3 rounded-lg text-center transition-all ${
              activeTab === 'LOGIN'
                ? 'bg-white text-purple-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('Directorate_Clearance_Login_sd4pv', `Directorate Clearance Login`)}</button>
          <button
            id="fed-tab-demo"
            onClick={() => { setActiveTab('DEMO'); setFeedback(null); }}
            className={`flex-1 py-2 px-3 rounded-lg text-center transition-all ${
              activeTab === 'DEMO'
                ? 'bg-white text-purple-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('Command_Officers___cmzy3', `Command Officers (`)}{availableAccounts.federationAdmins.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Feedback banner */}
          {feedback && (
            <div
              className={`mb-4 p-3 rounded-xl text-xs flex items-start gap-2.5 border ${
                feedback.type === 'success'
                  ? 'bg-purple-50 text-purple-900 border-purple-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="flex-1">{feedback.message}</span>
            </div>
          )}

          {/* TAB 1: CLEARANCE LOGIN */}
          {activeTab === 'LOGIN' && (
            <form onSubmit={handleFederationLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('Official_Directorate_Officer_I_pukcv', `Official Directorate Officer ID`)}</label>
                <div className="relative">
                  <Cpu className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="fed-officer-id-input"
                    type="text"
                    value={officerId}
                    onChange={(e) => setOfficerId(e.target.value)}
                    placeholder={t('FED_DIR_MP_001_f35fz', `FED-DIR-MP-001`)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('Clearance_Cadre_0no8s', `Clearance Cadre`)}</label>
                <select
                  id="fed-clearance-select"
                  value={clearanceLevel}
                  onChange={(e) => setClearanceLevel(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 bg-white"
                >
                  <option value="LEVEL_4_EXECUTIVE">{t('Level_4__Executive_Directorate_x9ufl', `Level 4: Executive Directorate (Managing Director, IAS Retd.)`)}</option>
                  <option value="LEVEL_3_DIRECTOR">{t('Level_3__Joint_Welfare_Commiss_2az9a', `Level 3: Joint Welfare Commissioner (State Board)`)}</option>
                  <option value="LEVEL_2_IMC_COMMAND">{t('Level_2__IMC_Municipal_Operati_wt60k', `Level 2: IMC Municipal Operations Commander`)}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('High_Security_2FA_Passcode___T_pjeol', `High-Security 2FA Passcode / Token`)}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="fed-passcode-input"
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder={t('Enter_security_token_9uwgv', `Enter security token`)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {t('Directorate_Test_Token__0de21', `Directorate Test Token:`)}<span className="font-mono text-purple-800 font-medium">{t('2026_MP_GOV_ja85f', `2026-MP-GOV`)}</span>
                </p>
              </div>

              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200/60 flex items-center gap-2 text-xs text-purple-900">
                <Globe2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>{t('Provides_oversight_across_5_Di_wd7mb', `Provides oversight across 5 District Societies, 1,345 cooperative workers, and 30-ward municipal dispatch.`)}</span>
              </div>

              <button
                type="submit"
                id="fed-submit-login-btn"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-purple-950 text-white rounded-xl text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? 'Authenticating Directorate Token...' : 'Grant Federation Command Clearance'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 2: DEMO CLEARANCE OFFICERS */}
          {activeTab === 'DEMO' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 mb-2">
                {t('Switch_between_State_Directora_g2sm9', `Switch between State Directorate and Municipal Command leadership accounts:`)}</p>
              {availableAccounts.federationAdmins.map((officer) => {
                const isCurrent = federationAdminUser?.id === officer.id && isFederationAdminAuthenticated;
                return (
                  <div
                    key={officer.id}
                    onClick={() => handleSelectOfficer(officer)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isCurrent
                        ? 'border-purple-500 bg-purple-50/60 ring-2 ring-purple-500/20'
                        : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-sm shrink-0">
                        {officer.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">{officer.name}</span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-purple-700 text-white">
                              {t('Active_y34p0', `Active`)}</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-600 font-medium">{officer.officialDesignation}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-purple-700 font-medium">{officer.clearanceLevel}</span>
                          <span>•</span>
                          <span>{officer.station}</span>
                          {officer.email && (
                            <>
                              <span>•</span>
                              <span className={`text-[10px] font-medium ${officer.emailVerified ? 'text-emerald-700' : 'text-slate-500'}`}>
                                {officer.emailVerified ? '✓ ' : ''}{officer.email}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                        isCurrent
                          ? 'bg-purple-800 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-purple-100 hover:text-purple-900'
                      }`}
                    >
                      {isCurrent ? 'Current' : 'Select'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-500">
            {t('Madhya_Pradesh_Ministry_of_Coo_nbr9i', `Madhya Pradesh Ministry of Cooperatives • Municipal Smart Governance Integration`)}</p>
        </div>
      </div>
    </div>
  );
};
