import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  ShieldCheck,
  KeyRound,
  FileCheck,
  ArrowRight,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Users,
  Mail,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SocietyAdminProfile } from '../../types';

interface SocietyAdminAuthModalProps {
  isOpen: boolean;
  initialTab?: 'LOGIN' | 'DEMO';
  onClose: () => void;
  onSuccess?: () => void;
}

export const SocietyAdminAuthModal: React.FC<SocietyAdminAuthModalProps> = ({
  isOpen,
  initialTab,
  onClose,
  onSuccess,
}) => {
  const {
    societyAdminUser,
    isSocietyAdminAuthenticated,
    loginSocietyAdmin,
    logoutSocietyAdmin,
    switchSocietyAdmin,
    availableAccounts,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'LOGIN' | 'DEMO'>(initialTab || 'LOGIN');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);
  const [societyId, setSocietyId] = useState(societyAdminUser?.societyId || 'SOC-IND-02');
  const [staffCode, setStaffCode] = useState(societyAdminUser?.id || 'ADM-IND-02-77');
  const [securityPin, setSecurityPin] = useState('7310');
  const [dscTokenAttached, setDscTokenAttached] = useState(true);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const res = await loginSocietyAdmin({
      societyId,
      staffCode,
      pin: securityPin,
    });
    setLoading(false);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message || 'Society Officer authenticated!' });
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 700);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Verification failed' });
    }
  };

  const handleSelectAdmin = (admin: SocietyAdminProfile) => {
    switchSocietyAdmin(admin);
    setSocietyId(admin.societyId);
    setStaffCode(admin.id);
    setFeedback({ type: 'success', message: `Officer activated: ${admin.name} (${admin.societyName})` });
    setTimeout(() => {
      onSuccess?.();
      onClose();
    }, 500);
  };

  return (
    <div
      id="society-admin-auth-modal"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
              <Building2 className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-base tracking-tight text-white">{t('Society_Admin_Auth_1pklt', `Society Admin Auth`)}</h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-100 font-medium border border-blue-400/30">
                  {t('Branch_Registrar_uaq7o', `Branch Registrar`)}</span>
              </div>
              <p className="text-xs text-blue-100/80">{t('MP_Cooperative_Societies_Act___mfm2r', `MP Cooperative Societies Act, 1960 • Statutory Portal`)}</p>
            </div>
          </div>
          <button
            id="close-society-auth-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Authenticated Status Bar */}
        <div className="px-6 py-3 bg-blue-50/60 border-b border-blue-200/70 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${isSocietyAdminAuthenticated ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-slate-400'}`} />
            <div>
              <div className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                {isSocietyAdminAuthenticated ? societyAdminUser?.name : 'Society Officer Inactive'}
                {isSocietyAdminAuthenticated && (
                  <>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-blue-200 text-blue-900 font-medium">
                      {societyAdminUser?.designation.split(' ')[0]}
                    </span>
                    {societyAdminUser?.email && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                        societyAdminUser.emailVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {societyAdminUser.emailVerified ? '✓ Email Verified' : 'Email Unverified'}
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className="text-[11px] text-slate-600">
                {isSocietyAdminAuthenticated
                  ? `${societyAdminUser?.societyName} • ${societyAdminUser?.email || 'No email'} • Staff Code: ${societyAdminUser?.id}`
                  : 'Authenticate to review registrations, audit ledger, and handle disputes'}
              </div>
            </div>
          </div>
          {isSocietyAdminAuthenticated && (
            <button
              id="society-logout-btn"
              onClick={logoutSocietyAdmin}
              className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-md transition-colors w-full sm:w-auto flex items-center justify-center sm:justify-start gap-1.5 border border-rose-200 shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              {t('Sign_Out_1im63', `Sign Out`)}</button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100/50 p-1.5 gap-1 text-xs font-medium">
          <button
            id="soc-tab-login"
            onClick={() => { setActiveTab('LOGIN'); setFeedback(null); }}
            className={`flex-1 py-2 px-3 rounded-lg text-center transition-all ${
              activeTab === 'LOGIN'
                ? 'bg-white text-blue-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('Officer_Staff_Login_nx6zo', `Officer Staff Login`)}</button>
          <button
            id="soc-tab-demo"
            onClick={() => { setActiveTab('DEMO'); setFeedback(null); }}
            className={`flex-1 py-2 px-3 rounded-lg text-center transition-all ${
              activeTab === 'DEMO'
                ? 'bg-white text-blue-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('Society_Registrar_Roster___z6lfo', `Society Registrar Roster (`)}{availableAccounts.societyAdmins.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Feedback banner */}
          {feedback && (
            <div
              className={`mb-4 p-3 rounded-xl text-xs flex items-start gap-2.5 border ${
                feedback.type === 'success'
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="flex-1">{feedback.message}</span>
            </div>
          )}

          {/* TAB 1: FORM LOGIN */}
          {activeTab === 'LOGIN' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('Cooperative_Society_Branch_0plch', `Cooperative Society Branch`)}</label>
                <select
                  id="soc-select-branch"
                  value={societyId}
                  onChange={(e) => setSocietyId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                >
                  <option value="SOC-IND-02">{t('Indore_Shramik_Kaushal_Sahakar_uw6r5', `Indore Shramik Kaushal Sahakari Samiti (SOC-IND-02)`)}</option>
                  <option value="SOC-BPL-01">{t('Bhopal_Labour_Cooperative_Soci_dvivb', `Bhopal Labour Cooperative Society (SOC-BPL-01)`)}</option>
                  <option value="SOC-JBL-03">{t('Jabalpur_Kaushal_Sahakari_Sang_9v2e0', `Jabalpur Kaushal Sahakari Sangh (SOC-JBL-03)`)}</option>
                  <option value="SOC-GWL-04">{t('Gwalior_Karigar_Cooperative_Un_6b7jx', `Gwalior Karigar Cooperative Union (SOC-GWL-04)`)}</option>
                  <option value="SOC-UJN-05">{t('Ujjain_Sewa_Sahakari_Samiti__S_iaope', `Ujjain Sewa Sahakari Samiti (SOC-UJN-05)`)}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('Officer_Staff_Code___Registrat_tgl0l', `Officer Staff Code / Registration ID`)}</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="soc-staff-code-input"
                    type="text"
                    value={staffCode}
                    onChange={(e) => setStaffCode(e.target.value)}
                    placeholder={t('ADM_IND_02_77_eav3p', `ADM-IND-02-77`)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('Registrar_Security_Passcode____3ycsc', `Registrar Security Passcode / PIN`)}</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="soc-pin-input"
                    type="password"
                    value={securityPin}
                    onChange={(e) => setSecurityPin(e.target.value)}
                    placeholder={t('Enter_administrative_PIN_w3ppz', `Enter administrative PIN`)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {t('Default_Registrar_Demo_PIN__vtmg0', `Default Registrar Demo PIN:`)}<span className="font-mono text-blue-700 font-medium">{t('7310_h3bej', `7310`)}</span>
                </p>
              </div>

              {/* Digital Signature DSC Status */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2.5">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-xs font-medium text-slate-800">{t('Class_3_Digital_Signature_Cert_f6cpt', `Class-3 Digital Signature Certificate (DSC)`)}</div>
                    <div className="text-[11px] text-slate-500">{t('Required_for_official_verifica_foif2', `Required for official verification approvals`)}</div>
                  </div>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-blue-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dscTokenAttached}
                    onChange={(e) => setDscTokenAttached(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>{t('Attached_lsvz7', `Attached`)}</span>
                </label>
              </div>

              <button
                type="submit"
                id="soc-submit-login-btn"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? 'Validating Registrar Authority...' : 'Authorize Society Officer Session'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 2: ROSTER OF SOCIETY OFFICIALS */}
          {activeTab === 'DEMO' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 mb-2">
                {t('Switch_administrative_authorit_qfpca', `Switch administrative authority between recognized cooperative society officers:`)}</p>
              {availableAccounts.societyAdmins.map((adm) => {
                const isCurrent = societyAdminUser?.id === adm.id && isSocietyAdminAuthenticated;
                return (
                  <div
                    key={adm.id}
                    onClick={() => handleSelectAdmin(adm)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm shrink-0">
                        {adm.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">{adm.name}</span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-blue-600 text-white">
                              {t('Active_7cekk', `Active`)}</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">{adm.designation}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="text-blue-700 font-medium">{adm.societyName}</span>
                          <span>•</span>
                          <span className="font-mono text-[10px] text-slate-400">{adm.id}</span>
                          {adm.email && (
                            <>
                              <span>•</span>
                              <span className={`text-[10px] font-medium ${adm.emailVerified ? 'text-emerald-700' : 'text-slate-500'}`}>
                                {adm.emailVerified ? '✓ ' : ''}{adm.email}
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
                          ? 'bg-blue-700 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-900'
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
            {t('Authorized_by_District_Registr_r0u6a', `Authorized by District Registrar of Cooperative Societies, Government of Madhya Pradesh`)}</p>
        </div>
      </div>
    </div>
  );
};
