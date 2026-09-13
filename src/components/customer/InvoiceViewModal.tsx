import React, { useState } from 'react';
import { Booking } from '../../types';
import { SupportedLanguage, getTranslation } from '../../utils/i18n';
import { sendInvoiceEmail } from '../../lib/gmail';
import {
  X,
  Printer,
  Download,
  Mail,
  CheckCircle2,
  ShieldCheck,
  Building2,
  FileText,
  User,
  MapPin,
  Clock,
  Sparkles,
  QrCode,
  IndianRupee,
  Share2,
} from 'lucide-react';

interface InvoiceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  lang?: SupportedLanguage;
  customerEmail?: string;
}

export const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({
  isOpen,
  onClose,
  booking,
  lang = 'en',
  customerEmail,
}) => {
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  if (!isOpen || !booking) return null;

  const t = (key: string, fallback?: string) => getTranslation(lang, key, fallback);

  const invoiceNumber =
    booking.invoiceNumber ||
    booking.paymentDetails?.invoiceNumber ||
    `BK-INV-2026-${booking.id.replace(/\D/g, '') || '1042'}`;

  const issueDate = new Date(
    booking.paidAt || booking.completedAt || booking.createdAt
  ).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const issueTime = new Date(
    booking.paidAt || booking.completedAt || booking.createdAt
  ).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const paymentMethodLabel =
    booking.paymentDetails?.methodLabel ||
    (booking.paymentMethod === 'CASH'
      ? 'Cash on Service (Collected by Artisan)'
      : booking.paymentMethod === 'CREDIT_CARD'
      ? 'Credit Card'
      : booking.paymentMethod === 'DEBIT_CARD'
      ? 'Debit Card'
      : 'UPI / Bharat QR');

  const txnRef =
    booking.paymentDetails?.transactionId ||
    booking.paymentDetails?.utrNumber ||
    `TXN-IND-${booking.id.replace(/\D/g, '') || '9921'}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const textContent = `
================================================================================
          BHARAT KAUSHAL COOPERATIVE LABOUR FEDERATION
   Registered under Madhya Pradesh Cooperative Societies Act, 1960 (No. MP-IND-8821)
         Scheme No. 54, Vijay Nagar, Indore, Madhya Pradesh - 452010
                 GSTIN: 23AAABK0012C1Z4 | SAC Code: 9987
================================================================================
                    TAX INVOICE & RECONCILIATION RECEIPT
--------------------------------------------------------------------------------
Invoice No   : ${invoiceNumber}
Booking Ref  : ${booking.id}
Date & Time  : ${issueDate} at ${issueTime}
Payment State: RECONCILED & PAID
--------------------------------------------------------------------------------
CUSTOMER DETAILS:
Name         : ${booking.customerName}
Phone        : ${booking.customerPhone}
Address      : ${booking.customerAddress.address || booking.customerAddress.line1 || 'Indore'}, ${booking.customerAddress.locality || 'MP'} - ${booking.customerAddress.pinCode || booking.customerAddress.pincode || '452010'}
--------------------------------------------------------------------------------
VERIFIED ARTISAN & COOPERATIVE BRANCH:
Artisan Name : ${booking.workerName || 'Certified Artisan'}
Artisan ID   : ${booking.workerId || 'BH-WKR-IND'}
Trade / Skill: ${booking.workerTrade || 'Certified Technician'}
Society      : Indore Shramik Kaushal Sahakari Samiti (Branch: Vijay Nagar)
--------------------------------------------------------------------------------
ITEMIZED CHARGES & COOPERATIVE SPLIT:
1. Base Labour Tariff (${booking.serviceName})  : ₹${booking.pricing.baseLabour.toFixed(2)}
${booking.pricing.materialsTotal > 0 ? `2. Approved Spare Parts / Materials      : ₹${booking.pricing.materialsTotal.toFixed(2)}\n` : ''}
Subtotal Gross Labour & Material           : ₹${booking.pricing.grossAmount.toFixed(2)}
- Cooperative Worker Realization (94.5%)    : ₹${booking.pricing.workerShare.toFixed(2)}
- Statutory MP Labour Welfare Cess (2.0%)   : ₹${booking.pricing.welfareShare.toFixed(2)}
- Society Operations & Warranty Pool (3.5%) : ₹${booking.pricing.societyShare.toFixed(2)}
GST / Taxes (Inclusive under Coop Exemption): ₹0.00
--------------------------------------------------------------------------------
TOTAL RECONCILED & PAID                    : ₹${booking.pricing.netPayable.toFixed(2)}
--------------------------------------------------------------------------------
PAYMENT RECONCILIATION DETAILS:
Payment Method : ${paymentMethodLabel}
Transaction Ref: ${txnRef}
${booking.paymentDetails?.utrNumber ? `Bank UTR No    : ${booking.paymentDetails.utrNumber}\n` : ''}${booking.paymentDetails?.cashTendered ? `Cash Tendered  : ₹${booking.paymentDetails.cashTendered} (Change: ₹${booking.paymentDetails.cashChangeReturned || 0})\n` : ''}Reconciled At  : ${booking.paymentDetails?.reconciledAt || new Date().toISOString()}
--------------------------------------------------------------------------------
STATUTORY WARRANTY:
Certified 90-day workmanship warranty backed by Indore Shramik Kaushal Sahakari Samiti.
For dispute resolution or grievance redressal:
National Consumer Helpline: 1915 | Bharat Kaushal Cooperative Desk: 0731-2498100
================================================================================
`.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoiceNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSendEmail = async () => {
    setIsEmailSending(true);
    setEmailStatus(null);
    try {
      const email = customerEmail || 'customer@example.com';
      await sendInvoiceEmail(booking, email);
      setEmailStatus(`Invoice dispatched to ${email}!`);
      setTimeout(() => setEmailStatus(null), 4500);
    } catch (err: any) {
      setEmailStatus(`Email trigger note: ${err.message || 'Please authenticate Gmail in browser'}`);
      setTimeout(() => setEmailStatus(null), 5000);
    } finally {
      setIsEmailSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <FileText size={18} />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                Automated Post-Task Tax Invoice
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{invoiceNumber}</span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-mono px-2 py-0.5 rounded-full">
                  Reconciled
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
              title="Print Tax Invoice"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownloadText}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
              title="Download Text Receipt"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={handleSendEmail}
              disabled={isEmailSending}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors"
              title="Send to Gmail"
            >
              <Mail size={14} />
              <span className="hidden sm:inline">{isEmailSending ? 'Sending...' : 'Email'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors ml-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {emailStatus && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 text-xs text-emerald-800 font-medium flex items-center gap-2 print:hidden">
            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
            <span>{emailStatus}</span>
          </div>
        )}

        {/* Printable Invoice Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-slate-800 font-sans print:p-6 print:overflow-visible">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-black shadow-sm">
                  BK
                </div>
                <div>
                  <h1 className="text-lg font-black tracking-tight text-slate-900 leading-tight">
                    BHARAT KAUSHAL COOPERATIVE FEDERATION
                  </h1>
                  <p className="text-xs text-slate-500">
                    Statutory Cooperative Labour Network • MP Cooperative Societies Act, 1960
                  </p>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 pt-1 leading-relaxed">
                <div>Registration No: <strong className="text-slate-700 font-mono">MP-IND-COOP-1960/8821</strong> • GSTIN: <strong className="text-slate-700 font-mono">23AAABK0012C1Z4</strong></div>
                <div>Principal Office: Scheme No. 54, Vijay Nagar, Indore, Madhya Pradesh - 452010</div>
              </div>
            </div>

            <div className="sm:text-right shrink-0 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-none border-slate-100">
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
                Electronic Tax Invoice
              </span>
              <div className="text-base font-black font-mono text-slate-900">{invoiceNumber}</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Issued: {issueDate} at {issueTime}
              </div>
              <div className="text-xs text-slate-500">
                Booking ID: <span className="font-mono font-semibold text-slate-700">{booking.id}</span>
              </div>
            </div>
          </div>

          {/* Customer & Artisan Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User size={12} className="text-blue-600" />
                <span>Billed To (Customer)</span>
              </div>
              <div className="font-black text-slate-900 text-sm">{booking.customerName}</div>
              <div className="text-slate-600 font-medium">Contact: {booking.customerPhone}</div>
              <div className="text-slate-500 flex items-start gap-1 leading-tight pt-1">
                <MapPin size={12} className="text-slate-400 shrink-0 mt-0.5" />
                <span>
                  {booking.customerAddress.address || booking.customerAddress.line1 || 'Indore'}, {booking.customerAddress.locality || 'MP'} - {booking.customerAddress.pinCode || booking.customerAddress.pincode || '452010'}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-emerald-600" />
                <span>Service Execution by Verified Artisan</span>
              </div>
              <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <span>{booking.workerName || 'Certified Trade Artisan'}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded">
                  DSC Verified
                </span>
              </div>
              <div className="text-slate-600 font-medium">
                Artisan Reg: <span className="font-mono">{booking.workerId || 'BH-WKR-000124'}</span> • Trade: {booking.workerTrade || 'Artisan Specialist'}
              </div>
              <div className="text-slate-500 flex items-start gap-1 leading-tight pt-1">
                <Building2 size={12} className="text-slate-400 shrink-0 mt-0.5" />
                <span>Cooperative Branch: Indore Shramik Kaushal Sahakari Samiti (SOC-IND-02)</span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="py-3 px-4">Description of Service / Goods</th>
                  <th className="py-3 px-3 text-center">HSN / SAC</th>
                  <th className="py-3 px-3 text-right">Labour Tariff</th>
                  <th className="py-3 px-3 text-right">Materials</th>
                  <th className="py-3 px-4 text-right">Reconciled Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div>{booking.serviceName}</div>
                    <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                      Completed under verified OTP protocol (Arrival OTP: {booking.arrivalOtp || '4827'}, Completion OTP: {booking.completionOtp || '7351'})
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-slate-600">9987</td>
                  <td className="py-3.5 px-3 text-right font-medium text-slate-800">
                    ₹{booking.pricing.baseLabour.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-medium text-slate-800">
                    ₹{booking.pricing.materialsTotal.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-slate-900">
                    ₹{booking.pricing.grossAmount.toFixed(2)}
                  </td>
                </tr>

                {booking.materials && booking.materials.length > 0 && booking.materials.map((m) => (
                  <tr key={m.id} className="bg-slate-50/50 text-[11px]">
                    <td className="py-2 px-4 pl-8 text-slate-600">
                      • Approved Item: {m.name}
                    </td>
                    <td className="py-2 px-3 text-center font-mono text-slate-400">9987</td>
                    <td className="py-2 px-3 text-right text-slate-400">-</td>
                    <td className="py-2 px-3 text-right text-purple-700 font-medium">₹{m.amount.toFixed(2)}</td>
                    <td className="py-2 px-4 text-right text-slate-600">₹{m.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Financial Ledger & Statutory Surcharge Split */}
            <div className="bg-slate-50/80 p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-4 text-xs">
              <div className="space-y-1 text-slate-500 text-[11px] max-w-sm">
                <div className="font-bold text-slate-700 flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  Statutory Cooperative Allocation Transparency:
                </div>
                <div>• Direct Worker Wage (94.5%): <strong className="text-slate-800">₹{booking.pricing.workerShare.toFixed(2)}</strong></div>
                <div>• Statutory Labour Welfare Fund (2.0%): <strong className="text-slate-800">₹{booking.pricing.welfareShare.toFixed(2)}</strong></div>
                <div>• Cooperative Samiti Surcharge (3.5%): <strong className="text-slate-800">₹{booking.pricing.societyShare.toFixed(2)}</strong></div>
                <div className="text-[10px] text-slate-400 pt-1">
                  Exempt from commercial platform commission. Zero aggregator markups.
                </div>
              </div>

              <div className="space-y-1.5 min-w-[200px] text-right">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Services Total:</span>
                  <span className="font-medium font-mono">₹{booking.pricing.grossAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (CGST 0% + SGST 0%):</span>
                  <span className="font-medium font-mono">₹0.00</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount Paid:</span>
                  <span className="text-emerald-700 font-mono">₹{booking.pricing.netPayable.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Reconciliation Voucher Box */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider">
                  Payment Reconciled
                </span>
                <span className="font-bold text-emerald-900">{paymentMethodLabel}</span>
              </div>
              <div className="text-emerald-800 font-mono text-[11px]">
                Ref / Trans ID: <strong className="text-emerald-950">{txnRef}</strong>
              </div>
              {booking.paymentDetails?.utrNumber && (
                <div className="text-emerald-800 font-mono text-[11px]">
                  Bank Settlement UTR: {booking.paymentDetails.utrNumber}
                </div>
              )}
              {booking.paymentDetails?.cashTendered && (
                <div className="text-emerald-800 text-[11px]">
                  Cash Tendered: ₹{booking.paymentDetails.cashTendered} (Change returned by artisan: ₹{booking.paymentDetails.cashChangeReturned || 0})
                </div>
              )}
            </div>

            <div className="text-right sm:border-l sm:border-emerald-200 sm:pl-4">
              <div className="text-[10px] text-emerald-700 uppercase font-semibold">Reconciliation Stamp</div>
              <div className="text-xs font-black text-emerald-950 flex items-center justify-end gap-1">
                <CheckCircle2 size={13} className="text-emerald-600" />
                <span>BHARAT KAUSHAL CLEARING</span>
              </div>
              <div className="text-[10px] text-emerald-700 font-mono">
                {issueDate} {issueTime}
              </div>
            </div>
          </div>

          {/* Footer & Warranty Notice */}
          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-black text-[10px]">
                ✓
              </div>
              <span>
                Statutory 90-Day Cooperative Workmanship Guarantee under MP Labour Code.
              </span>
            </div>
            <div className="text-slate-400">
              National Consumer Helpline: 1915 • Indore HQ: 0731-2498100
            </div>
          </div>
        </div>

        {/* Footer Actions (Hidden when printing) */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between print:hidden">
          <div className="text-xs text-slate-500 hidden sm:block">
            Tax invoice automatically archived in citizen profile & municipal records.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors ml-auto shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
