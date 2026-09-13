const fs = require('fs');
let code = fs.readFileSync('src/components/customer/CustomerPortal.tsx', 'utf8');

const targetSection = `{portalTab === 'HISTORY' && (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <History className="text-blue-600" /> Booking History
          </h2>
          <div className="space-y-4">
            {bookings.filter(b => b.customerId === effectiveCustomer.id).length === 0 ? (
              <div className="text-center text-slate-500 py-8 bg-slate-50 rounded-xl border border-slate-100">
                You have no past bookings.
              </div>
            ) : (
              bookings.filter(b => b.customerId === effectiveCustomer.id).map(b => (
                <div key={b.id} className="p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between gap-4 bg-slate-50">
                  <div>
                    <h3 className="font-bold text-slate-800">{b.serviceName}</h3>
                    <p className="text-xs text-slate-500 mt-1">Booking ID: {b.id}</p>
                    <p className="text-sm font-semibold text-slate-700 mt-2">Status: {b.status}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-black text-emerald-700">₹{b.pricing.netPayable}</p>
                    <p className="text-xs text-slate-500 mt-1">{new Date(b.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}`;

const replacementSection = `{portalTab === 'HISTORY' && (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <History size={22} className="text-blue-600" /> 
              {t('bookingHistory', 'Booking History & Invoices')}
            </h2>
            <button onClick={() => setPortalTab('SERVICES')} className="text-sm font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">
              Close
            </button>
          </div>
          
          <div className="space-y-4">
            {bookings.filter(b => b.customerId === effectiveCustomer.id).length === 0 ? (
              <div className="text-center text-slate-500 py-12 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                <History size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="font-semibold text-slate-600">No Booking History Found</p>
                <p className="text-sm">Your past and current bookings will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.filter(b => b.customerId === effectiveCustomer.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(b => (
                  <div key={b.id} className="p-5 rounded-2xl border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between gap-4 bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={\`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                            \${b.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 
                              b.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800' :
                              'bg-blue-100 text-blue-800'}\`}
                          >
                            {b.status.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {b.id.substring(0,8)}</span>
                        </div>
                        <h3 className="font-black text-slate-800 text-lg leading-tight">{b.serviceName}</h3>
                        {b.workerId && <p className="text-xs text-slate-500 mt-1 font-medium">Assigned Worker ID: {b.workerId.substring(0,6)}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900 text-lg">₹{b.pricing.netPayable}</p>
                      </div>
                    </div>
                    
                    <div className="pt-3 mt-1 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs text-slate-500 font-medium">
                        {new Date(b.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} at {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {b.status === 'COMPLETED' && (
                        <button className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                           Receipt
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}`;

code = code.replace(targetSection, replacementSection);

fs.writeFileSync('src/components/customer/CustomerPortal.tsx', code);
console.log('History UI upgraded');
