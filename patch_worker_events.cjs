const fs = require('fs');
let code = fs.readFileSync('src/components/worker/WorkerPortal.tsx', 'utf8');

// 1. Add portalTab state
const stateInsertion = `  const [portalTab, setPortalTab] = useState<'DASHBOARD' | 'ORDER_CARD' | 'INCOME_HISTORY'>('DASHBOARD');
  
  // Custom Event Listeners from Header Menu
  React.useEffect(() => {
    const handleProfile = () => setIsProfileModalOpen(true);
    const handleOrderCard = () => setPortalTab('ORDER_CARD');
    const handleIncome = () => setPortalTab('INCOME_HISTORY');
    
    document.addEventListener('OPEN_PROFILE', handleProfile);
    document.addEventListener('OPEN_ORDER_CARD', handleOrderCard);
    document.addEventListener('OPEN_INCOME_HISTORY', handleIncome);
    return () => {
      document.removeEventListener('OPEN_PROFILE', handleProfile);
      document.removeEventListener('OPEN_ORDER_CARD', handleOrderCard);
      document.removeEventListener('OPEN_INCOME_HISTORY', handleIncome);
    };
  }, []);`;

code = code.replace(/const \[isProfileModalOpen, setIsProfileModalOpen\] = useState\(false\);/, "const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);\n" + stateInsertion);

// 2. Wrap the main body in `portalTab === 'DASHBOARD'` and add the other views
const oldMainStart = `<div className="w-full max-w-7xl mx-auto space-y-4">`;
const newMainStart = `<div className="w-full max-w-7xl mx-auto space-y-4">
      
      {portalTab !== 'DASHBOARD' && (
        <button onClick={() => setPortalTab('DASHBOARD')} className="mb-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm flex items-center gap-2">
          ← Back to Dashboard
        </button>
      )}

      {portalTab === 'ORDER_CARD' && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="text-emerald-600" /> Order Card
          </h2>
          <div className="space-y-4">
            {bookings.filter(b => b.workerId === effectiveWorker.id).length === 0 ? (
              <div className="text-center text-slate-500 py-8 bg-slate-50 rounded-xl border border-slate-100">
                You have no orders yet.
              </div>
            ) : (
              bookings.filter(b => b.workerId === effectiveWorker.id).map(b => (
                <div key={b.id} className="p-4 rounded-xl border border-slate-200 hover:shadow-md bg-slate-50 flex justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800">{b.serviceName}</h3>
                    <p className="text-sm text-slate-600 mt-1">Status: {b.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-emerald-700">₹{b.pricing.workerPayout}</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(b.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {portalTab === 'INCOME_HISTORY' && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Wallet className="text-blue-600" /> Income History
          </h2>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-800 font-semibold">Total Earnings</p>
              <h3 className="text-2xl font-black text-blue-900">₹{bookings.filter(b => b.workerId === effectiveWorker.id && b.status === 'COMPLETED').reduce((acc, b) => acc + b.pricing.workerPayout, 0)}</h3>
            </div>
          </div>
          <div className="space-y-3">
             {bookings.filter(b => b.workerId === effectiveWorker.id && b.status === 'COMPLETED').map(b => (
                <div key={b.id} className="p-3 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-slate-800">{b.serviceName}</h3>
                    <p className="text-xs text-slate-400">{new Date(b.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="font-bold text-emerald-600">+₹{b.pricing.workerPayout}</div>
                </div>
              ))}
          </div>
        </section>
      )}

      {portalTab === 'DASHBOARD' && (
        <div className="space-y-4">`;

code = code.replace(oldMainStart, newMainStart);

// Close the DASHBOARD div before the modals
const oldModalsStart = `{/* Email Verification Modal */}`;
const newModalsStart = `        </div>
      )}

      {/* Email Verification Modal */}`;

code = code.replace(oldModalsStart, newModalsStart);

// Add missing lucide icons to import
if (!code.includes('Wallet')) {
  code = code.replace(/} from 'lucide-react';/, ", Wallet, FileText } from 'lucide-react';");
}

fs.writeFileSync('src/components/worker/WorkerPortal.tsx', code);
console.log('Worker portal events patched');
