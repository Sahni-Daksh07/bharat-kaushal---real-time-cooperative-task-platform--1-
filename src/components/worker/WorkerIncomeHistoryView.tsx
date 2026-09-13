import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Wallet,
  Receipt,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
  Clock,
  ExternalLink,
  Search,
  Filter,
  ShieldCheck,
  Building2,
  CreditCard,
  X,
  FileText,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Booking, WorkerProfile } from '../../types';
import { SupportedLanguage, getTranslation } from '../../utils/i18n';

interface WorkerIncomeHistoryViewProps {
  currentWorker: WorkerProfile;
  bookings: Booking[];
  language: SupportedLanguage;
  policy: {
    activeModel: 'MODEL_A' | 'MODEL_B';
  };
  onBackToDashboard: () => void;
}

interface SettlementRecord {
  id: string;
  bookingId: string;
  date: string;
  timestamp: string;
  serviceName: string;
  customerName: string;
  locality: string;
  grossAmount: number;
  workerShare: number;
  welfareShare: number;
  societyShare: number;
  materialsAmount: number;
  status: 'SETTLED' | 'PROCESSING';
  utrNumber: string;
  paymentMode: string;
}

export const WorkerIncomeHistoryView: React.FC<WorkerIncomeHistoryViewProps> = ({
  currentWorker,
  bookings,
  language,
  policy,
  onBackToDashboard,
}) => {
  const t = (key: string, fallback: string) => getTranslation(language, key, fallback);

  const [timeFilter, setTimeFilter] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SETTLED' | 'PROCESSING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSlip, setSelectedSlip] = useState<SettlementRecord | null>(null);

  // Combine real completed bookings from state with historic ledger data matching worker's stats
  const settlementRecords: SettlementRecord[] = useMemo(() => {
    const list: SettlementRecord[] = [];

    // 1. Real bookings for this worker
    const workerBookings = bookings.filter(
      (b) => b.workerId === currentWorker.id && (b.status === 'COMPLETED' || b.status === 'PAID' || b.status === 'SETTLED')
    );

    workerBookings.forEach((b) => {
      list.push({
        id: `STL-${b.id}`,
        bookingId: b.id,
        date: b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today',
        timestamp: b.createdAt ? new Date(b.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '02:30 PM',
        serviceName: b.serviceName,
        customerName: b.customerName,
        locality: b.customerAddress?.city || 'Indore',
        grossAmount: b.pricing.grossAmount,
        workerShare: b.pricing.workerShare,
        welfareShare: b.pricing.welfareShare,
        societyShare: b.pricing.societyShare,
        materialsAmount: b.pricing.materialsTotal || 0,
        status: 'SETTLED',
        utrNumber: b.paymentDetails?.transactionId || `UPI/20260913/${Math.floor(10000000000 + Math.random() * 90000000000)}`,
        paymentMode: 'Instant NPCI UPI Auto-Credit',
      });
    });

    // 2. Add realistic past settlement records consistent with worker's completedJobs & earnings
    const pastRecords: SettlementRecord[] = [
      {
        id: 'STL-BK-8902',
        bookingId: 'BK-8902',
        date: '12 Sep 2026',
        timestamp: '11:15 AM',
        serviceName: `${currentWorker.primaryTrade} Diagnostic & Maintenance`,
        customerName: 'Anil Mehra',
        locality: 'Vijay Nagar, Indore',
        grossAmount: 650,
        workerShare: 614,
        welfareShare: 13,
        societyShare: 23,
        materialsAmount: 0,
        status: 'SETTLED',
        utrNumber: 'UPI/20260912/77182904123',
        paymentMode: 'Instant NPCI UPI Auto-Credit',
      },
      {
        id: 'STL-BK-8841',
        bookingId: 'BK-8841',
        date: '11 Sep 2026',
        timestamp: '04:45 PM',
        serviceName: `${currentWorker.primaryTrade} Emergency Fault Rectification`,
        customerName: 'Sunita Joshi',
        locality: 'Palasia, Indore',
        grossAmount: 920,
        workerShare: 869,
        welfareShare: 18,
        societyShare: 33,
        materialsAmount: 120,
        status: 'SETTLED',
        utrNumber: 'UPI/20260911/99281720391',
        paymentMode: 'Instant NPCI UPI Auto-Credit',
      },
      {
        id: 'STL-BK-8790',
        bookingId: 'BK-8790',
        date: '09 Sep 2026',
        timestamp: '01:20 PM',
        serviceName: `Standard ${currentWorker.primaryTrade} Installation`,
        customerName: 'Vikram Rajput',
        locality: 'Bhawarkua, Indore',
        grossAmount: 500,
        workerShare: 472,
        welfareShare: 10,
        societyShare: 18,
        materialsAmount: 0,
        status: 'SETTLED',
        utrNumber: 'UPI/20260909/33102948172',
        paymentMode: 'Instant NPCI UPI Auto-Credit',
      },
      {
        id: 'STL-BK-8714',
        bookingId: 'BK-8714',
        date: '07 Sep 2026',
        timestamp: '10:00 AM',
        serviceName: `${currentWorker.primaryTrade} Full System Overhaul`,
        customerName: 'Deepak Agrawal',
        locality: 'Rau, Indore',
        grossAmount: 1400,
        workerShare: 1323,
        welfareShare: 28,
        societyShare: 49,
        materialsAmount: 250,
        status: 'SETTLED',
        utrNumber: 'UPI/20260907/88192049102',
        paymentMode: 'Instant NPCI UPI Auto-Credit',
      },
      {
        id: 'STL-BK-8630',
        bookingId: 'BK-8630',
        date: '04 Sep 2026',
        timestamp: '03:10 PM',
        serviceName: `${currentWorker.primaryTrade} Periodic Safety Check`,
        customerName: 'Priya Malviya',
        locality: 'Rajendra Nagar, Indore',
        grossAmount: 450,
        workerShare: 425,
        welfareShare: 9,
        societyShare: 16,
        materialsAmount: 0,
        status: 'SETTLED',
        utrNumber: 'UPI/20260904/55291048291',
        paymentMode: 'Instant NPCI UPI Auto-Credit',
      },
    ];

    return [...list, ...pastRecords];
  }, [bookings, currentWorker]);

  // Filtering
  const filteredRecords = useMemo(() => {
    return settlementRecords.filter((rec) => {
      // Time filter
      if (timeFilter === 'TODAY' && rec.date !== 'Today' && !rec.date.includes('13 Sep')) {
        return false;
      }
      if (timeFilter === 'WEEK' && !rec.date.includes('Sep 2026')) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'ALL' && rec.status !== statusFilter) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = rec.serviceName.toLowerCase().includes(query);
        const matchesCustomer = rec.customerName.toLowerCase().includes(query);
        const matchesId = rec.bookingId.toLowerCase().includes(query) || rec.id.toLowerCase().includes(query);
        const matchesUtr = rec.utrNumber.toLowerCase().includes(query);
        if (!matchesName && !matchesCustomer && !matchesId && !matchesUtr) return false;
      }
      return true;
    });
  }, [settlementRecords, timeFilter, statusFilter, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200 dashboard-container" data-dashboard-container="true">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4 dashboard-card" data-dashboard-card="true">
        <div className="flex items-center gap-3">
          <button
            id="btn-income-history-back"
            onClick={onBackToDashboard}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors shadow-2xs"
            title="Return to Worker Dashboard"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                <ShieldCheck size={12} />
                Cooperative Passbook
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-mono">
                WORKER ID: {currentWorker.id}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 flex items-center gap-2">
              <span>Artisan Income History & UPI Settlements</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors border border-slate-200"
            title="Print Official Statement"
          >
            <Printer size={15} />
            <span className="hidden sm:inline">Print Statement</span>
          </button>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Live Radar</span>
          </button>
        </div>
      </div>

      {/* 5-Metric Earnings Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Today */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Today's Net Take-Home
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
            ₹{currentWorker.earnings?.today ?? 680}
          </div>
          <div className="text-[10px] text-emerald-800 mt-1 font-semibold flex items-center gap-1">
            <CheckCircle2 size={11} />
            <span>94.5% Direct UPI Credit</span>
          </div>
        </div>

        {/* Card 2: This Week */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            This Week's Net
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            ₹{(currentWorker.earnings?.thisWeek ?? 4250).toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            7 Days Disbursed
          </div>
        </div>

        {/* Card 3: This Month */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Current Month (Sep)
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-700 mt-1">
            ₹{(currentWorker.earnings?.thisMonth ?? 18450).toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Cooperative Cycle
          </div>
        </div>

        {/* Card 4: Lifetime Disbursed */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Lifetime Disbursed
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            ₹{(currentWorker.earnings?.total ?? 142800).toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {currentWorker.completedJobs} Verified Jobs
          </div>
        </div>

        {/* Card 5: Labour Welfare Fund */}
        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl border border-amber-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center justify-between">
            <span>MPSLWB Welfare (2%)</span>
            <ShieldCheck size={14} className="text-amber-700" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-800 mt-1">
            ₹{(currentWorker.welfareBalance ?? 1240).toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-amber-800/90 mt-1 font-medium">
            Social Security Passbook
          </div>
        </div>
      </div>

      {/* UPI Account & Direct Settlement Notice */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CreditCard size={20} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">
              Registered Direct Payout Route
            </div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>{currentWorker.paymentSetup?.upiId || `${currentWorker.name.toLowerCase().replace(/\s+/g, '')}@upi`}</span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full flex items-center gap-0.5">
                <CheckCircle2 size={10} /> VERIFIED
              </span>
            </div>
            <div className="text-xs text-slate-500">
              Bank A/C: <span className="font-mono">{currentWorker.paymentSetup?.bankAccount || '••••••••5492'}</span> • IFSC: <span className="font-mono">{currentWorker.paymentSetup?.ifsc || 'SBIN0001245'}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-600 max-w-sm">
          <div className="font-bold text-slate-800 mb-0.5 flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-600" />
            <span>Instant T+0 Direct Settlement</span>
          </div>
          <span>Payouts trigger immediately when the citizen enters the 4-digit Completion OTP. Zero middlemen, zero hidden deductions.</span>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Time Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setTimeFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeFilter === 'ALL' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setTimeFilter('TODAY')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeFilter === 'TODAY' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeFilter('WEEK')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeFilter === 'WEEK' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeFilter('MONTH')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeFilter === 'MONTH' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              This Month
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by job ID, service, or UTR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Transaction Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Receipt size={16} className="text-blue-600" />
            <span>Cooperative Settlement Ledger ({filteredRecords.length} Transactions)</span>
          </h2>
          <span className="text-xs text-slate-500">
            Model: <strong className="text-blue-700">94.5% Artisan Net Take-Home</strong>
          </span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="p-10 text-center text-slate-500 space-y-2">
            <Receipt size={32} className="mx-auto text-slate-300" />
            <div className="font-bold text-slate-700">No Settlement Records Found</div>
            <div className="text-xs">Adjust your search or filter criteria to see past payouts.</div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Job & Customer Details */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {record.bookingId}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                      <Calendar size={12} />
                      {record.date} at {record.timestamp}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={10} /> SETTLED
                    </span>
                  </div>

                  <div className="font-bold text-slate-900 text-sm sm:text-base">
                    {record.serviceName}
                  </div>

                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                    <span>Citizen: <strong className="text-slate-700">{record.customerName}</strong></span>
                    <span>•</span>
                    <span>Locality: {record.locality}</span>
                    <span>•</span>
                    <span className="font-mono text-[11px] text-slate-400">UTR: {record.utrNumber}</span>
                  </div>
                </div>

                {/* Middle: Split Breakdown */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-xs flex items-center gap-4 shrink-0">
                  <div>
                    <div className="text-[10px] text-slate-500">Gross Bill</div>
                    <div className="font-bold text-slate-700">₹{record.grossAmount}</div>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div>
                    <div className="text-[10px] text-amber-800">Welfare (2%)</div>
                    <div className="font-bold text-amber-700">₹{record.welfareShare}</div>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div>
                    <div className="text-[10px] text-slate-500">Coop Ops</div>
                    <div className="font-bold text-slate-700">₹{record.societyShare}</div>
                  </div>
                </div>

                {/* Right: Net Credited & Action */}
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      Credited via UPI
                    </div>
                    <div className="text-xl font-black text-emerald-700">
                      ₹{record.workerShare}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedSlip(record)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>Voucher</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settlement Voucher Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Receipt size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Cooperative Settlement Voucher</h3>
                  <p className="text-[11px] text-slate-500 font-mono">ID: {selectedSlip.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSlip(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            {/* Slip Details */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Job Reference:</span>
                <span className="font-mono font-bold text-slate-900">{selectedSlip.bookingId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Service Executed:</span>
                <span className="font-bold text-slate-900">{selectedSlip.serviceName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Citizen:</span>
                <span className="text-slate-800">{selectedSlip.customerName} ({selectedSlip.locality})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Settlement Date:</span>
                <span className="text-slate-800">{selectedSlip.date} at {selectedSlip.timestamp}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Transaction UTR:</span>
                <span className="font-mono text-blue-700 font-semibold">{selectedSlip.utrNumber}</span>
              </div>
            </div>

            {/* Split Distribution */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1">
                Settlement Math
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Customer Gross Billed:</span>
                <span className="font-bold">₹{selectedSlip.grossAmount}</span>
              </div>
              <div className="flex justify-between text-amber-800">
                <span>MP Labour Welfare Board (2% MPSLWB):</span>
                <span>- ₹{selectedSlip.welfareShare}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Cooperative Operational Tech Charge (3.5%):</span>
                <span>- ₹{selectedSlip.societyShare}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-bold text-sm text-emerald-800">
                <span>Direct Artisan Bank/UPI Credit (94.5%):</span>
                <span className="text-base font-black">₹{selectedSlip.workerShare}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer size={14} />
                <span>Print Voucher</span>
              </button>
              <button
                onClick={() => setSelectedSlip(null)}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
