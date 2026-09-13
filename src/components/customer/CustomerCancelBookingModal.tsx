import React, { useState } from 'react';
import { Booking } from '../../types';
import { SupportedLanguage, getTranslation } from '../../utils/i18n';
import { X, AlertTriangle, ShieldCheck, Clock, Check, Ban } from 'lucide-react';

interface CustomerCancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onConfirmCancel: (bookingId: string, reason: string) => Promise<void> | void;
  lang: SupportedLanguage;
}

const CANCELLATION_REASONS = [
  'Change of plans / Booked by mistake',
  'Found an alternate solution',
  'Need to reschedule for a later time/date',
  'Worker ETA too long / taking too long',
  'Emergency delay at home',
  'Other reason',
];

export const CustomerCancelBookingModal: React.FC<CustomerCancelBookingModalProps> = ({
  isOpen,
  onClose,
  booking,
  onConfirmCancel,
  lang,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(CANCELLATION_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  const t = (key: string, fallback: string) => getTranslation(lang, key, fallback);

  // Calculate elapsed minutes since booking was created/accepted
  const startTime = booking.acceptedAt ? new Date(booking.acceptedAt).getTime() : new Date(booking.createdAt).getTime();
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - startTime) / 60000));
  const isWithinGraceWindow = elapsedMinutes <= 5;

  const handleConfirm = async () => {
    const finalReason = selectedReason === 'Other reason' && customReason.trim()
      ? `Other: ${customReason.trim()}`
      : selectedReason;

    try {
      setIsSubmitting(true);
      await onConfirmCancel(booking.id, finalReason);
      onClose();
    } catch (err) {
      console.error('Error during cancellation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="modal-cancel-booking-backdrop"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div
        id="modal-cancel-booking-card"
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-rose-50 border-b border-rose-100 p-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
              <Ban size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                {t('cancelBookingTitle', 'Cancel Booking')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Booking ID: <span className="font-mono font-semibold text-slate-800">{booking.id}</span>
              </p>
            </div>
          </div>
          <button
            id="btn-close-cancel-modal"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white/60 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Booking Summary Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                {booking.category}
              </span>
              <h3 className="font-black text-slate-900 text-base mt-1.5">{booking.serviceName}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Assigned Artisan:{' '}
                <strong className="text-slate-800 font-semibold">
                  {booking.workerName || 'Allocating artisan...'}
                </strong>
              </p>
              <p className="text-xs text-slate-500">
                Locality: {booking.customerAddress?.locality || 'Indore'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 font-medium">Estimated Amount</p>
              <p className="text-lg font-black text-slate-900">₹{booking.pricing.netPayable}</p>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                100% Refundable
              </span>
            </div>
          </div>

          {/* Indore Cooperative Policy Box */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck size={20} className="text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <span>Cooperative 5-Minute Grace Guarantee</span>
                <span className="bg-emerald-200 text-emerald-900 font-mono text-[10px] px-1.5 py-0.2 rounded font-bold">
                  ₹0 Penalty
                </span>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                Under the Indore Cooperative Society charter, customer cancellations carry{' '}
                <strong>₹0 cancellation penalty</strong>. Our cooperative algorithm instantly redirects nearby trade requests to keep artisans productive.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 pt-0.5">
                <Clock size={13} />
                <span>Elapsed time: ~{elapsedMinutes} min ({isWithinGraceWindow ? 'Within grace window' : 'Standard policy'})</span>
              </div>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              {t('cancellationReasonPrompt', 'Please select a reason for cancellation:')}
            </label>
            <div className="space-y-2">
              {CANCELLATION_REASONS.map((reason) => {
                const isChecked = selectedReason === reason;
                return (
                  <label
                    key={reason}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      isChecked
                        ? 'border-rose-500 bg-rose-50/60 text-rose-950 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="cancellation-reason"
                        checked={isChecked}
                        onChange={() => setSelectedReason(reason)}
                        className="text-rose-600 focus:ring-rose-500 h-4 w-4"
                      />
                      <span>{reason}</span>
                    </div>
                    {isChecked && <Check size={15} className="text-rose-600 shrink-0" />}
                  </label>
                );
              })}
            </div>

            {selectedReason === 'Other reason' && (
              <div className="pt-2 animate-in fade-in duration-150">
                <textarea
                  id="textarea-custom-cancellation-reason"
                  rows={2}
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Describe your reason in brief (optional)..."
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-slate-50 placeholder:text-slate-400"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            id="btn-keep-booking"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
          >
            {t('keepBooking', 'Keep Booking')}
          </button>
          <button
            id="btn-confirm-cancellation"
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-xs transition-all shadow-md shadow-rose-600/30 flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Cancelling Booking...</span>
              </>
            ) : (
              <>
                <Ban size={15} />
                <span>{t('confirmCancellation', 'Confirm Cancellation')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
