import React, { useState, useEffect } from 'react';
import { BharatKaushalLogo } from '../common/BharatKaushalLogo';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types';
import { SupportedLanguage, SUPPORTED_LANGUAGES, getTranslation } from '../../utils/i18n';
import {
  ShieldCheck,
  Zap,
  IndianRupee,
  HeartHandshake,
  User,
  HardHat,
  Building2,
  Sliders,
  Shield,
  ArrowRight,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  X,
  AlertCircle,
  Sparkles,
  Globe,
  ChevronDown,
  Eye,
  EyeOff,
} from 'lucide-react';

interface UnifiedAuthExperienceProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialRole?: UserRole;
  lang?: SupportedLanguage;
  onSelectLang?: (lang: SupportedLanguage) => void;
  onSuccess?: (role?: UserRole) => void;
}

export const UnifiedAuthExperience: React.FC<UnifiedAuthExperienceProps> = ({
  isOpen = true,
  onClose,
  initialRole = 'CUSTOMER',
  lang = 'en',
  onSelectLang,
  onSuccess,
}) => {
  const {
    loginCustomer,
    registerCustomer,
    loginWorker,
    loginSocietyAdmin,
    loginFederationAdmin,
    loginSuperAdmin,
    availableAccounts,
    switchCustomer,
    switchWorker,
    switchSocietyAdmin,
    switchFederationAdmin,
    switchSuperAdmin,
  } = useAuth();
  const { isStarryNight } = useTheme();

  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  
  // Verification and credential fields are strictly initialized empty (no hardcoded prefill)
  const [identifier, setIdentifier] = useState('');
  const [credential, setCredential] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState<'PASSWORD' | 'OTP'>('OTP');
  const [otpSent, setOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // Explicit opt-in choice
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Register form fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAddress, setRegAddress] = useState('Vijay Nagar, Indore');

  const t = (key: string, fallback?: string) => getTranslation(lang, key, fallback);

  // Keep selectedRole synchronized with initialRole whenever modal opens or initialRole changes
  useEffect(() => {
    if (isOpen) {
      setSelectedRole(initialRole);
      setFeedback(null);
      setIdentifier('');
      setCredential('');
      setOtpSent(false);
      setRememberMe(false);
    }
  }, [initialRole, isOpen]);

  // Handle switching roles explicitly in UI
  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setFeedback(null);
    setOtpSent(false);
    setCredential('');
  };

  const handleSendOtp = () => {
    if (!identifier || identifier.trim().length < 5) {
      setFeedback({ type: 'error', message: 'Please enter a valid mobile number or ID' });
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setOtpSent(true);
    setCredential(code);
    setFeedback({
      type: 'success',
      message: `Verification OTP [${code}] generated for ${identifier}`,
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setFeedback({ type: 'error', message: 'Please enter your registered identifier.' });
      return;
    }
    if (!credential.trim()) {
      setFeedback({ type: 'error', message: 'Please enter your passcode or OTP.' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      let res: { success: boolean; message?: string } = { success: false };

      if (selectedRole === 'CUSTOMER') {
        res = await loginCustomer({ phone: identifier, otp: credential });
      } else if (selectedRole === 'WORKER') {
        res = await loginWorker({ phone: identifier, pin: credential });
      } else if (selectedRole === 'SOCIETY_ADMIN') {
        res = await loginSocietyAdmin({ adminId: identifier, pin: credential });
      } else if (selectedRole === 'FEDERATION_ADMIN') {
        res = await loginFederationAdmin({ officerId: identifier, passcode: credential });
      } else if (selectedRole === 'SUPER_ADMIN') {
        res = await loginSuperAdmin({ officialId: identifier, passcode: credential });
      }

      setLoading(false);

      if (res.success) {
        setFeedback({ type: 'success', message: res.message || 'Authentication successful! Redirecting to dashboard...' });
        setTimeout(() => {
          onSuccess?.(selectedRole);
          onClose?.();
        }, 500);
      } else {
        setFeedback({ type: 'error', message: res.message || 'Authentication failed. Please verify credentials.' });
      }
    } catch (err: any) {
      setLoading(false);
      setFeedback({ type: 'error', message: err.message || 'Server connection error.' });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      setFeedback({ type: 'error', message: 'Name and mobile number are required.' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const res = await registerCustomer({
        name: regName,
        phone: regPhone,
        email: regEmail || undefined,
        address: regAddress,
        locality: 'Indore',
      });
      setLoading(false);

      if (res.success) {
        setFeedback({ type: 'success', message: 'Citizen profile registered successfully! Logging you in...' });
        setTimeout(() => {
          onSuccess?.('CUSTOMER');
          onClose?.();
        }, 600);
      } else {
        setFeedback({ type: 'error', message: res.message || 'Registration failed.' });
      }
    } catch (err: any) {
      setLoading(false);
      setFeedback({ type: 'error', message: err.message || 'Failed to register.' });
    }
  };

  const getRoleDisplayName = (r: UserRole) => {
    switch (r) {
      case 'CUSTOMER':
        return 'Citizen / Resident';
      case 'WORKER':
        return 'Skilled Artisan';
      case 'SOCIETY_ADMIN':
        return 'Society Admin';
      case 'FEDERATION_ADMIN':
        return 'Federation Command';
      case 'SUPER_ADMIN':
        return 'Government Regulator';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      {/* Modal Card Container */}
      <div className={`relative w-full max-w-5xl rounded-3xl shadow-2xl border overflow-hidden my-auto grid grid-cols-1 lg:grid-cols-12 max-h-[92vh] ${
        isStarryNight ? 'bg-[#03091e] border-white/15 text-white shadow-[0_0_60px_rgba(59,130,246,0.25)]' : 'bg-white border-slate-200/90 text-slate-900 shadow-2xl'
      }`}>
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close authentication modal"
            className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isStarryNight ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800'
            }`}
          >
            <X size={16} />
          </button>
        )}

        {/* Left Informational Panel (Grounded Civic Architecture) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 text-white flex-col justify-between relative overflow-hidden border-r border-slate-800">
          <div className="space-y-5 relative z-10">
            <BharatKaushalLogo size="md" inline={true} showTagline={false} />

            <div className="pt-2">
              <h2 className="text-2xl font-black tracking-tight leading-snug text-white">
                Cooperative Digital Labour Platform
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Operating under the MP Cooperative Societies Act, 1960. Connecting Indore residents directly with trade-certified artisans.
              </p>
            </div>

            {/* Core Cooperative Guarantees */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start gap-2.5 text-slate-200">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Aadhaar e-KYC Verified:</strong>
                  <div className="text-[11px] text-slate-300">UIDAI masked cryptographic verification</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-slate-200">
                <IndianRupee size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">94.5% Artisan Share:</strong>
                  <div className="text-[11px] text-slate-300">Direct UPI bank transfer, zero middleman cuts</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-slate-200">
                <HeartHandshake size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">2.0% Welfare Savings:</strong>
                  <div className="text-[11px] text-slate-300">MPSLWB healthcare and accidental cushion</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-slate-200">
                <Lock size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Role-Based Access:</strong>
                  <div className="text-[11px] text-slate-300">Strict statutory clearance for administrative tools</div>
                </div>
              </div>
            </div>
          </div>

          {/* Grounded Pilot Reference */}
          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 relative z-10">
            <div><strong>Indore Municipal Pilot:</strong> Zones 1-4</div>
            <div>Vijay Nagar • Palasia • Rajwada • Annapurna</div>
          </div>
        </div>

        {/* Right Authentication Form Panel */}
        <div className={`lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh] ${
          isStarryNight ? 'bg-[#03091e] text-slate-100' : 'bg-white text-slate-900'
        }`}>
          <div className="space-y-5">
            {/* Top Tabs: Login vs Register & Language Selector */}
            <div className={`flex items-center justify-between border-b pb-3 ${isStarryNight ? 'border-white/10' : 'border-slate-200'}`}>
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('LOGIN');
                    setFeedback(null);
                  }}
                  className={`text-sm font-bold pb-2 relative transition-colors cursor-pointer ${
                    activeTab === 'LOGIN'
                      ? isStarryNight ? 'text-blue-400' : 'text-blue-700'
                      : isStarryNight ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t('Login', 'Sign In')}
                  {activeTab === 'LOGIN' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                  )}
                </button>

                {selectedRole === 'CUSTOMER' && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('REGISTER');
                      setFeedback(null);
                    }}
                    className={`text-sm font-bold pb-2 relative transition-colors cursor-pointer ${
                      activeTab === 'REGISTER'
                        ? isStarryNight ? 'text-blue-400' : 'text-blue-700'
                        : isStarryNight ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t('Create_Account', 'Create Account')}
                    {activeTab === 'REGISTER' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                    )}
                  </button>
                )}
              </div>

              {/* Language Selector */}
              <div className="relative flex items-center mr-8 sm:mr-10">
                <Globe size={13} className={`absolute left-2.5 pointer-events-none ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`} />
                <select
                  id="auth-experience-language-select"
                  aria-label="Select Interface Language"
                  value={lang}
                  onChange={(e) => onSelectLang?.(e.target.value as SupportedLanguage)}
                  className={`h-8 pl-7 pr-6 text-xs font-semibold rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none transition-colors border ${
                    isStarryNight
                      ? 'bg-slate-900 text-white border-white/15 hover:bg-slate-800'
                      : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200'
                  }`}
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className={isStarryNight ? 'bg-slate-900 text-white' : ''}>
                      {l.nativeName}
                    </option>
                  ))}
                </select>
                <ChevronDown size={12} className={`absolute right-2 pointer-events-none ${isStarryNight ? 'text-slate-400' : 'text-slate-400'}`} />
              </div>
            </div>

            {/* Active Destination Role Banner */}
            <div className={`rounded-2xl p-3.5 space-y-2 border ${
              isStarryNight ? 'bg-slate-900/80 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>
                  Target Dashboard
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  isStarryNight ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-100 text-blue-800'
                }`}>
                  {getRoleDisplayName(selectedRole)}
                </span>
              </div>
              <p className={`text-[11px] ${isStarryNight ? 'text-slate-300' : 'text-slate-600'}`}>
                You are accessing the <strong>{getRoleDisplayName(selectedRole)}</strong> workspace. Select below if you intended a different role:
              </p>

              {/* Role Switcher Pills */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 pt-1">
                {[
                  { r: 'CUSTOMER' as UserRole, label: 'Citizen', icon: User },
                  { r: 'WORKER' as UserRole, label: 'Artisan', icon: HardHat },
                  { r: 'SOCIETY_ADMIN' as UserRole, label: 'Society', icon: Building2 },
                  { r: 'FEDERATION_ADMIN' as UserRole, label: 'Federation', icon: Sliders },
                  { r: 'SUPER_ADMIN' as UserRole, label: 'Regulator', icon: Shield },
                ].map(({ r, label, icon: Icon }) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleChange(r)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                      selectedRole === r
                        ? isStarryNight
                          ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/20'
                          : 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : isStarryNight
                        ? 'bg-slate-950/70 hover:bg-slate-800 text-slate-300 border-white/10'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Icon size={13} />
                    <span className="text-[10px]">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Alert */}
            {feedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : 'bg-rose-50 text-rose-900 border-rose-300'
                }`}
              >
                {feedback.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                <span>{feedback.message}</span>
              </div>
            )}

            {/* Form */}
            {activeTab === 'LOGIN' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Identifier Input (Clean blank initial state) */}
                <div>
                  <label htmlFor="auth-identifier-input" className={`block text-xs font-bold mb-1 ${isStarryNight ? 'text-slate-300' : 'text-slate-700'}`}>
                    {selectedRole === 'CUSTOMER' || selectedRole === 'WORKER'
                      ? 'Mobile Number or Registered ID'
                      : 'Official ID / Officer Code'}
                  </label>
                  <div className="relative">
                    <input
                      id="auth-identifier-input"
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={
                        selectedRole === 'CUSTOMER'
                          ? 'Enter 10-digit mobile number'
                          : selectedRole === 'WORKER'
                          ? 'Enter mobile number or worker ID'
                          : 'Enter official registration code'
                      }
                      className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        isStarryNight
                          ? 'bg-slate-900/90 border-white/15 text-white placeholder:text-slate-500 focus:border-blue-400'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                      }`}
                    />
                    <Mail size={15} className={`absolute right-3.5 top-3 pointer-events-none ${isStarryNight ? 'text-slate-500' : 'text-slate-400'}`} />
                  </div>
                </div>

                {/* Credential / Passcode / OTP Input (Clean blank initial state) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="auth-credential-input" className={`text-xs font-bold ${isStarryNight ? 'text-slate-300' : 'text-slate-700'}`}>
                      {authMethod === 'OTP' ? 'Security OTP' : 'PIN / Passcode'}
                    </label>
                    <div className="flex items-center gap-3">
                      {(selectedRole === 'CUSTOMER' || selectedRole === 'WORKER') && (
                        <button
                          type="button"
                          onClick={() => setAuthMethod(authMethod === 'OTP' ? 'PASSWORD' : 'OTP')}
                          className={`text-[11px] font-semibold hover:underline cursor-pointer ${
                            isStarryNight ? 'text-blue-400' : 'text-blue-700'
                          }`}
                        >
                          {authMethod === 'OTP' ? 'Use PIN instead' : 'Use OTP'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      id="auth-credential-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={credential}
                      onChange={(e) => setCredential(e.target.value)}
                      placeholder={authMethod === 'OTP' ? 'Enter 4-digit code' : 'Enter security PIN'}
                      className={`w-full pl-3.5 pr-20 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono transition-colors ${
                        isStarryNight
                          ? 'bg-slate-900/90 border-white/15 text-white placeholder:text-slate-500 focus:border-blue-400'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                      }`}
                    />
                    <div className="absolute right-2 top-2 flex items-center gap-1">
                      {authMethod === 'OTP' && (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                            isStarryNight
                              ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          }`}
                        >
                          {otpSent ? 'Resend' : 'Get OTP'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
                        className={`p-1 cursor-pointer transition-colors ${
                          isStarryNight ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remember Me - Explicit Choice (Default Unchecked) */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="remember-me" className={`text-xs cursor-pointer ${isStarryNight ? 'text-slate-400' : 'text-slate-600'}`}>
                    Remember my session on this device
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  id="auth-submit-btn"
                  type="submit"
                  disabled={loading}
                  className={`w-full h-11 rounded-xl text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                    isStarryNight ? 'starry-btn-glossy' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Sign In to {getRoleDisplayName(selectedRole)}</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label htmlFor="reg-name" className={`block text-xs font-bold mb-1 ${isStarryNight ? 'text-slate-300' : 'text-slate-700'}`}>Full Name</label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Enter your name"
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:ring-2 focus:ring-blue-500 ${
                      isStarryNight ? 'bg-slate-900/90 border-white/15 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="reg-phone" className={`block text-xs font-bold mb-1 ${isStarryNight ? 'text-slate-300' : 'text-slate-700'}`}>Mobile Number</label>
                  <input
                    id="reg-phone"
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:ring-2 focus:ring-blue-500 ${
                      isStarryNight ? 'bg-slate-900/90 border-white/15 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="reg-email" className={`block text-xs font-bold mb-1 ${isStarryNight ? 'text-slate-300' : 'text-slate-700'}`}>Email (Optional)</label>
                  <input
                    id="reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:ring-2 focus:ring-blue-500 ${
                      isStarryNight ? 'bg-slate-900/90 border-white/15 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="reg-address" className={`block text-xs font-bold mb-1 ${isStarryNight ? 'text-slate-300' : 'text-slate-700'}`}>Locality (Indore)</label>
                  <input
                    id="reg-address"
                    type="text"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="e.g. Vijay Nagar, Palasia, Rajwada"
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:ring-2 focus:ring-blue-500 ${
                      isStarryNight ? 'bg-slate-900/90 border-white/15 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-11 rounded-xl text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 ${
                    isStarryNight ? 'starry-btn-glossy' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? 'Registering...' : 'Create Account & Continue'}
                </button>
              </form>
            )}

            {/* Sandbox / Demo Exploration for Development Evaluation */}
            <div className={`pt-3 border-t space-y-2 ${isStarryNight ? 'border-white/10' : 'border-slate-100'}`}>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${isStarryNight ? 'text-slate-400' : 'text-slate-500'}`}>Evaluation Sandbox:</span>
                <button
                  type="button"
                  id={`demo-sandbox-btn-${selectedRole.toLowerCase()}`}
                  onClick={() => {
                    if (selectedRole === 'CUSTOMER') {
                      const cust = availableAccounts.customers[0];
                      if (cust) switchCustomer(cust);
                    } else if (selectedRole === 'WORKER') {
                      const worker = availableAccounts.workers[0];
                      if (worker) switchWorker(worker);
                    } else if (selectedRole === 'SOCIETY_ADMIN') {
                      const admin = availableAccounts.societyAdmins[0];
                      if (admin) switchSocietyAdmin(admin);
                    } else if (selectedRole === 'FEDERATION_ADMIN') {
                      const officer = availableAccounts.federationAdmins[0];
                      if (officer) switchFederationAdmin(officer);
                    } else if (selectedRole === 'SUPER_ADMIN') {
                      const superAdmin = availableAccounts.superAdmins[0];
                      if (superAdmin) switchSuperAdmin(superAdmin);
                    }
                    setFeedback({
                      type: 'success',
                      message: `Entering ${getRoleDisplayName(selectedRole)} sandbox with synthetic demo data.`,
                    });
                    setTimeout(() => {
                      onSuccess?.(selectedRole);
                      onClose?.();
                    }, 400);
                  }}
                  className={`px-3 py-1.5 rounded-xl border font-semibold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isStarryNight
                      ? 'border-blue-500/40 bg-blue-500/15 hover:bg-blue-500/25 text-blue-300'
                      : 'border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-700'
                  }`}
                >
                  <Sparkles size={12} className="text-amber-400" />
                  <span>{getRoleDisplayName(selectedRole)} Sandbox (Synthetic Data)</span>
                </button>
              </div>
              <p className={`text-[10px] ${isStarryNight ? 'text-slate-400' : 'text-slate-400'}`}>
                * Development sandbox uses non-sensitive synthetic data to inspect the {getRoleDisplayName(selectedRole)} dashboard.
              </p>
            </div>
          </div>

          {/* Security & Data Minimization Notice */}
          <div className={`mt-4 pt-3 border-t flex items-center gap-2.5 text-[11px] ${
            isStarryNight ? 'border-white/10 text-slate-400' : 'border-slate-100 text-slate-500'
          }`}>
            <ShieldCheck size={16} className="text-blue-500 shrink-0" />
            <span>
              <strong>UIDAI Masked Data:</strong> We do not store plain-text Aadhaar or personal credentials.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
