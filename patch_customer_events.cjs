const fs = require('fs');
let code = fs.readFileSync('src/components/customer/CustomerPortal.tsx', 'utf8');

// 1. Change portalTab type to include HISTORY
code = code.replace(
  /const \[portalTab, setPortalTab\] = useState\<'SERVICES' \| 'MAP'\>\('SERVICES'\);/,
  "const [portalTab, setPortalTab] = useState<'SERVICES' | 'MAP' | 'HISTORY'>('SERVICES');"
);

// 2. Add event listeners
const effectLogic = `  // Custom Event Listeners from Header Menu
  React.useEffect(() => {
    const handleProfile = () => setIsProfileModalOpen(true);
    const handleHistory = () => setPortalTab('HISTORY');
    
    document.addEventListener('OPEN_PROFILE', handleProfile);
    document.addEventListener('OPEN_HISTORY', handleHistory);
    return () => {
      document.removeEventListener('OPEN_PROFILE', handleProfile);
      document.removeEventListener('OPEN_HISTORY', handleHistory);
    };
  }, []);`;

code = code.replace(/const \[isProfileModalOpen, setIsProfileModalOpen\] = useState\(false\);/, "const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);\n" + effectLogic);

// 3. Add a basic History Tab UI (we will place it after the MAP section or just conditionally render)
const oldMapSection = `{portalTab === 'MAP' && (`;
const historySection = `{portalTab === 'HISTORY' && (
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
      )}
      
      {portalTab === 'MAP' && (`;

code = code.replace(oldMapSection, historySection);

fs.writeFileSync('src/components/customer/CustomerPortal.tsx', code);
console.log('Customer portal events patched');
