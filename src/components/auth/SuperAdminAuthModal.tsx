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
  Building,
  UserPlus,
  Smartphone,
  Award,
  Users,
  Mail,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SuperAdminProfile } from '../../types';
import { EmailVerificationWidget } from '../common/EmailVerificationWidget';

interface SuperAdminAuthModalProps {
  isOpen: boolean;
  initialTab?: 'LOGIN' | 'REGISTER' | 'DEMO';
  onClose: () => void;
  onSuccess?: () => void;
}

export const SuperAdminAuthModal: React.FC<SuperAdminAuthModalProps> = ({
  isOpen,
  initialTab,
  onClose,
  onSuccess,
}) => {
  const {
    superAdminUser,
    isSuperAdminAuthenticated,
    loginSuperAdmin,
    registerSuperAdmin,
    logoutSuperAdmin,
    switchSuperAdmin,
    availableAccounts,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER' | 'DEMO'>(initialTab || 'LOGIN');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Login Form
  const [officialId, setOfficialId] = useState(superAdminUser?.id || 'GOV-MOL-JS-001');
  const [passcode, setPasscode] = useState('BHARAT-APEX-2026');
  const [totpCode, setTotpCode] = useState('892104');
  const [clearanceLevel, setClearanceLevel] = useState<'APEX_LEVEL_5_NATIONAL' | 'LEVEL_4_MINISTERIAL' | 'LEVEL_3_REGULATORY'>('APEX_LEVEL_5_NATIONAL');

  // Registration Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regEmailVerified, setRegEmailVerified] = useState(false);
  const [regPhone, setRegPhone] = useState('');
  const [regMinistry, setRegMinistry] = useState('Ministry of Labour & Employment');
  const [regDepartment, setRegDepartment] = useState('Central Registrar of Cooperative Societies (CRCS)');
  const [regDesignation, setRegDesignation] = useState('Joint Secretary & Mission Director');
  const [regCadre, setRegCadre] = useState('IAS (Central Deputation)');
  const [regEmpCode, setRegEmpCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSuperAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const res = await loginSuperAdmin({
      officialId,
      passcode,
      totpCode,
      clearanceLevel,
    });
    setLoading(false);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message || 'National Sovereign Clearance Verified!' });
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 700);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Authorization credentials rejected' });
    }
  };

  const handleRegisterOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) {
      setFeedback({ type: 'error', message: 'Please fill all required personnel fields' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    const res = await registerSuperAdmin({
      name: regName,
      email: regEmail,
      emailVerified: regEmailVerified,
      phone: regPhone,
      ministry: regMinistry,
      department: regDepartment,
      officialDesignation: regDesignation,
      cadre: regCadre,
      employeeCode: regEmpCode || undefined,
    });
    setLoading(false);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message || 'Officer clearance registered!' });
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 700);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Registration failed' });
    }
  };

  const handleSelectOfficial = (admin: SuperAdminProfile) => {
    switchSuperAdmin(admin);
    setOfficialId(admin.id);
    setClearanceLevel(admin.clearanceLevel);
    setFeedback({ type: 'success', message: `Clearance switched to ${admin.name} (${admin.officialDesignation})` });
    setTimeout(() => {
      onSuccess?.();
      onClose();
    }, 500);
  };

  const handleLogout = () => {
    logoutSuperAdmin();
    setFeedback({ type: 'success', message: 'Sovereign session terminated and console locked.' });
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div
      id="super-admin-auth-modal"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Sovereign Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white flex items-center justify-between border-b border-amber-500/30">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-400/40 text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-base tracking-tight text-white">{t('Super_Admin_Command_Auth_4st8x', `Super Admin Command Auth`)}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-400/40">
                  {t('APEX_LEVEL_5_g9tju', `APEX LEVEL 5`)}</span>
              </div>
              <p className="text-[11px] text-slate-300">
                {t('Government_of_India_Sovereign__1lduy', `Government of India Sovereign National Portal Credentials`)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('LOGIN'); setFeedback(null); }}
            className={`flex-1 py-2.5 px-4 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'LOGIN'
                ? 'border-amber-600 text-amber-900 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound size={14} />
            <span>{t('Official_Login_kpvo9', `Official Login`)}</span>
          </button>

          <button
            onClick={() => { setActiveTab('REGISTER'); setFeedback(null); }}
            className={`flex-1 py-2.5 px-4 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'REGISTER'
                ? 'border-amber-600 text-amber-900 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus size={14} />
            <span>{t('Register_Officer_utn89', `Register Officer`)}</span>
          </button>

          <button
            onClick={() => { setActiveTab('DEMO'); setFeedback(null); }}
            className={`flex-1 py-2.5 px-4 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'DEMO'
                ? 'border-amber-600 text-amber-900 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users size={14} />
            <span>{t('Authorized_Dignitaries_g1hey', `Authorized Dignitaries`)}</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mx-6 mt-4 p-3 rounded-xl border text-xs flex items-center gap-2 font-medium animate-in fade-in duration-150 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-rose-50 text-rose-900 border-rose-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Active Session Bar */}
          {isSuperAdminAuthenticated && superAdminUser && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-amber-950">{superAdminUser.name}</span>
                  <span className="px-1.5 py-0.2 bg-amber-200/80 text-amber-900 rounded font-mono text-[10px] font-bold">
                    {superAdminUser.id}
                  </span>
                  {superAdminUser.email && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                      superAdminUser.emailVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-200/60 text-amber-900'
                    }`}>
                      {superAdminUser.emailVerified ? '✓ Email Verified' : 'Email Unverified'}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-600">
                  {superAdminUser.officialDesignation} • {superAdminUser.ministry} • {superAdminUser.email || 'No email'}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold text-xs transition-colors shrink-0"
              >
                <LogOut size={13} />
                <span>{t('Log_Out_98kci', `Log Out`)}</span>
              </button>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {activeTab === 'LOGIN' && (
            <form onSubmit={handleSuperAdminLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>{t('Government_Officer_ID___NIC_Em_8ouei', `Government Officer ID / NIC Email`)}</span>
                  <span className="text-[10px] text-amber-800 font-mono">{t('GOV_MOL_JS_001_or_amitabh_verm_u2k4x', `GOV-MOL-JS-001 or amitabh.verma@nic.in`)}</span>
                </label>
                <input
                  type="text"
                  required
                  value={officialId}
                  onChange={(e) => setOfficialId(e.target.value)}
                  placeholder={t('e_g__GOV_MOL_JS_001_zu5v2', `e.g. GOV-MOL-JS-001`)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{t('Security_Passcode_nl72r', `Security Passcode`)}</label>
                  <input
                    type="password"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder={t('Enter_security_passcode_89ay9', `Enter security passcode`)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>{t('Aadhaar_TOTP__6_Digit__vjchh', `Aadhaar TOTP (6-Digit)`)}</span>
                    <span className="text-[10px] text-emerald-700 font-bold">{t('Simulator_Active_0zei7', `Simulator Active`)}</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    placeholder={t('892_104_e1st9', `892 104`)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono tracking-widest text-center font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">{t('Authorizing_Clearance_Level_a6b5k', `Authorizing Clearance Level`)}</label>
                <select
                  value={clearanceLevel}
                  onChange={(e) => setClearanceLevel(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="APEX_LEVEL_5_NATIONAL">{t('Apex_Level_5___National_Minist_42sif', `Apex Level 5 - National Ministerial & Statutory Authority`)}</option>
                  <option value="LEVEL_4_MINISTERIAL">{t('Level_4___State_Registrar___Ec_q5xru', `Level 4 - State Registrar & Economic Commission`)}</option>
                  <option value="LEVEL_3_REGULATORY">{t('Level_3___Regulatory_Audit___P_751vu', `Level 3 - Regulatory Audit & Program Inspector`)}</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-center gap-2">
                <Lock size={14} className="text-amber-600 shrink-0" />
                <span>{t('Protected_by_CERT_In_Section_7_azsbh', `Protected by CERT-In Section 70B & Dual-Custody HSM Infrastructure.`)}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                {loading ? 'Verifying Credentials...' : 'Authorize National Command Access'}
                <ArrowRight size={14} />
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'REGISTER' && (
            <form onSubmit={handleRegisterOfficer} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{t('Official_Full_Name___r0git', `Official Full Name *`)}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('e_g__Smt__Neha_Saxena__IAS_lnzj2', `e.g. Smt. Neha Saxena, IAS`)}
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{t('Official_Govt_Email___nic_in___fsx5e', `Official Govt Email (@nic.in / @gov.in) *`)}</label>
                  <input
                    type="email"
                    required
                    placeholder={t('neha_saxena_nic_in_1nsyl', `neha.saxena@nic.in`)}
                    value={regEmail}
                    onChange={(e) => {
                      setRegEmail(e.target.value);
                      setRegEmailVerified(false);
                    }}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>

              {/* Optional Email Verification Widget */}
              {regEmail && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-700 mb-2 flex items-center justify-between">
                    <span>{t('Officer_Email_Verification__Op_hx1xg', `Officer Email Verification (Optional)`)}</span>
                    {regEmailVerified && (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} /> {t('Verified_fjsbq', `Verified`)}</span>
                    )}
                  </div>
                  <EmailVerificationWidget
                    role="SUPER_ADMIN"
                    initialEmail={regEmail}
                    isVerified={regEmailVerified}
                    onVerificationSuccess={() => setRegEmailVerified(true)}
                    compact
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{t('Mobile_Phone__Aadhaar_Linked___gl9pb', `Mobile Phone (Aadhaar Linked) *`)}</label>
                  <input
                    type="tel"
                    required
                    placeholder={t('9826012345_q9eac', `9826012345`)}
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{t('Civil_Service_Cadre___Batch_2nnft', `Civil Service Cadre / Batch`)}</label>
                  <input
                    type="text"
                    placeholder={t('e_g__IAS__2006_Batch__45yix', `e.g. IAS (2006 Batch)`)}
                    value={regCadre}
                    onChange={(e) => setRegCadre(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">{t('Ministry___Government_Departme_qjj7p', `Ministry / Government Department`)}</label>
                <select
                  value={regMinistry}
                  onChange={(e) => setRegMinistry(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold"
                >
                  <option value="Ministry of Labour & Employment">{t('Ministry_of_Labour___Employmen_v5jzw', `Ministry of Labour & Employment (MoL&E)`)}</option>
                  <option value="Ministry of Cooperation">{t('Ministry_of_Cooperation__Centr_6q1u2', `Ministry of Cooperation (Central Registrar CRCS)`)}</option>
                  <option value="Ministry of Skill Development & Entrepreneurship">{t('Ministry_of_Skill_Development__h7scv', `Ministry of Skill Development & Entrepreneurship (MSDE)`)}</option>
                  <option value="State Cooperative Department">{t('State_Cooperative_Department___0oaz6', `State Cooperative Department & Directorate`)}</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{t('Official_Designation_ebep0', `Official Designation`)}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('e_g__Joint_Secretary___Registr_hk269', `e.g. Joint Secretary / Registrar`)}
                    value={regDesignation}
                    onChange={(e) => setRegDesignation(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{t('Government_Employee_ID_p5mhq', `Government Employee ID`)}</label>
                  <input
                    type="text"
                    placeholder={t('e_g__EMP_NIC_2026_99_ty7lz', `e.g. EMP-NIC-2026-99`)}
                    value={regEmpCode}
                    onChange={(e) => setRegEmpCode(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                {loading ? 'Registering...' : 'Register Official & Grant Super Admin Credentials'}
                <UserPlus size={14} />
              </button>
            </form>
          )}

          {/* TAB 3: DEMO OFFICIALS */}
          {activeTab === 'DEMO' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500">
                {t('Click_any_authorized_national__qj8dr', `Click any authorized national official below to test immediate session authentication:`)}</div>

              <div className="space-y-2">
                {availableAccounts.superAdmins.map((admin) => (
                  <button
                    key={admin.id}
                    onClick={() => handleSelectOfficial(admin)}
                    className="w-full p-3 bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 rounded-xl text-left transition-all flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 group-hover:text-amber-950 text-xs">
                          {admin.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-800 group-hover:bg-amber-200">
                          {admin.id}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-900">
                          {t('Level_5_osz7f', `Level 5`)}</span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        {admin.officialDesignation} • {admin.ministry}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 flex-wrap">
                        <span className={admin.emailVerified ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                          {admin.emailVerified ? '✓ ' : ''}{admin.email}
                        </span>
                        <span>•</span>
                        <span>{admin.cadre}</span>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-slate-400 group-hover:text-amber-600 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
