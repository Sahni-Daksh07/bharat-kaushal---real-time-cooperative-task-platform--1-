const fs = require('fs');
let code = fs.readFileSync('src/components/customer/CustomerPortal.tsx', 'utf8');

const modalCode = `
      {/* Payment Modal */}
      {paymentBooking && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-600 p-5 text-center relative">
              <button 
                onClick={() => setPaymentBooking(null)}
                className="absolute top-3 right-3 text-emerald-100 hover:text-white"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold text-white mb-1">Digital Payment</h2>
              <p className="text-emerald-100 text-sm">Secure Checkout</p>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-500">Service</span>
                  <span className="font-semibold text-slate-900">{paymentBooking.serviceName}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-black text-emerald-700">
                  <span>Total Due</span>
                  <span>₹{paymentBooking.pricing.netPayable}</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-500 text-center">Select Payment Method</p>
                <div className="grid grid-cols-2 gap-2">
                  <button className="border-2 border-emerald-500 bg-emerald-50 text-emerald-800 font-bold py-2 rounded-xl text-sm flex items-center justify-center gap-2">
                    UPI
                  </button>
                  <button className="border border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold py-2 rounded-xl text-sm opacity-50 cursor-not-allowed">
                    Card
                  </button>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessingPayment}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isProcessingPayment ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Pay Securely & Send Invoice</span>
                  </>
                )}
              </button>
              
              {needsAuth && (
                <div className="mt-3 text-center">
                  <p className="text-[10px] text-slate-500 mb-2">You will be asked to sign in with Google to email your invoice.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
`;

code = code.replace(
  /\{isBookingModalOpen && selectedService && \(/,
  modalCode + '\n      {isBookingModalOpen && selectedService && ('
);

fs.writeFileSync('src/components/customer/CustomerPortal.tsx', code);
console.log('modal patched');
