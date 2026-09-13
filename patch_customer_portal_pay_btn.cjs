const fs = require('fs');
let code = fs.readFileSync('src/components/customer/CustomerPortal.tsx', 'utf8');

code = code.replace(
  /\{\['PAID', 'SETTLED', 'COMPLETION_OTP_VERIFIED'\]\.includes\(activeBooking\.status\) && !activeBooking\.rating && \(/,
  "{activeBooking.status === 'PAYMENT_PENDING' && (\n                  <button\n                    onClick={() => setPaymentBooking(activeBooking)}\n                    className=\"w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5\"\n                  >\n                    <CheckCircle2 size={14} />\n                    <span>Pay ₹{activeBooking.pricing.netPayable} & Get Invoice</span>\n                  </button>\n                )}\n                {['PAID', 'SETTLED', 'COMPLETION_OTP_VERIFIED', 'COMPLETED'].includes(activeBooking.status) && !activeBooking.rating && ("
);

fs.writeFileSync('src/components/customer/CustomerPortal.tsx', code);
console.log('button patched');
