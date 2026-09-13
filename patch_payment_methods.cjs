const fs = require('fs');
let code = fs.readFileSync('src/components/customer/CustomerPortal.tsx', 'utf8');

// 1. Add state
code = code.replace(
  "const [paymentBooking, setPaymentBooking] = useState<Booking | null>(null);",
  "const [paymentBooking, setPaymentBooking] = useState<Booking | null>(null);\n  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH'>('UPI');"
);

// 2. Change handler
code = code.replace(
  "body: JSON.stringify({ method: 'UPI' })",
  "body: JSON.stringify({ method: paymentMethod })"
);

// 3. Replace the Modal body UI
const oldUI = `<div className="space-y-3">
                <p className="text-xs text-slate-500 text-center">Select Payment Method</p>
                <div className="grid grid-cols-2 gap-2">
                  <button className="border-2 border-emerald-500 bg-emerald-50 text-emerald-800 font-bold py-2 rounded-xl text-sm flex items-center justify-center gap-2">
                    UPI
                  </button>
                  <button className="border border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold py-2 rounded-xl text-sm opacity-50 cursor-not-allowed">
                    Card
                  </button>
                </div>
              </div>`;

const newUI = `<div className="space-y-3">
                <p className="text-xs text-slate-500 font-semibold mb-2">Select Payment Method</p>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setPaymentMethod('UPI')}
                    className={\`py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all \${paymentMethod === 'UPI' ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}\`}
                  >
                    UPI
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('CREDIT_CARD')}
                    className={\`py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all \${paymentMethod === 'CREDIT_CARD' ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}\`}
                  >
                    Credit Card
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('DEBIT_CARD')}
                    className={\`py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all \${paymentMethod === 'DEBIT_CARD' ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}\`}
                  >
                    Debit Card
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('CASH')}
                    className={\`py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all \${paymentMethod === 'CASH' ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}\`}
                  >
                    Cash
                  </button>
                </div>
              </div>`;

code = code.replace(oldUI, newUI);

// 4. Also update the button text to change based on the method
const oldBtn = `<span>Pay Securely & Send Invoice</span>`;
const newBtn = `<span>{paymentMethod === 'CASH' ? 'Confirm Cash & Send Invoice' : 'Pay Securely & Send Invoice'}</span>`;
code = code.replace(oldBtn, newBtn);

fs.writeFileSync('src/components/customer/CustomerPortal.tsx', code);
console.log('Payment methods patched');
