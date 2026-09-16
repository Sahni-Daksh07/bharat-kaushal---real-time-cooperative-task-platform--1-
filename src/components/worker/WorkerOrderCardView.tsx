import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  PhoneCall,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HardHat,
  Receipt,
  Printer,
  ChevronRight,
  Sparkles,
  ExternalLink,
  PlusCircle,
  FileText,
  BadgeAlert,
  HelpCircle,
  Radio,
  Navigation,
  Compass,
} from 'lucide-react';
import { Booking, WorkerProfile } from '../../types';
import { SupportedLanguage, getTranslation } from '../../utils/i18n';
import { WorkerJobMap } from './WorkerJobMap';

interface WorkerOrderCardViewProps {
  currentWorker: WorkerProfile;
  activeBooking?: Booking;
  allBookings: Booking[];
  language: SupportedLanguage;
  policy: {
    activeModel: 'MODEL_A' | 'MODEL_B';
  };
  onBackToDashboard: () => void;
  onStartJourney?: (bookingId: string) => void;
  onWorkerArrived?: (bookingId: string) => void;
  onVerifyArrivalOtp?: (bookingId: string, otp: string) => boolean | Promise<boolean>;
  onCompleteJob?: (bookingId: string) => void;
  onVerifyCompletionOtp?: (bookingId: string, otp: string) => boolean | Promise<boolean>;
  onRequestMaterialCharge?: (bookingId: string, materialCost: number, description: string) => void;
  onCancelBooking?: (bookingId: string, reason: string, cancelledBy: 'WORKER' | 'CUSTOMER') => void;
  onVerifyArrival?: (otp: string) => Promise<boolean> | boolean;
  onVerifyCompletion?: (otp: string) => Promise<boolean> | boolean;
  onRequestMaterial?: () => void;
  onOpenAppeal?: () => void;
  onOpenMap?: () => void;
  onSimulateStep?: (bookingId: string) => void;
}

