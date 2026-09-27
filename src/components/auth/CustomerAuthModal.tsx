import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  User,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  LogOut,
  Sparkles,
  ArrowRight,
  UserCheck,
  Home,
  Building,
  Mail,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CustomerProfile } from '../../types';
import { EmailVerificationWidget } from '../common/EmailVerificationWidget';

interface CustomerAuthModalProps {
  isOpen: boolean;
  initialTab?: 'LOGIN' | 'DEMO' | 'REGISTER';
  onClose: () => void;
  onSuccess?: () => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  initialTab,
  onClose,
  onSuccess,
}) => {
  const {
    customerUser,
    isCustomerAuthenticated,
    loginCustomer,
    registerCustomer,
    logoutCustomer,
    switchCustomer,
    availableAccounts,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'LOGIN' | 'DEMO' | 'REGISTER'>(initialTab || 'LOGIN');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Form states - strictly empty initial values without hardcoded prefill
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Registration states
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regLocality, setRegLocality] = useState('Vijay Nagar');
  const [regAddress, setRegAddress] = useState('');
  const [regLandmark, setRegLandmark] = useState('');
  const [regPinCode, setRegPinCode] = useState('452010');

  if (!isOpen) return null;

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      setFeedback({ type: 'error', message: 'Please enter a valid 10-digit mobile number' });
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setFeedback({
      type: 'success',
      message: `Simulated OTP [${code}] sent to +91 ${phone}`,
    });
  };

  const handleVerifyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const res = await loginCustomer({ phone, otp: otpValue });
    setLoading(false);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message || 'Login successful!' });
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 700);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Invalid authentication credentials' });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      setFeedback({ type: 'error', message: 'Name and Phone number are required' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    const res = await registerCustomer({
      name: regName,
      phone: regPhone,
      email: regEmail || undefined,
      address: regAddress || `${regLocality}, Indore`,
      locality: regLocality,
      landmark: regLandmark || undefined,
      pinCode: regPinCode,
    });

    setLoading(false);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message || 'Citizen account registered!' });
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 800);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Registration failed' });
    }
  };

  const handleQuickSwitch = (cust: CustomerProfile) => {
    switchCustomer(cust);
    setFeedback({ type: 'success', message: `Switched to citizen profile: ${cust.name}` });
    setTimeout(() => {
      onSuccess?.();
      onClose();
    }, 500);
  };

  return (
    <div
      id="customer-auth-modal"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
              <User className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-base tracking-tight text-white">{t('Citizen_Customer_Auth_pbbil', `Citizen Customer Auth`)}</h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 font-medium border border-emerald-400/30">
                  {t('Household_Services_yffau', `Household Services`)}</span>
              </div>
              <p className="text-xs text-emerald-100/80">{t('Indore_Municipal_Citizen_Servi_uljk2', `Indore Municipal Citizen Service Portal`)}</p>
            </div>
          </div>
          <button
            id="close-customer-auth-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Authenticated Status Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${isCustomerAuthenticated ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-amber-400'}`} />
            <div>
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                <span>{isCustomerAuthenticated ? (customerUser?.name || 'Logged In Citizen') : 'Guest Citizen (Unauthenticated)'}</span>
                {isCustomerAuthenticated && customerUser?.email && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${customerUser.emailVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {customerUser.emailVerified ? '✓ Email Verified' : 'Email Unverified'}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500">
                {isCustomerAuthenticated
                  ? `+91 ${customerUser?.phone} • ${customerUser?.email || 'No email registered'} • ID: ${customerUser?.id}`
                  : 'Sign in to access verified booking & track requests'}
              </div>
            </div>
          </div>
          {isCustomerAuthenticated && (
            <button
              id="customer-logout-btn"
              onClick={logoutCustomer}
              className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-md transition-colors w-full sm:w-auto flex items-center justify-center sm:justify-start gap-1.5 border border-rose-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              {t('Sign_Out_pc05m', `Sign Out`)}</button>
          )}
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-100/50 p-1.5 gap-1 text-xs font-medium">
          <button
            id="cust-tab-login"
            onClick={() => { setActiveTab('LOGIN'); setFeedback(null); }}
            className={`flex-1 py-2 px-3 rounded-lg text-center transition-all ${
              activeTab === 'LOGIN'
                ? 'bg-white text-emerald-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('Mobile_OTP_Login_esy41', `Mobile OTP Login`)}</button>
          <button
            id="cust-tab-demo"
            onClick={() => { setActiveTab('DEMO'); setFeedback(null); }}
            className={`flex-1 py-2 px-3 rounded-lg text-center transition-all ${
              activeTab === 'DEMO'
                ? 'bg-white text-emerald-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('Demo_Profiles__3__ethvy', `Demo Profiles (3)`)}</button>
          <button
            id="cust-tab-register"
            onClick={() => { setActiveTab('REGISTER'); setFeedback(null); }}
            className={`flex-1 py-2 px-3 rounded-lg text-center transition-all ${
              activeTab === 'REGISTER'
                ? 'bg-white text-emerald-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('New_Citizen_o2mew', `New Citizen`)}</button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Feedback message banner */}
          {feedback && (
            <div
              className={`mb-4 p-3 rounded-xl text-xs flex items-start gap-2.5 border ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="flex-1">{feedback.message}</span>
            </div>
          )}

          {/* TAB 1: MOBILE OTP LOGIN */}
          {activeTab === 'LOGIN' && (
            <form onSubmit={handleVerifyLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('Mobile_Number__Registered_in_M_umy78', `Mobile Number (Registered in Madhya Pradesh)`)}</label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
                    {t('_91_uiuvd', `+91`)}</div>
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="cust-phone-input"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('98260_12345_9k18t', `98260 12345`)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                  <button
                    type="button"
                    id="cust-send-otp-btn"
                    onClick={handleSendOtp}
                    className="px-3.5 py-2 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap"
                  >
                    {otpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                </div>
              </div>

              {otpSent && (
                <div className="space-y-3 p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <div className="flex items-center justify-between text-xs text-emerald-800 font-medium">
                    <span>{t('Enter_4_Digit_OTP_Code_yd8x4', `Enter 4-Digit OTP Code`)}</span>
                    <button
                      type="button"
                      onClick={() => setOtpValue(generatedOtp)}
                      className="text-emerald-600 underline text-[11px] hover:text-emerald-700"
                    >
                      {t('Quick_Auto_Fill___fx1rb', `Quick Auto-Fill (`)}{generatedOtp})
                    </button>
                  </div>
                  <input
                    id="cust-otp-input"
                    type="text"
                    maxLength={4}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    placeholder={t('Enter_4_digit_code_z6bl8', `Enter 4-digit code`)}
                    className="w-full text-center tracking-widest text-lg font-semibold py-2 rounded-lg border border-emerald-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-500 text-center">
                    {t('Demo_security_bypass__Enter_co_nuez0', `Demo security bypass: Enter code`)}<span className="font-semibold text-emerald-700">{generatedOtp}</span> {t('or_click_Auto_Fill_1cf8q', `or click Auto-Fill`)}</p>
                </div>
              )}

              <button
                type="submit"
                id="cust-submit-login-btn"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? 'Authenticating Citizen...' : 'Sign In with Mobile OTP'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t('End_to_end_encrypted_session_w_ydgai', `End-to-end encrypted session with Indore Smart City Citizen ID`)}</span>
              </div>
            </form>
          )}

          {/* TAB 2: DEMO CITIZEN ACCOUNTS */}
          {activeTab === 'DEMO' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 mb-2">
                {t('Select_any_pre_configured_Indo_yqscx', `Select any pre-configured Indore citizen account to test bookings, live tracking, and cancellation safeguards:`)}</p>
              {availableAccounts.customers.map((cust) => {
                const isCurrent = customerUser?.id === cust.id && isCustomerAuthenticated;
                return (
                  <div
                    key={cust.id}
                    onClick={() => handleQuickSwitch(cust)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isCurrent
                        ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {cust.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">{cust.name}</span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-600 text-white">
                              {t('Active_c7bsn', `Active`)}</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3" />
                          <span>{t('_91_pf1ld', `+91`)}{cust.phone}</span>
                          <span>•</span>
                          <span className="truncate max-w-[170px]">{cust.addresses[0]?.address || 'Indore'}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        isCurrent
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
                      }`}
                    >
                      {isCurrent ? 'Current' : 'Select'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: REGISTER NEW CITIZEN */}
          {activeTab === 'REGISTER' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('Full_Legal_Name_0vvlr', `Full Legal Name`)}</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder={t('e_g__Vikramaditya_Rao_7h790', `e.g. Vikramaditya Rao`)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('Phone_Number_7z1ta', `Phone Number`)}</label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder={t('98260_00000_7747c', `98260 00000`)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('Locality__Indore__ar1d8', `Locality (Indore)`)}</label>
                  <select
                    value={regLocality}
                    onChange={(e) => setRegLocality(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                  >
                    <option value="Vijay Nagar">{t('Vijay_Nagar_noi2p', `Vijay Nagar`)}</option>
                    <option value="Palasia">{t('Old___New_Palasia_m9dpa', `Old & New Palasia`)}</option>
                    <option value="Navlakha">{t('Navlakha___Bhanwarkuan_4wsi1', `Navlakha / Bhanwarkuan`)}</option>
                    <option value="Rajwada">{t('Rajwada___Sarafa_3trpi', `Rajwada / Sarafa`)}</option>
                    <option value="Annapurna">{t('Annapurna___Sudama_Nagar_hno8u', `Annapurna / Sudama Nagar`)}</option>
                    <option value="Rau Bypass">{t('Rau___Bypass_yj3j6', `Rau / Bypass`)}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('Premises_Address_gu6bn', `Premises Address`)}</label>
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder={t('Flat_No__Building__Street_Name_epsi3', `Flat No, Building, Street Name`)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              {/* Optional Email & Verification Widget */}
              <div className="pt-1">
                <EmailVerificationWidget
                  role="CUSTOMER"
                  initialEmail={regEmail}
                  onVerificationSuccess={(verifiedEmail) => {
                    setRegEmail(verifiedEmail);
                  }}
                  compact={false}
                  showBenefits={true}
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('Landmark_g58ez', `Landmark`)}</label>
                  <input
                    type="text"
                    value={regLandmark}
                    onChange={(e) => setRegLandmark(e.target.value)}
                    placeholder={t('Near_Square___Park_1y9y6', `Near Square / Park`)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('PIN_Code_9owgn', `PIN Code`)}</label>
                  <input
                    type="text"
                    value={regPinCode}
                    onChange={(e) => setRegPinCode(e.target.value)}
                    placeholder={t('452010_7unmt', `452010`)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-2"
              >
                {loading ? 'Creating Citizen Profile...' : 'Complete Citizen Registration'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-500">
            {t('Protected_under_Madhya_Pradesh_m2d8a', `Protected under Madhya Pradesh Citizen Services Guarantee Act & Consumer Grievance Tribunal`)}</p>
        </div>
      </div>
    </div>
  );
};
