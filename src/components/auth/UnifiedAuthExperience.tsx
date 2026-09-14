import React, { useState } from 'react';
import { BharatKaushalLogo } from '../common/BharatKaushalLogo';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { SupportedLanguage, SUPPORTED_LANGUAGES, getTranslation } from '../../utils/i18n';
import {
  ShieldCheck,
  Zap,
  Users,
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
  KeyRound,
  X,
  AlertCircle,
  Sparkles,
  Globe,
  Eye,
  EyeOff,
} from 'lucide-react';

interface UnifiedAuthExperienceProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialRole?: UserRole;
  lang?: SupportedLanguage;
  onSelectLang?: (lang: SupportedLanguage) => void;
  onSuccess?: () => void;
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

  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [identifier, setIdentifier] = useState(
    initialRole === 'WORKER'
      ? '9826011224'
      : initialRole === 'SOCIETY_ADMIN'
      ? 'ADM-IND-02'
      : initialRole === 'FEDERATION_ADMIN'
      ? 'FED-DIR-001'
      : initialRole === 'SUPER_ADMIN'
      ? 'GOV-MOL-101'
      : '9826012345'
  );
  const [credential, setCredential] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState<'PASSWORD' | 'OTP'>('OTP');
  const [otpSent, setOtpSent] = useState(false);
  const [simulatedOtp, setSimulatedOtp] = useState('4829');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Register form fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAddress, setRegAddress] = useState('Vijay Nagar, Indore');
  const [regTrade, setRegTrade] = useState('Plumbing');

  const t = (key: string, fallback?: string) => getTranslation(lang, key, fallback);

  // Switch role and prefill demo identifier
  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setFeedback(null);
    setOtpSent(false);
    switch (role) {
      case 'CUSTOMER':
        setIdentifier('9826012345');
        break;
      case 'WORKER':
        setIdentifier('9826011224');
        break;
      case 'SOCIETY_ADMIN':
        setIdentifier('ADM-IND-02');
        break;
      case 'FEDERATION_ADMIN':
        setIdentifier('FED-DIR-001');
        break;
      case 'SUPER_ADMIN':
        setIdentifier('GOV-MOL-101');
        break;
    }
  };

  const handleSendOtp = () => {
    if (!identifier || identifier.length < 5) {
      setFeedback({ type: 'error', message: 'Please enter a valid mobile number or ID' });
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedOtp(code);
    setOtpSent(true);
    setCredential(code);
    setFeedback({
      type: 'success',
      message: `Simulated OTP [${code}] sent to ${identifier}`,
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setFeedback({ type: 'success', message: res.message || 'Login successful! Redirecting...' });
        setTimeout(() => {
          onSuccess?.();
          onClose?.();
        }, 600);
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
      setFeedback({ type: 'error', message: 'Name and phone number are required.' });
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
          onSuccess?.();
          onClose?.();
        }, 700);
      } else {
        setFeedback({ type: 'error', message: res.message || 'Registration failed.' });
      }
    } catch (err: any) {
      setLoading(false);
      setFeedback({ type: 'error', message: err.message || 'Failed to register.' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      {/* Modal Card Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden my-auto grid grid-cols-1 lg:grid-cols-12 max-h-[92vh]">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        )}

        {/* Left Visual Showcase Panel (Desktop Mockup #3) */}
        <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 text-white flex-col justify-between relative overflow-hidden border-r border-slate-800">
          {/* Subtle Tricolor Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-white to-emerald-500" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Branding & Mission */}
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <BharatKaushalLogo size="md" inline={true} showTagline={false} />
            </div>

            <div className="pt-2">
              <h2 className="text-3xl font-black tracking-tight leading-tight text-white">
                Real People. <br />
                <span className="text-blue-400">Real Skills.</span> <br />
                A Stronger India.
              </h2>
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                Bharat Kaushal connects skilled workers, communities and opportunities through cooperatives — for a self-reliant and stronger India.
              </p>
            </div>

            {/* 5 Value Pillars with Icons */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck size={15} />
                </div>
                <div>
                  <span className="font-bold text-white">Verified Professionals: </span>
                  <span className="text-slate-300">Trusted, skilled, and local</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-200">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Zap size={15} />
                </div>
                <div>
                  <span className="font-bold text-white">Real-time Opportunities: </span>
                  <span className="text-slate-300">Find or post work around you</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-200">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Building2 size={15} />
                </div>
                <div>
                  <span className="font-bold text-white">Cooperative Ownership: </span>
                  <span className="text-slate-300">People grow together</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-200">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <IndianRupee size={15} />
                </div>
                <div>
                  <span className="font-bold text-white">Fair Earnings: </span>
                  <span className="text-slate-300">Transparent and secure (94.5%)</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-200">
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <HeartHandshake size={15} />
                </div>
                <div>
                  <span className="font-bold text-white">Social Welfare: </span>
                  <span className="text-slate-300">Skills create stronger communities</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Live Metrics & Cultural Tagline */}
          <div className="space-y-4 pt-6 border-t border-slate-800 relative z-10">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-base font-black text-amber-400 font-mono">1M+</div>
                <div className="text-[10px] text-slate-400">Workers</div>
              </div>
              <div>
                <div className="text-base font-black text-blue-400 font-mono">50K+</div>
                <div className="text-[10px] text-slate-400">Customers</div>
              </div>
              <div>
                <div className="text-base font-black text-emerald-400 font-mono">2,500+</div>
                <div className="text-[10px] text-slate-400">Cooperatives</div>
              </div>
              <div>
                <div className="text-base font-black text-rose-400 font-mono">28+</div>
                <div className="text-[10px] text-slate-400">States</div>
              </div>
            </div>

            <div className="text-center">
              <span className="text-xs font-semibold text-amber-300 italic">
                &ldquo;Kaushal se Atmanirbhar Bharat&rdquo;
              </span>
            </div>
          </div>
        </div>

        {/* Right Authentication Form Panel (Matching Mockup #3) */}
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
          <div className="space-y-5">
            {/* Top Tabs: Login vs Create Account */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => {
                    setActiveTab('LOGIN');
                    setFeedback(null);
                  }}
                  className={`text-sm font-bold pb-2 relative transition-colors ${
                    activeTab === 'LOGIN' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t('Login', 'Login')}
                  {activeTab === 'LOGIN' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveTab('REGISTER');
                    setFeedback(null);
                  }}
                  className={`text-sm font-bold pb-2 relative transition-colors ${
                    activeTab === 'REGISTER' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t('Create_Account', 'Create Account')}
                  {activeTab === 'REGISTER' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              </div>

              {/* Language Indicator */}
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Globe size={13} />
                <span>{lang === 'hi' ? 'हिंदी' : 'English'}</span>
              </div>
            </div>

            {/* Role Switcher Pills */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleRoleChange('CUSTOMER')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                    selectedRole === 'CUSTOMER'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <User size={13} />
                  <span className="text-[10px]">Citizen</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('WORKER')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                    selectedRole === 'WORKER'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <HardHat size={13} />
                  <span className="text-[10px]">Worker</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('SOCIETY_ADMIN')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                    selectedRole === 'SOCIETY_ADMIN'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <Building2 size={13} />
                  <span className="text-[10px]">Society</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('FEDERATION_ADMIN')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                    selectedRole === 'FEDERATION_ADMIN'
                      ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <Sliders size={13} />
                  <span className="text-[10px]">Federation</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('SUPER_ADMIN')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all col-span-2 sm:col-span-1 ${
                    selectedRole === 'SUPER_ADMIN'
                      ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <Shield size={13} />
                  <span className="text-[10px]">Govt Apex</span>
                </button>
              </div>
            </div>

            {/* Header Text */}
            <div>
              <h3 className="text-xl font-black text-slate-900">
                {activeTab === 'LOGIN' ? 'Welcome Back' : 'Join Bharat Kaushal'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeTab === 'LOGIN'
                  ? `Login as ${selectedRole.replace(/_/g, ' ')} to continue to your dashboard`
                  : 'Register for democratic, transparent cooperative service'}
              </p>
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
                {/* Identifier Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {selectedRole === 'CUSTOMER' || selectedRole === 'WORKER'
                      ? 'Email or Mobile Number'
                      : 'Official ID or Registration Code'}
                  </label>
                  <div className="relative">
                    <input
                      id="auth-identifier-input"
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={selectedRole === 'CUSTOMER' ? '9826012345 or your@email.com' : 'Enter registered ID'}
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    <Mail size={15} className="absolute right-3.5 top-3 text-slate-400" />
                  </div>
                </div>

                {/* Credential / OTP Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      {authMethod === 'OTP' ? 'Verification Code (OTP)' : 'PIN / Password'}
                    </label>
                    <div className="flex items-center gap-3">
                      {(selectedRole === 'CUSTOMER' || selectedRole === 'WORKER') && (
                        <button
                          type="button"
                          onClick={() => setAuthMethod(authMethod === 'OTP' ? 'PASSWORD' : 'OTP')}
                          className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
                        >
                          {authMethod === 'OTP' ? 'Use Password/PIN' : 'Use OTP'}
                        </button>
                      )}
                      <span className="text-[11px] text-blue-600 hover:underline cursor-pointer">
                        Forgot Password?
                      </span>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      id="auth-credential-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={credential}
                      onChange={(e) => setCredential(e.target.value)}
                      placeholder={authMethod === 'OTP' ? 'Enter 4-digit code (e.g. 4829)' : 'Enter password'}
                      className="w-full pl-3.5 pr-20 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono"
                    />
                    <div className="absolute right-2 top-2 flex items-center gap-1">
                      {authMethod === 'OTP' && (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="px-2 py-1 rounded text-[10px] font-bold bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          {otpSent ? 'Resend' : 'Get OTP'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="text-xs text-slate-600 cursor-pointer">
                    Remember me on this device
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  id="auth-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Login to {selectedRole.replace(/_/g, ' ')}</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (Aadhaar linked)</label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Address / Locality (Indore)</label>
                  <input
                    type="text"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="e.g. Scheme 78, Vijay Nagar"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading ? 'Registering...' : 'Create Account & Continue'}
                </button>
              </form>
            )}

            {/* Alternative Govt / Instant Auth Options */}
            <div className="pt-2">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-[10px] text-slate-400 uppercase tracking-wider">
                  or continue with
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('OTP');
                    handleSendOtp();
                  }}
                  className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone size={13} className="text-blue-600" />
                  <span className="text-[11px]">Instant OTP</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFeedback({
                      type: 'success',
                      message: 'UIDAI Aadhaar e-KYC verified via safe masked protocol.',
                    });
                  }}
                  className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShieldCheck size={13} className="text-emerald-600" />
                  <span className="text-[11px]">Aadhaar</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const cust = availableAccounts.customers[0];
                    if (cust) switchCustomer(cust);
                    setFeedback({ type: 'success', message: 'Signed in with demo citizen account.' });
                    setTimeout(() => {
                      onSuccess?.();
                      onClose?.();
                    }, 500);
                  }}
                  className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles size={13} className="text-amber-500" />
                  <span className="text-[11px]">1-Click Demo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Security Trust Note (Mockup #3) */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
            <ShieldCheck size={18} className="text-blue-600 shrink-0" />
            <div className="text-[11px] text-slate-600 leading-tight">
              <strong className="text-slate-800">Your data is safe with us: </strong>
              We use MP Cooperative DPI and UIDAI masked tokenization standards.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