export const WorkerOrderCardView: React.FC<WorkerOrderCardViewProps> = ({
  currentWorker,
  activeBooking,
  allBookings,
  language,
  policy,
  onBackToDashboard,
  onStartJourney,
  onWorkerArrived,
  onVerifyArrivalOtp,
  onCompleteJob,
  onVerifyCompletionOtp,
  onRequestMaterialCharge,
  onCancelBooking,
  onVerifyArrival,
  onVerifyCompletion,
  onRequestMaterial,
  onOpenAppeal,
  onOpenMap,
  onSimulateStep,
}) => {
  const t = (key: string, fallback: string) => getTranslation(language, key, fallback);

  // If there's no active booking, allow viewing past completed bookings or standby card
  const workerBookings = allBookings.filter((b) => b.workerId === currentWorker.id);
  const completedBookings = workerBookings.filter(
    (b) => b.status === 'COMPLETED' || b.status === 'PAID' || b.status === 'SETTLED'
  );

  const [selectedPastBooking, setSelectedPastBooking] = useState<Booking | null>(null);
  const [arrivalOtp, setArrivalOtp] = useState('');
  const [completionOtp, setCompletionOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifyingArrival, setIsVerifyingArrival] = useState(false);
  const [isVerifyingCompletion, setIsVerifyingCompletion] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const displayBooking = activeBooking || selectedPastBooking || completedBookings[0];

  const isArrivalVerified = (b?: Booking | null) =>
    !b ? false : (
      b.status === 'ARRIVAL_OTP_VERIFIED' ||
      b.status === 'IN_PROGRESS' ||
      b.status === 'MATERIAL_REVIEW' ||
      b.status === 'COMPLETION_PENDING' ||
      b.status === 'COMPLETION_OTP_VERIFIED' ||
      b.status === 'CUSTOMER_CONFIRMED' ||
      b.status === 'PAYMENT_PENDING' ||
      b.status === 'PAID' ||
      b.status === 'SETTLED' ||
      b.status === 'COMPLETED'
    );

  const isCompletionVerified = (b?: Booking | null) =>
    !b ? false : (
      b.status === 'COMPLETION_OTP_VERIFIED' ||
      b.status === 'CUSTOMER_CONFIRMED' ||
      b.status === 'PAYMENT_PENDING' ||
      b.status === 'PAID' ||
      b.status === 'SETTLED' ||
      b.status === 'COMPLETED'
    );

  const handleArrivalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    if (!arrivalOtp || arrivalOtp.length !== 4) {
      setOtpError('Please enter valid 4-digit Arrival OTP from customer');
      return;
    }
    setIsVerifyingArrival(true);
    let success = false;
    if (onVerifyArrivalOtp && displayBooking) {
      success = Boolean(await Promise.resolve(onVerifyArrivalOtp(displayBooking.id, arrivalOtp)));
    } else if (onVerifyArrival) {
      success = Boolean(await Promise.resolve(onVerifyArrival(arrivalOtp)));
    }
    setIsVerifyingArrival(false);
    if (!success) {
      setOtpError('Invalid Arrival OTP. Please re-check with citizen.');
    } else {
      setArrivalOtp('');
    }
  };

  const handleCompletionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    if (!completionOtp || completionOtp.length !== 4) {
      setOtpError('Please enter valid 4-digit Completion OTP from customer');
      return;
    }
    setIsVerifyingCompletion(true);
    let success = false;
    if (onVerifyCompletionOtp && displayBooking) {
      success = Boolean(await Promise.resolve(onVerifyCompletionOtp(displayBooking.id, completionOtp)));
    } else if (onVerifyCompletion) {
      success = Boolean(await Promise.resolve(onVerifyCompletion(completionOtp)));
    }
    setIsVerifyingCompletion(false);
    if (!success) {
      setOtpError('Invalid Completion OTP. Please check customer SMS/Portal.');
    } else {
      setCompletionOtp('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200 dashboard-container" data-dashboard-container="true">
      {/* Top Header & Breadcrumb Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4 dashboard-card" data-dashboard-card="true">
        <div className="flex items-center gap-3">
          <button
            id="btn-order-card-back"
            onClick={onBackToDashboard}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors shadow-2xs"
            title="Return to Worker Dashboard"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                Cooperative Work Order
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-mono">
                DISPATCH REF: {displayBooking ? displayBooking.id : 'STANDBY'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 flex items-center gap-2">
              <span>Job Order Card & Worksite Dispatch</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors border border-slate-200"
            title="Print Official Order Card"
          >
            <Printer size={15} />
            <span className="hidden sm:inline">Print Order Card</span>
          </button>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Radio size={14} className="animate-pulse" />
            <span>Live Radar</span>
          </button>
        </div>
      </div>

      {displayBooking ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Order Card Body */}
          <div className="lg:col-span-8 space-y-5">
            {/* Primary Order Dossier Card */}
            <div className="bg-white rounded-2xl border-2 border-blue-600 p-5 sm:p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 rounded-bl-full pointer-events-none" />

              {/* Status & Service Title */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wide ${
                      displayBooking.status === 'COMPLETED' || displayBooking.status === 'PAID' || displayBooking.status === 'SETTLED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : displayBooking.status === 'IN_PROGRESS' || displayBooking.status === 'ARRIVAL_OTP_VERIFIED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {displayBooking.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Order No: <strong className="font-mono text-slate-800">{displayBooking.id}</strong>
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {displayBooking.serviceName}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <span>Trade: <strong className="text-blue-700">{displayBooking.workerTrade || displayBooking.category || currentWorker.primaryTrade}</strong></span>
                    <span>•</span>
                    <span>Scheduled: <strong>{displayBooking.createdAt ? new Date(displayBooking.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Immediate Dispatch'}</strong></span>
                  </p>
                </div>

                <div className="text-right bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    Your Share ({policy.activeModel === 'MODEL_A' ? '94.5%' : '95.0%'})
                  </div>
                  <div className="text-2xl font-black text-emerald-700">
                    ₹{displayBooking.pricing.workerShare}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Net Direct UPI Transfer
                  </div>
                </div>
              </div>

              {/* Citizen & Location Particulars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={13} className="text-blue-600" />
                    <span>Citizen Particulars</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {displayBooking.customerName}
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${displayBooking.customerPhone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors"
                    >
                      <PhoneCall size={13} />
                      <span>Call {displayBooking.customerPhone}</span>
                    </a>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={13} className="text-rose-600" />
                    <span>Service Location</span>
                  </div>
                  <div className="text-xs text-slate-700 font-medium leading-relaxed">
                    {displayBooking.customerAddress.address}, {displayBooking.customerAddress.city}
                    {displayBooking.customerAddress.landmark && (
                      <span className="block text-slate-500 mt-0.5">
                        Landmark: <strong>{displayBooking.customerAddress.landmark}</strong>
                      </span>
                    )}
                  </div>
                  {displayBooking && (
                    <div className="flex flex-wrap items-center gap-2 pt-1.5">
                      <button
                        type="button"
                        id="btn-view-customer-gps-map"
                        onClick={() => {
                          if (onOpenMap) onOpenMap();
                          setIsMapModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                      >
                        <Navigation size={13} />
                        <span>View on GPS Map & Navigation →</span>
                      </button>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${displayBooking.customerAddress.lat ?? (displayBooking.customerAddress.address.toLowerCase().includes('navlakha') ? 22.7051 : 22.7533)},${displayBooking.customerAddress.lng ?? (displayBooking.customerAddress.address.toLowerCase().includes('navlakha') ? 75.8752 : 75.8937)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-300"
                        title="Open Direct Turn-by-Turn GPS Navigation in Google Maps"
                      >
                        <span>Google Maps</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Verification & Lifecycle OTP Action Boxes */}
              {activeBooking && (
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-blue-600" />
                    <span>On-Site Security Verification & OTPs</span>
                  </h3>

                  {otpError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-medium">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Arrival OTP Card */}
                    <div className="border border-slate-200 rounded-xl p-4 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-800">1. Arrival OTP</span>
                        {isArrivalVerified(displayBooking) ? (
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 size={11} /> VERIFIED
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            PENDING
                          </span>
                        )}
                      </div>

                      {isArrivalVerified(displayBooking) ? (
                        <p className="text-xs text-slate-500">
                          Arrival at customer site authenticated via secure OTP.
                        </p>
                      ) : (
                        <form onSubmit={handleArrivalSubmit} className="space-y-2">
                          <p className="text-[11px] text-slate-500">
                            Ask citizen for the 4-digit arrival OTP shown on their screen.
                          </p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength={4}
                              placeholder="4-digit OTP"
                              value={arrivalOtp}
                              onChange={(e) => setArrivalOtp(e.target.value)}
                              className="w-28 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold text-center tracking-widest focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <button
                              type="submit"
                              disabled={isVerifyingArrival}
                              className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                            >
                              {isVerifyingArrival ? 'Verifying...' : 'Verify'}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>

                    {/* Completion OTP Card */}
                    <div className="border border-slate-200 rounded-xl p-4 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-800">2. Completion OTP</span>
                        {isCompletionVerified(displayBooking) ? (
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 size={11} /> VERIFIED
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            REQUIRED TO FINISH
                          </span>
                        )}
                      </div>

                      {isCompletionVerified(displayBooking) ? (
                        <p className="text-xs text-emerald-600 font-semibold">
                          Job completed! Payment and welfare credits cleared.
                        </p>
                      ) : (
                        <form onSubmit={handleCompletionSubmit} className="space-y-2">
                          <p className="text-[11px] text-slate-500">
                            Verify customer satisfaction & enter 4-digit completion code.
                          </p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength={4}
                              placeholder="4-digit OTP"
                              value={completionOtp}
                              onChange={(e) => setCompletionOtp(e.target.value)}
                              className="w-28 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold text-center tracking-widest focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                            <button
                              type="submit"
                              disabled={isVerifyingCompletion}
                              className="flex-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                            >
                              {isVerifyingCompletion ? 'Closing...' : 'Complete Job'}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Material Charge Actions */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Receipt size={15} className="text-slate-500" />
                  <span className="text-slate-600">
                    Materials Charged: <strong>₹{displayBooking.pricing.materialsTotal || 0}</strong>
                  </span>
                </div>
                {activeBooking && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onRequestMaterial}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <PlusCircle size={13} className="text-blue-600" />
                      <span>Request Materials</span>
                    </button>
                    <button
                      onClick={onOpenAppeal}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <BadgeAlert size={13} className="text-rose-600" />
                      <span>Issue / Appeal</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* If there are other past bookings, provide a selector */}
            {completedBookings.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                  <Clock size={15} className="text-blue-600" />
                  <span>Other Order Cards in Worker History ({completedBookings.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {completedBookings.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedPastBooking(b)}
                      className={`text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                        displayBooking.id === b.id
                          ? 'border-blue-500 bg-blue-50/50 shadow-2xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900">{b.serviceName}</div>
                        <div className="text-slate-500 text-[11px]">
                          #{b.id} • ₹{b.pricing.workerShare} earned
                        </div>
                      </div>
                      <ChevronRight size={15} className="text-slate-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Transparent Pricing Split & Artisan Credentials */}
          <div className="lg:col-span-4 space-y-5">
            {/* Transparent Rate Card & Split Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
                <Receipt size={16} className="text-blue-600" />
                <span>Transparent Cooperative Pricing</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Base Labour Charge:</span>
                  <span className="font-semibold text-slate-900">₹{displayBooking.pricing.baseLabour}</span>
                </div>
                {displayBooking.pricing.materialsTotal > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Approved Materials:</span>
                    <span className="font-semibold text-slate-900">₹{displayBooking.pricing.materialsTotal}</span>
                  </div>
                )}
                {displayBooking.pricing.travelCharge > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Travel / Fuel Allowance:</span>
                    <span className="font-semibold text-slate-900">₹{displayBooking.pricing.travelCharge}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-800">
                  <span>Total Gross Amount:</span>
                  <span>₹{displayBooking.pricing.grossAmount}</span>
                </div>
              </div>

              {/* Cooperative Model Split Display */}
              <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 border border-slate-200/90 text-xs">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Mandatory Cooperative Distribution
                </div>
                <div className="flex justify-between items-center text-emerald-800 font-bold">
                  <span>Artisan Direct Take-home (94.5%):</span>
                  <span className="text-sm font-black">₹{displayBooking.pricing.workerShare}</span>
                </div>
                <div className="flex justify-between items-center text-blue-800">
                  <span>Labour Welfare Fund (MPSLWB 2%):</span>
                  <span className="font-semibold">₹{displayBooking.pricing.welfareShare}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Cooperative Ops & Platform (3.5%):</span>
                  <span className="font-semibold">₹{displayBooking.pricing.societyShare}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 leading-relaxed bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                🔒 Protected by Madhya Pradesh Labour Welfare Board regulations. Zero predatory platform commissions.
              </div>
            </div>

            {/* Artisan Credentials Badge */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <HardHat size={15} className="text-amber-600" />
                <span>Assigned Cooperative Artisan</span>
              </h3>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white font-black text-lg flex items-center justify-center shadow-xs">
                  {currentWorker.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">{currentWorker.name}</div>
                  <div className="text-xs text-blue-700 font-medium">{currentWorker.primaryTrade} Artisan</div>
                  <div className="text-[11px] text-slate-500">{currentWorker.societyName}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div className="bg-slate-50 p-2 rounded-lg">
                  <div className="text-[10px] text-slate-500">Aadhaar (UIDAI)</div>
                  <div className="font-mono font-bold text-emerald-700">{currentWorker.maskedAadhaar}</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <div className="text-[10px] text-slate-500">Trust Score</div>
                  <div className="font-bold text-blue-700">{currentWorker.trustScore} / 100</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Standby Duty Order Card View */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs text-center space-y-5 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Radio size={32} className={currentWorker.availability ? 'animate-pulse text-blue-600' : 'text-slate-400'} />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900">
              No Active Work Order Dispatched
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              You are currently registered on the Indore Cooperative Duty Radar. Turn on live availability to receive instant 5 km radius job requests.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2 text-left">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Registered Duty Status:</span>
              <span className={`font-bold px-2 py-0.5 rounded-full ${
                currentWorker.availability ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {currentWorker.availability ? 'ONLINE & READY FOR DISPATCH' : 'OFFLINE / ON BREAK'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Primary Trade:</span>
              <span className="font-bold text-blue-700">{currentWorker.primaryTrade}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Associated Society:</span>
              <span className="font-bold text-slate-800">{currentWorker.societyName}</span>
            </div>
          </div>

          <button
            onClick={onBackToDashboard}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Return to Live Map & Radar
          </button>
        </div>
      )}

      {/* GPS Map & Doorstep Navigation Modal */}
      {isMapModalOpen && displayBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-extrabold uppercase">
                    <Navigation size={12} className="text-blue-600 animate-pulse" />
                    GPS Map & Doorstep Navigation
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Order #{displayBooking.id}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                    displayBooking.status === 'CANCELLED'
                      ? 'bg-rose-100 text-rose-800'
                      : displayBooking.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {displayBooking.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>{displayBooking.serviceName}</span>
                  <span className="text-xs font-normal text-slate-500">• Citizen: {displayBooking.customerName}</span>
                </h3>
                <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-rose-600 shrink-0" />
                    <span>{displayBooking.customerAddress.address}, Indore</span>
                  </span>
                  {displayBooking.customerAddress.landmark && (
                    <span className="text-blue-700 font-medium">
                      Landmark: <strong>{displayBooking.customerAddress.landmark}</strong>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${displayBooking.customerPhone}`}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  <PhoneCall size={12} />
                  <span>Call Citizen</span>
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${displayBooking.customerAddress.lat ?? (displayBooking.customerAddress.address.toLowerCase().includes('navlakha') ? 22.7051 : 22.7533)},${displayBooking.customerAddress.lng ?? (displayBooking.customerAddress.address.toLowerCase().includes('navlakha') ? 75.8752 : 75.8937)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  <ExternalLink size={12} />
                  <span>Google Maps</span>
                </a>
                <button
                  onClick={() => setIsMapModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 transition-colors text-sm font-bold"
                  title="Close Map"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Map Body */}
            <div className="relative flex-1 min-h-[420px] sm:min-h-[500px] w-full">
              <WorkerJobMap
                worker={currentWorker}
                booking={displayBooking}
                allWorkers={[]}
                onSimulateStep={onSimulateStep}
                onWorkerArrived={onWorkerArrived}
                onStartJourney={onStartJourney}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Compass size={14} className="text-blue-600" />
                <span>Live GPS Radar connected to Indore Cooperative Grid</span>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setIsMapModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition-colors"
                >
                  Back to Order Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
