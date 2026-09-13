import React from 'react';
import { X, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types';
import { EmailVerificationWidget } from './EmailVerificationWidget';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
  currentEmail?: string;
  isVerified?: boolean;
  entityId?: string;
  entityName?: string;
  onVerified?: (email: string) => void;
}

const ROLE_DISPLAY_NAMES: Record<UserRole, { name: string; badge: string; color: string }> = {
  CUSTOMER: {
    name: 'Citizen Customer',
    badge: 'Tax Invoices & Service Receipts',
    color: 'from-blue-700 to-indigo-800',
  },
  WORKER: {
    name: 'Cooperative Craftsman',
    badge: 'Wage Slips & Welfare Fund Alerts',
    color: 'from-amber-700 to-orange-800',
  },
  SOCIETY_ADMIN: {
    name: 'Cooperative Society Registrar',
    badge: 'Dispatch Sheets & Statutory Audit Logs',
    color: 'from-blue-800 to-slate-900',
  },
  FEDERATION_ADMIN: {
    name: 'Apex State Command Officer',
    badge: 'State Grievances & Circulars',
    color: 'from-purple-800 to-indigo-900',
  },
  SUPER_ADMIN: {
    name: 'National Sovereign Authority',
    badge: 'Central Clearances & Gazette Notices',
    color: 'from-slate-900 to-blue-950',
  },
};

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  role,
  currentEmail = '',
  isVerified = false,
  entityId,
  entityName,
  onVerified,
}) => {
  if (!isOpen) return null;

  const roleMeta = ROLE_DISPLAY_NAMES[role] || ROLE_DISPLAY_NAMES.CUSTOMER;

  return (
    <div
      id="email-verification-modal-backdrop"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="email-verification-modal-container"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header Banner */}
        <div className={`bg-gradient-to-r ${roleMeta.color} p-5 sm:p-6 text-white relative`}>
          <button
            id="btn-close-email-modal"
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            title={t('Close_fmgq7', `Close`)}
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs uppercase tracking-wider font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
              {roleMeta.name}
            </span>
            <span className="text-xs font-semibold bg-emerald-500/30 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
              {t('Optional_Feature_f0gvy', `Optional Feature`)}</span>
          </div>

          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Mail size={22} className="text-blue-200" />
            <span>{t('Email_Verification_15fjz', `Email Verification`)}</span>
          </h2>

          <p className="text-xs text-blue-100/90 mt-1 max-w-sm">
            {roleMeta.badge} {t('__Optional_digital_notice_disp_u5duo', `• Optional digital notice dispatch channel for your cooperative account.`)}</p>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <EmailVerificationWidget
            initialEmail={currentEmail}
            isVerified={isVerified}
            role={role}
            entityId={entityId}
            entityName={entityName}
            showBenefits={true}
            onVerificationSuccess={(verifiedEmail) => {
              if (onVerified) onVerified(verifiedEmail);
            }}
          />

          <div className="pt-2 flex justify-end">
            <button
              id="btn-done-email-verification"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              {t('Done___Close_l9tqv', `Done & Close`)}</button>
          </div>
        </div>
      </div>
    </div>
  );
};
