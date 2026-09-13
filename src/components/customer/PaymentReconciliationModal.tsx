import React, { useState } from 'react';
import { Booking, PaymentMethodType } from '../../types';
import { SupportedLanguage, getTranslation } from '../../utils/i18n';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  CreditCard,
  Banknote,
  QrCode,
  Lock,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
  AlertCircle,
  Building2,
  Receipt,
  RotateCcw,
  Check,
} from 'lucide-react';

interface PaymentReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onPaymentSuccess: (updatedBooking: Booking) => void;
  lang?: SupportedLanguage;
}

type TabType = 'UPI' | 'DEBIT_CARD' | 'CREDIT_CARD' | 'CASH';

export const PaymentReconciliationModal: React.FC<PaymentReconciliationModalProps> = ({
  isOpen,
  onClose,
  booking,
  onPaymentSuccess,
  lang = 'en',
}) => {
  if (!isOpen || !booking) return null;

  const t = (key: string, fallback?: string) => getTranslation(lang, key, fallback);
  const totalAmount = booking.pricing.netPayable;

  const [activeTab, setActiveTab] = useState<TabType>('UPI');

  // UPI State
  const [upiMode, setUpiMode] = useState<'VPA' | 'APPS' | 'QR'>('VPA');
  const [upiId, setUpiId] = useState('priyasharma@okhdfcbank');
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');

  // Card State (Debit & Credit)
  const [cardNumber, setCardNumber] = useState('4532 8921 7384 1092');
  const [cardName, setCardName] = useState(booking.customerName || 'Priya Sharma');
  const [expiry, setExpiry] = useState('08/28');
  const [cvv, setCvv] = useState('482');
  const [selectedBank, setSelectedBank] = useState('State Bank of India');

  // Cash State
  const [cashTendered, setCashTendered] = useState<number>(Math.ceil(totalAmount / 100) * 100);
  const [cashConfirmed, setCashConfirmed] = useState(true);

  // Gateway Simulation State
  const [processingState, setProcessingState] = useState<
    'IDLE' | 'ENCRYPTING' | 'OTP_CHALLENGE' | 'RECONCILING' | 'SUCCESS'
  >('IDLE');
  const [gatewayStepText, setGatewayStepText] = useState('');
  const [mockOtp, setMockOtp] = useState('749210');
  const [otpInput, setOtpInput] = useState('');
  const [mockUpiPin, setMockUpiPin] = useState('••••');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-format card number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const detectCardBrand = (num: string) => {
    const clean = num.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (clean.startsWith('5')) return 'Mastercard';
    if (clean.startsWith('6') || clean.startsWith('8')) return 'RuPay';
    return 'Card';
  };

  const cashChange = Math.max(0, cashTendered - totalAmount);

  // Payment Execution & Reconciliation
  const handleStartPayment = async () => {
    setErrorMsg(null);

    // Validation
    if (activeTab === 'UPI') {
      if (upiMode === 'VPA' && (!upiId || !upiId.includes('@'))) {
        setErrorMsg('Please enter a valid Virtual Payment Address (VPA) with @');
        return;
      }
    } else if (activeTab === 'DEBIT_CARD' || activeTab === 'CREDIT_CARD') {
      const cleanCard = cardNumber.replace(/\s/g, '');
      if (cleanCard.length < 15) {
        setErrorMsg('Please enter a valid 16-digit card number');
        return;
      }
      if (!expiry || expiry.length < 4) {
        setErrorMsg('Please enter valid MM/YY expiry');
        return;
      }
      if (!cvv || cvv.length < 3) {
        setErrorMsg('Please enter 3-digit CVV');
        return;
      }
    } else if (activeTab === 'CASH') {
      if (cashTendered < totalAmount) {
        setErrorMsg(`Tendered cash must be at least ₹${totalAmount}`);
        return;
      }
      if (!cashConfirmed) {
        setErrorMsg('Please acknowledge that cash was handed to the artisan.');
        return;
      }
    }

    // Cash skips 3DS OTP challenge
    if (activeTab === 'CASH') {
      setProcessingState('RECONCILING');
      setGatewayStepText('Generating cash reconciliation voucher & auditing cooperative ledger...');
      try {
        const res = await fetch(`/api/bookings/${booking.id}/pay`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: 'CASH',
            cashTendered,
            cashChangeReturned: cashChange,
            notes: `Cash on service collected by artisan ${booking.workerName || 'worker'}. Change: ₹${cashChange}`,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Reconciliation failed');
        }

        const updated = await res.json();
        setProcessingState('SUCCESS');
        setTimeout(() => {
          onPaymentSuccess(updated);
        }, 1200);
      } catch (err: any) {
        setErrorMsg(err.message || 'Payment reconciliation failed');
        setProcessingState('IDLE');
      }
      return;
    }

    // Digital Payments Gateway Simulation
    setProcessingState('ENCRYPTING');
    setGatewayStepText('Establishing 256-bit SSL session with NPCI / Bank switch...');

    setTimeout(() => {
      setProcessingState('OTP_CHALLENGE');
      setOtpInput(activeTab === 'UPI' ? '8841' : '749210');
    }, 1200);
  };

  const handleVerifyOtpAndSettle = async () => {
    setProcessingState('RECONCILING');
    setGatewayStepText('Settling payment into cooperative clearing pool & issuing tax invoice...');

    try {
      const details =
        activeTab === 'UPI'
          ? {
              upiVpa: upiMode === 'VPA' ? upiId : `${selectedUpiApp.toLowerCase().replace(/\s/g, '')}@upi`,
              app: upiMode === 'APPS' ? selectedUpiApp : undefined,
            }
          : {
              cardLast4: cardNumber.replace(/\s/g, '').slice(-4),
              cardBrand: detectCardBrand(cardNumber),
              bank: activeTab === 'DEBIT_CARD' ? selectedBank : undefined,
            };

      const res = await fetch(`/api/bookings/${booking.id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: activeTab,
          details,
          notes: `Authorized via ${activeTab} with reference bank authorization switch.`,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Reconciliation failed');
      }

      const updated = await res.json();
      setProcessingState('SUCCESS');
      setTimeout(() => {
        onPaymentSuccess(updated);
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment reconciliation failed');
      setProcessingState('IDLE');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold">
              <Receipt size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white leading-none">
                  Payment Reconciliation
                </h2>
                <span className="text-[10px] bg-blue-400/20 text-blue-200 border border-blue-400/30 font-mono px-2 py-0.5 rounded-full">
                  Post-Task Settlement
                </span>
              </div>
              <p className="text-xs text-blue-200/80 mt-1">
                Booking Ref: <span className="font-mono text-white font-semibold">{booking.id}</span> • {booking.serviceName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={processingState !== 'IDLE'}
            className="p-1.5 text-blue-200 hover:text-white rounded-xl transition-colors disabled:opacity-40"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-slate-800">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Gateway Processing Overlay Modal when active */}
          {processingState !== 'IDLE' ? (
            <div className="py-8 px-4 text-center space-y-6">
              {processingState === 'ENCRYPTING' && (
                <div className="space-y-4 max-w-sm mx-auto">
                  <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center animate-pulse shadow-sm">
                    <Lock size={28} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">Secure Payment Session</h3>
                    <p className="text-xs text-slate-500">{gatewayStepText}</p>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-600 h-2 rounded-full w-2/3 animate-pulse"></div>
                  </div>
                </div>
              )}

              {processingState === 'OTP_CHALLENGE' && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-sm mx-auto text-left space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                        3DS
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        {activeTab === 'UPI' ? 'NPCI UPI Authorization' : 'Bank 3D-Secure Verification'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">₹{totalAmount}</span>
                  </div>

                  <p className="text-xs text-slate-600">
                    {activeTab === 'UPI'
                      ? 'Simulate authenticating your 4-digit UPI transaction PIN:'
                      : `A one-time passcode was dispatched to your mobile linked with ${detectCardBrand(cardNumber)}:`}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder={activeTab === 'UPI' ? 'Enter 4-digit UPI PIN' : 'Enter 6-digit OTP'}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-center tracking-widest text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Demo Auto-fill active</span>
                      <button
                        type="button"
                        onClick={() => setOtpInput(activeTab === 'UPI' ? '8841' : '749210')}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Reset Demo Code
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setProcessingState('IDLE')}
                      className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleVerifyOtpAndSettle}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
                    >
                      {activeTab === 'UPI' ? 'Authorize PIN' : 'Submit OTP'}
                    </button>
                  </div>
                </div>
              )}

              {processingState === 'RECONCILING' && (
                <div className="space-y-4 max-w-sm mx-auto">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center animate-spin">
                    <RotateCcw size={28} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">Finalizing Cooperative Reconciliation</h3>
                    <p className="text-xs text-slate-500">{gatewayStepText}</p>
                  </div>
                </div>
              )}

              {processingState === 'SUCCESS' && (
                <div className="space-y-3 max-w-sm mx-auto animate-in zoom-in-95">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">Reconciliation & Payment Success!</h3>
                  <p className="text-xs text-slate-500">
                    Dispatched ₹{totalAmount} to cooperative pool. Generating official tax invoice now...
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Task Details & Transparency Split */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                      Service Execution Details
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {booking.serviceName}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <span>Artisan: <strong>{booking.workerName || 'Certified Artisan'}</strong></span>
                      <span>•</span>
                      <span>Society: Indore Shramik Kaushal (SOC-IND-02)</span>
                    </div>
                  </div>

                  <div className="sm:text-right bg-white sm:bg-transparent p-2 sm:p-0 rounded-xl border sm:border-none border-slate-200">
                    <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                      Reconciled Total
                    </div>
                    <div className="text-xl font-black text-slate-900 flex sm:justify-end items-center gap-0.5">
                      <span>₹{totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Financial Ledger Split Breakdown */}
                <div className="pt-2 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white rounded-xl p-2 border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Artisan (94.5%)</div>
                    <div className="font-bold text-slate-900">₹{booking.pricing.workerShare}</div>
                  </div>
                  <div className="bg-white rounded-xl p-2 border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Welfare Cess (2.0%)</div>
                    <div className="font-bold text-emerald-700">₹{booking.pricing.welfareShare}</div>
                  </div>
                  <div className="bg-white rounded-xl p-2 border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Society Fee (3.5%)</div>
                    <div className="font-bold text-blue-700">₹{booking.pricing.societyShare}</div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Settlement Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('UPI')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
                      activeTab === 'UPI'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Smartphone size={18} className="mb-1 text-blue-600" />
                    <span>UPI / QR</span>
                    <span className="text-[10px] font-normal text-slate-400">Zero surcharge</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('DEBIT_CARD')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
                      activeTab === 'DEBIT_CARD'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <CreditCard size={18} className="mb-1 text-indigo-600" />
                    <span>Debit Card</span>
                    <span className="text-[10px] font-normal text-slate-400">RuPay / Visa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('CREDIT_CARD')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
                      activeTab === 'CREDIT_CARD'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <CreditCard size={18} className="mb-1 text-purple-600" />
                    <span>Credit Card</span>
                    <span className="text-[10px] font-normal text-slate-400">All major banks</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('CASH')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
                      activeTab === 'CASH'
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-800 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Banknote size={18} className="mb-1 text-emerald-600" />
                    <span>Cash on Service</span>
                    <span className="text-[10px] font-normal text-emerald-600">Pay artisan</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: UPI Form */}
              {activeTab === 'UPI' && (
                <div className="space-y-4 border border-slate-200 rounded-2xl p-4 bg-white">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setUpiMode('VPA')}
                        className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                          upiMode === 'VPA' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        UPI ID / VPA
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpiMode('APPS')}
                        className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                          upiMode === 'APPS' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Popular Apps
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpiMode('QR')}
                        className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                          upiMode === 'QR' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Bharat QR
                      </button>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <ShieldCheck size={14} /> NPCI Switch
                    </span>
                  </div>

                  {upiMode === 'VPA' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Virtual Payment Address (UPI ID)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="username@bank"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white"
                          />
                          <span className="absolute right-3 top-2.5 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                            Verified VPA
                          </span>
                        </div>
                      </div>

                      {/* Quick handles */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400">Quick Handle:</span>
                        {['@okhdfcbank', '@oksbi', '@paytm', '@ybl', '@upi'].map((h) => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => {
                              const prefix = upiId.split('@')[0] || 'customer';
                              setUpiId(`${prefix}${h}`);
                            }}
                            className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 font-mono text-[10px]"
                          >
                            {h}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {upiMode === 'APPS' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['Google Pay', 'PhonePe', 'Paytm UPI', 'BHIM', 'CRED'].map((app) => (
                        <button
                          key={app}
                          type="button"
                          onClick={() => setSelectedUpiApp(app)}
                          className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                            selectedUpiApp === app
                              ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-2xs'
                              : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                          }`}
                        >
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                            ✓
                          </div>
                          <span>{app}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {upiMode === 'QR' && (
                    <div className="text-center py-3 space-y-3">
                      <div className="w-36 h-36 mx-auto bg-slate-50 border border-slate-300 rounded-2xl p-2 flex flex-col items-center justify-center shadow-xs">
                        <QrCode size={110} className="text-slate-800" />
                        <span className="text-[9px] font-mono text-slate-500 mt-1">BHARAT KAUSHAL DYNAMIC QR</span>
                      </div>
                      <div className="text-xs text-slate-600">
                        Scan with any UPI app • Amount auto-locked to <strong>₹{totalAmount}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={handleStartPayment}
                        className="px-4 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold border border-blue-200"
                      >
                        Simulate QR Scan from Phone
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2 & 3: Debit / Credit Card Form */}
              {(activeTab === 'DEBIT_CARD' || activeTab === 'CREDIT_CARD') && (
                <div className="space-y-4 border border-slate-200 rounded-2xl p-4 bg-white">
                  {activeTab === 'DEBIT_CARD' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Issuing Bank
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Punjab National Bank', 'Bank of Baroda'].map(
                          (bank) => (
                            <button
                              key={bank}
                              type="button"
                              onClick={() => setSelectedBank(bank)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                                selectedBank === bank
                                  ? 'bg-blue-600 text-white font-semibold'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {bank}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4532 0000 0000 0000"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded">
                        {detectCardBrand(cardNumber)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Priya Sharma"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value.slice(0, 5))}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-center font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.slice(0, 4))}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-center font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                    <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                    <span>Tokenized & secured under Reserve Bank of India card security directives.</span>
                  </div>
                </div>
              )}

              {/* Tab 4: Cash on Service Form */}
              {activeTab === 'CASH' && (
                <div className="space-y-4 border border-emerald-200 rounded-2xl p-4 bg-emerald-50/40">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Banknote size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        In-Person Cash Settlement to Artisan
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Hand over cash directly to <strong>{booking.workerName || 'Artisan'}</strong> upon physical verification of the repaired service. An official electronic cash receipt will be generated.
                      </p>
                    </div>
                  </div>

                  {/* Cash Change Calculator */}
                  <div className="bg-white rounded-xl p-3 border border-emerald-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">Cash you will hand over:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 font-mono">₹</span>
                        <input
                          type="number"
                          value={cashTendered}
                          onChange={(e) => setCashTendered(Number(e.target.value) || 0)}
                          className="w-20 px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 font-mono text-right"
                        />
                      </div>
                    </div>

                    {/* Quick Cash Presets */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setCashTendered(totalAmount)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                          cashTendered === totalAmount
                            ? 'bg-emerald-700 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Exact (₹{totalAmount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setCashTendered(Math.ceil(totalAmount / 100) * 100)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                          cashTendered === Math.ceil(totalAmount / 100) * 100 && cashTendered !== totalAmount
                            ? 'bg-emerald-700 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Next 100 (₹{Math.ceil(totalAmount / 100) * 100})
                      </button>
                      <button
                        type="button"
                        onClick={() => setCashTendered(500)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                          cashTendered === 500
                            ? 'bg-emerald-700 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        ₹500 Note
                      </button>
                    </div>

                    {cashChange > 0 && (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-800 font-bold">
                        <span>Change artisan will return:</span>
                        <span className="font-mono text-sm">₹{cashChange}</span>
                      </div>
                    )}
                  </div>

                  <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={cashConfirmed}
                      onChange={(e) => setCashConfirmed(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>
                      I confirm that <strong>₹{cashTendered}</strong> in cash has been presented to certified artisan <strong>{booking.workerName || 'worker'}</strong>, and change of <strong>₹{cashChange}</strong> was accounted for.
                    </span>
                  </label>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {processingState === 'IDLE' && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
              <span>Cooperative Guarantee: 100% transparent statutory ledger.</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartPayment}
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-600 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>
                  {activeTab === 'CASH'
                    ? `Confirm Cash & Reconcile ₹${totalAmount}`
                    : `Authorize & Pay ₹${totalAmount}`}
                </span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
