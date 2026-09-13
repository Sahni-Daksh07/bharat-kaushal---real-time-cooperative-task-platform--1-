import React, { useState } from 'react';
import { useRealtime } from '../../context/RealtimeContext';
import { useAuth } from '../../context/AuthContext';
import { SupportedLanguage } from '../../utils/i18n';
import { EmailVerificationModal } from '../common/EmailVerificationModal';
import {
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  FileCheck,
  Scale,
  MessageSquare,
  Clock,
  Send,
  HelpCircle,
  ShieldCheck,
  FileKey,
  LogIn,
  KeyRound,
  Mail,
} from 'lucide-react';

interface SocietyAdminPortalProps {
  lang?: SupportedLanguage;
}

export const SocietyAdminPortal: React.FC<SocietyAdminPortalProps> = ({ lang: _lang }) => {
  const {
    workers,
    appeals,
    complaints,
    adminVerifyWorker,
    decideAppeal,
    resolveComplaint,
  } = useRealtime();

  const {
    societyAdminUser,
    isSocietyAdminAuthenticated,
    openAuthModal,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'VERIFICATION' | 'APPEALS' | 'GRIEVANCES' | 'ROSTER'>('VERIFICATION');
  const [rejectingWorkerId, setRejectingWorkerId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Document clarity issue. Please re-upload legible Aadhaar copy.');
  const [resolvingTicketId, setResolvingTicketId] = useState<string | null>(null);
  const [ticketResponse, setTicketResponse] = useState('');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const pendingWorkers = workers.filter((w) => w.verificationStatus === 'UNDER_REVIEW');
  const pendingAppeals = appeals.filter((a) => a.status === 'PENDING');
  const openComplaints = complaints.filter((c) => c.status !== 'RESOLVED');

  const handleApproveWorker = async (workerId: string) => {
    await adminVerifyWorker(workerId, 'APPROVE');
  };

  const handleRejectWorker = async () => {
    if (!rejectingWorkerId) return;
    await adminVerifyWorker(rejectingWorkerId, 'REJECT', rejectionReason);
    setRejectingWorkerId(null);
  };

  const handleResolveTicket = async () => {
    if (!resolvingTicketId || !ticketResponse) return;
    await resolveComplaint(resolvingTicketId, ticketResponse);
    setResolvingTicketId(null);
    setTicketResponse('');
  };

  return (
    <div className="space-y-6 dashboard-container" data-dashboard-container="true">
      {/* Society Header */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 dashboard-card" data-dashboard-card="true">
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-700 text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
            <Building2 size={28} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">
                {societyAdminUser?.societyName || 'Indore Shramik Kaushal Sahakari Samiti'}
              </h1>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded font-mono">
                {societyAdminUser?.societyId || 'SOC-IND-02'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {t('Registered_Cooperative_Society_qs8jw', `Registered Cooperative Society Under MP Cooperative Societies Act, 1960 • Statutory Branch Operations`)}</p>
            <div className="flex items-center gap-3 mt-2 text-xs flex-wrap">
              <span className="font-semibold text-slate-800">
                {t('Officer_In_Charge__oq66z', `Officer In-Charge:`)}{societyAdminUser?.name || 'Smt. Rekha Malviya'}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 font-medium">
                {societyAdminUser?.designation || 'Compliance Registrar'}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck size={12} /> {t('DSC_Active_nissc', `DSC Active`)}</span>
              <span className="text-slate-400">•</span>
              {/* Email Verification Status Pill */}
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(true)}
                className={`font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-all border text-[11px] ${
                  societyAdminUser?.emailVerified
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                }`}
                title={t('Manage_Officer_Official_Email__7gtav', `Manage Officer Official Email (Optional)`)}
              >
                <Mail size={12} />
                <span>
                  {societyAdminUser?.emailVerified
                    ? `✓ ${societyAdminUser?.email || 'Verified'}`
                    : societyAdminUser?.email
                    ? `Verify ${societyAdminUser?.email}`
                    : '+ Add Email (Optional)'}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0 mt-3 md:mt-0">
          <button
            type="button"
            onClick={() => setIsEmailModalOpen(true)}
            className="flex-1 sm:flex-initial h-9 px-3.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-1.5 transition-all whitespace-nowrap"
          >
            <Mail size={14} className="text-blue-600 shrink-0" />
            <span>{t('Email_Settings_4kyfj', `Email Settings`)}</span>
          </button>

          <button
            id="btn-society-portal-auth-trigger"
            onClick={() => openAuthModal('SOCIETY_ADMIN')}
            className={`flex-1 sm:flex-initial h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs border whitespace-nowrap ${
              isSocietyAdminAuthenticated
                ? 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100'
                : 'bg-blue-700 hover:bg-blue-800 text-white border-blue-800'
            }`}
          >
            <KeyRound size={14} className="shrink-0" />
            <span>{isSocietyAdminAuthenticated ? 'Officer Session (Active)' : 'Officer Staff Login'}</span>
          </button>
        </div>
      </section>

      {/* Quick Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl text-xs font-semibold overflow-x-auto no-scrollbar scroll-smooth dashboard-card" data-dashboard-card="true">
          <button
            onClick={() => setActiveTab('VERIFICATION')}
            className={`shrink-0 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'VERIFICATION' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileCheck size={14} className="shrink-0" />
            <span>{t('KYC_Verification___fn5ej', `KYC Verification (`)}{pendingWorkers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('APPEALS')}
            className={`shrink-0 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'APPEALS' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Scale size={14} className="shrink-0" />
            <span>{t('Penalty_Appeals___hcui7', `Penalty Appeals (`)}{pendingAppeals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('GRIEVANCES')}
            className={`shrink-0 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'GRIEVANCES' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <MessageSquare size={14} className="shrink-0" />
            <span>{t('Disputes___38mxw', `Disputes (`)}{openComplaints.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ROSTER')}
            className={`shrink-0 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ROSTER' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users size={14} className="shrink-0" />
            <span>{t('Roster___3mb4r', `Roster (`)}{workers.length})</span>
          </button>
        </div>

      {/* Tab Content */}
      {activeTab === 'VERIFICATION' && (
        <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4 dashboard-card" data-dashboard-card="true">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t('Worker_KYC___Trade_Assessment__8rglc', `Worker KYC & Trade Assessment Verification Queue`)}</h2>
              <p className="text-xs text-slate-500">
                {t('Verify_identity__police_verifi_dn2r9', `Verify identity, police verification clearance, and technical skill scores before enabling dispatch availability.`)}</p>
            </div>
            <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold">
              {pendingWorkers.length} {t('Awaiting_Society_Approval_20kry', `Awaiting Society Approval`)}</span>
          </div>

          {pendingWorkers.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              {t('All_worker_registrations_have__ely6e', `All worker registrations have been verified. No pending items in queue.`)}</div>
          ) : (
            <div className="divide-y divide-slate-100 space-y-4">
              {pendingWorkers.map((worker) => (
                <div key={worker.id} className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{worker.name}</span>
                      <span className="font-mono text-[11px] text-slate-500">({worker.id})</span>
                      <span className="bg-blue-100 text-blue-800 font-medium px-2 py-0.5 rounded">
                        {worker.primaryTrade}
                      </span>
                    </div>

                    <div className="text-slate-600 flex flex-wrap items-center gap-3">
                      <span>{t('Phone__lbgdl', `Phone:`)}<strong className="font-mono">{worker.phone}</strong></span>
                      <span>•</span>
                      <span>{t('Indore_Address__k25vw', `Indore Address:`)}<strong>{worker.address}</strong></span>
                      <span>•</span>
                      <span>{t('Skill_Quiz__jzcut', `Skill Quiz:`)}<strong className="text-emerald-700">{worker.skillAssessmentScore}{t('____w5q99', `% (`)}{worker.skillLevel})</strong></span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-3">
                      <span>{t('Masked_Aadhaar__d0ma1', `Masked Aadhaar:`)}<strong className="font-mono">{worker.maskedAadhaar}</strong></span>
                      <span>{t('Masked_PAN__1wo74', `Masked PAN:`)}<strong className="font-mono">{worker.maskedPan}</strong></span>
                      <span>{t('UPI__5fd02', `UPI:`)}<strong className="font-mono">{worker.paymentSetup.upiId}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleApproveWorker(worker.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={14} />
                      <span>{t('Approve___Certify_7px69', `Approve & Certify`)}</span>
                    </button>

                    <button
                      onClick={() => setRejectingWorkerId(worker.id)}
                      className="px-3 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <XCircle size={14} />
                      <span>{t('Reject_a8yms', `Reject`)}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Tab: Penalty Appeals Tribunal */}
      {activeTab === 'APPEALS' && (
        <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4 dashboard-card" data-dashboard-card="true">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t('Worker_Penalty_Appeals_Tribuna_ylr7n', `Worker Penalty Appeals Tribunal`)}</h2>
              <p className="text-xs text-slate-500">
                {t('Review__20_unexcused_cancellat_5zkh0', `Review ₹20 unexcused cancellation appeals. Approved emergencies automatically reverse penalties and restore worker reliability scores.`)}</p>
            </div>
          </div>

          {appeals.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              {t('No_penalty_appeals_submitted_y_rdgqa', `No penalty appeals submitted yet. (Trigger one by cancelling a worker job after 5 minutes and submitting an appeal in the Worker tab).`)}</div>
          ) : (
            <div className="divide-y divide-slate-100 space-y-4">
              {appeals.map((appeal) => (
                <div key={appeal.id} className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{appeal.workerName}</span>
                      <span className="font-mono text-[11px] text-slate-500">({appeal.workerId})</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        appeal.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : appeal.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {appeal.status}
                      </span>
                    </div>

                    <div className="text-slate-700 font-medium">
                      {t('Penalty_Contested__tzlh4', `Penalty Contested:`)}<strong>₹{appeal.penaltyAmount}</strong> {t('__Booking_Ref__an4ha', `• Booking Ref:`)}{appeal.bookingId}
                    </div>

                    <div className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      {t('Reason___hhc6w', `Reason (`)}{appeal.category}{t('____ldquo__253nj', `): &ldquo;`)}{appeal.reason}{t('_rdquo__qs5ri', `&rdquo;`)}</div>

                    {appeal.adminRemarks && (
                      <div className="text-[11px] text-blue-800 font-medium">
                        {t('Admin_Remarks__gpn3s', `Admin Remarks:`)}{appeal.adminRemarks}
                      </div>
                    )}
                  </div>

                  {appeal.status === 'PENDING' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => decideAppeal(appeal.id, 'APPROVE', 'Verified authentic mechanical breakdown on route.')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                      >
                        {t('Approve_Exemption___Reverse___768o9', `Approve Exemption & Reverse ₹`)}{appeal.penaltyAmount}
                      </button>
                      <button
                        onClick={() => decideAppeal(appeal.id, 'REJECT', 'Insufficient breakdown proof.')}
                        className="px-3 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                      >
                        {t('Reject_cc2vj', `Reject`)}</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Tab: Grievances & Disputes */}
      {activeTab === 'GRIEVANCES' && (
        <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4 dashboard-card" data-dashboard-card="true">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t('Customer___Labour_Grievance_Re_9oe9h', `Customer & Labour Grievance Redressal`)}</h2>
              <p className="text-xs text-slate-500">
                {t('Mandatory_resolution_under_Ind_ujdkj', `Mandatory resolution under Indore Municipal Cooperative by-laws. Escalation integrated with National Consumer Helpline (1915).`)}</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 space-y-4">
            {complaints.map((ticket) => (
              <div key={ticket.id} className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{ticket.category}</span>
                    <span className="font-mono text-[11px] text-slate-500">({ticket.id})</span>
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      ticket.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>

                  <div className="text-slate-600">
                    {t('Logged_by__w1l0i', `Logged by:`)}<strong>{ticket.userName}</strong> ({ticket.userType}{t('____Booking__f6dhp', `) • Booking:`)}{ticket.bookingId}
                  </div>

                  <div className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    {t('_ldquo__c8zwj', `&ldquo;`)}{ticket.description}{t('_rdquo__2uwaa', `&rdquo;`)}</div>

                  {ticket.adminResponse && (
                    <div className="text-emerald-800 font-medium text-[11px] bg-emerald-50 p-2 rounded border border-emerald-200">
                      {t('Response__0fzsf', `Response:`)}{ticket.adminResponse}
                    </div>
                  )}
                </div>

                {ticket.status !== 'RESOLVED' && (
                  <button
                    onClick={() => {
                      setResolvingTicketId(ticket.id);
                      setTicketResponse('Inquiry clarified. 90-day cooperative workmanship warranty applies to certified parts.');
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
                  >
                    {t('Respond___Resolve_sged5', `Respond & Resolve`)}</button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab: Member Roster */}
      {activeTab === 'ROSTER' && (
        <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4 dashboard-card" data-dashboard-card="true">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              {t('Active_Member_Workers_Roster___5xfqk', `Active Member Workers Roster (`)}{workers.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="pb-2">{t('Worker_ID_403z8', `Worker ID`)}</th>
                  <th className="pb-2">{t('Name___Trade_brlwa', `Name & Trade`)}</th>
                  <th className="pb-2">{t('Trust_Score_x4s6u', `Trust Score`)}</th>
                  <th className="pb-2">{t('Reliability_vkxbq', `Reliability`)}</th>
                  <th className="pb-2">{t('Jobs_Completed_i11x8', `Jobs Completed`)}</th>
                  <th className="pb-2">{t('Status_gc4ui', `Status`)}</th>
                  <th className="pb-2">{t('Availability_4t0mg', `Availability`)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workers.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50">
                    <td className="py-2.5 font-mono text-slate-500">{w.id}</td>
                    <td className="py-2.5">
                      <div className="font-bold text-slate-900">{w.name}</div>
                      <div className="text-[11px] text-slate-500">{w.primaryTrade}</div>
                    </td>
                    <td className="py-2.5 font-bold text-blue-700">{w.trustScore}{t('_100_ya1ck', `/100`)}</td>
                    <td className="py-2.5 font-semibold text-emerald-700">{w.reliabilityScore}%</td>
                    <td className="py-2.5">{w.completedJobs}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        w.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {w.verificationStatus}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className={`w-2 h-2 inline-block rounded-full mr-1.5 ${w.availability ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      <span>{w.availability ? 'Online' : 'Offline'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Reject Modal */}
      {rejectingWorkerId && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              {t('Reject_Worker_Verification_263cb', `Reject Worker Verification`)}</h3>
            <p className="text-xs text-slate-500">
              {t('Specify_the_reason_so_the_work_2uxrg', `Specify the reason so the worker can correct their documents or re-attempt assessment.`)}</p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingWorkerId(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
              >
                {t('Cancel_o5ceo', `Cancel`)}</button>
              <button
                onClick={handleRejectWorker}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
              >
                {t('Confirm_Rejection_kgzii', `Confirm Rejection`)}</button>
            </div>
          </div>
        </div>
      )}

      {/* Grievance Resolution Modal */}
      {resolvingTicketId && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              {t('Resolve_Support_Ticket_ny7k1', `Resolve Support Ticket`)}{resolvingTicketId}
            </h3>
            <textarea
              rows={3}
              value={ticketResponse}
              onChange={(e) => setTicketResponse(e.target.value)}
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setResolvingTicketId(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
              >
                {t('Cancel_tgtpf', `Cancel`)}</button>
              <button
                onClick={handleResolveTicket}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                {t('Publish_Resolution_axn7n', `Publish Resolution`)}</button>
            </div>
          </div>
        </div>
      )}

      {/* Optional Email Verification Modal for Society Admin */}
      {societyAdminUser && (
        <EmailVerificationModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          role="SOCIETY_ADMIN"
          currentEmail={societyAdminUser.email || ''}
          isVerified={!!societyAdminUser.emailVerified}
          entityId={societyAdminUser.id}
          entityName={societyAdminUser.name}
        />
      )}
    </div>
  );
};
