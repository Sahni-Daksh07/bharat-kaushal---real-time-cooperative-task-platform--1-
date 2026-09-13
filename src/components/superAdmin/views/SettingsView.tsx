import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Key,
  Smartphone,
  Server,
  Database,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Scale,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('15');
  const [rateLimiting, setRateLimiting] = useState(true);
  const [encryptionAudit, setEncryptionAudit] = useState(true);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Shield size={16} className="text-blue-600" />
            <span>{t('National_Platform_Security__Cr_tke6h', `National Platform Security, Cryptography & Statutory RBAC Boundaries`)}</span>
          </h2>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
            {t('ISO_27001___CERT_In_Compliant_civwm', `ISO 27001 & CERT-In Compliant`)}</span>
        </div>
        <p className="text-xs text-slate-500">
          {t('Enforces_democratic_cooperativ_42ea3', `Enforces democratic cooperative role isolation: National officials can audit, formulate macroeconomic policies, and set fair rates, but cannot arbitrarily override grassroot local society democratic elections or worker disputes.`)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Controls */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Lock size={16} className="text-slate-700" />
            <span>{t('Cryptographic___Access_Control_ce4e4', `Cryptographic & Access Controls`)}</span>
          </h3>

          <div className="space-y-3 text-xs">
            {/* MFA */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Smartphone size={14} className="text-blue-600" />
                  <span>{t('Mandatory_Aadhaar_TOTP___Hardw_4hmxq', `Mandatory Aadhaar TOTP / Hardware Token MFA`)}</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  {t('Requires_Time_based_One_Time_P_d236d', `Requires Time-based One-Time Password for all Level 4 & 5 Ministry officials.`)}</p>
              </div>
              <button
                onClick={() => setMfaEnabled(!mfaEnabled)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                  mfaEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {mfaEnabled ? 'Active' : 'Disabled'}
              </button>
            </div>

            {/* Session Timeout */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Server size={14} className="text-blue-600" />
                  <span>{t('Statutory_Inactive_Session_Ter_10jb2', `Statutory Inactive Session Termination`)}</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  {t('Automatic_logout_upon_operator_nswk5', `Automatic logout upon operator inactivity to protect government terminals.`)}</p>
              </div>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
              >
                <option value="10">{t('10_Minutes_3qti0', `10 Minutes`)}</option>
                <option value="15">{t('15_Minutes_6pwzx', `15 Minutes`)}</option>
                <option value="30">{t('30_Minutes_bht7c', `30 Minutes`)}</option>
              </select>
            </div>

            {/* Rate Limiting */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Database size={14} className="text-blue-600" />
                  <span>{t('Adaptive_API_Rate_Limiting___D_twdji', `Adaptive API Rate Limiting & DDoS Shield`)}</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  {t('Protects_public_gateway_from_c_jxb7x', `Protects public gateway from credential stuffing and scraper crawlers.`)}</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                {t('Active__Cloudflare___Ingress__t38pa', `Active (Cloudflare + Ingress)`)}</span>
            </div>

            {/* AES-256 Storage */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Key size={14} className="text-blue-600" />
                  <span>{t('AES_256_Encryption_at_Rest___T_lnana', `AES-256 Encryption at Rest & TLS 1.3 in Transit`)}</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  {t('HSM_managed_master_key_rotatio_4f0oh', `HSM-managed master key rotation every 90 days.`)}</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                {t('Hardware_Enclave_Enforced_sgqjq', `Hardware Enclave Enforced`)}</span>
            </div>
          </div>
        </div>

        {/* Statutory Role Isolation Principles */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Scale size={16} className="text-blue-600" />
            <span>{t('Democratic_Role_Isolation___Le_9wiun', `Democratic Role Isolation & Legal Mandates`)}</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 space-y-1">
              <div className="font-bold text-blue-950">{t('1__Separation_of_Powers__5xep2', `1. Separation of Powers:`)}</div>
              <p className="text-blue-800 leading-relaxed">
                {t('Super_Admins_cannot_directly_a_yq18q', `Super Admins cannot directly alter local society peer dispute resolutions or worker disciplinary hearings. Local dispute adjudication remains sovereign to the elected primary society management committee.`)}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">{t('2__National_Appellate_Jurisdic_nly6w', `2. National Appellate Jurisdiction:`)}</div>
              <p className="text-slate-600 leading-relaxed">
                {t('Super_Admins_maintain_statutor_d9qax', `Super Admins maintain statutory authority to review secondary appeals where an artisan claims bias, fraud, or violation of the National Cooperative Byelaws.`)}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">{t('3__Algorithmic_Override_Loggin_6hl4l', `3. Algorithmic Override Logging:`)}</div>
              <p className="text-slate-600 leading-relaxed">
                {t('Any_administrative_override_of_l0ya1', `Any administrative override of the automated dispatch engine, radius parameters, or revenue distribution split requires dual-custody authorization and is logged permanently into the immutable audit ledger.`)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
