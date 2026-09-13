const fs = require('fs');
let code = fs.readFileSync('src/components/common/Header.tsx', 'utf8');

const targetDropdown = `{currentRole === 'CUSTOMER' && (
                  <>
                    <button className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left">
                      <User size={16} className="text-slate-500" />
                      <span className="font-medium">Profile</span>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left">
                      <History size={16} className="text-slate-500" />
                      <span className="font-medium">Booking History</span>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left">
                      <Globe size={16} className="text-slate-500" />
                      <span className="font-medium">Language</span>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left text-rose-600">
                      <LogOut size={16} className="text-rose-500" />
                      <span className="font-medium">Logging Out</span>
                    </button>
                    <div className="h-px bg-slate-100 my-1 mx-2"></div>
                    <button className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left">
                      <LifeBuoy size={16} className="text-slate-500" />
                      <span className="font-medium">Support</span>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left">
                      <Headphones size={16} className="text-slate-500" />
                      <span className="font-medium">Customer Care</span>
                    </button>
                  </>
                )}
                {currentRole === 'WORKER' && (
                  <>
                    <button className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left">
                      <User size={16} className="text-slate-500" />
                      <span className="font-medium">Profile</span>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left">
                      <FileText size={16} className="text-slate-500" />
                      <span className="font-medium">Order Card</span>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left">
                      <Globe size={16} className="text-slate-500" />
                      <span className="font-medium">Language</span>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left">
                      <Wallet size={16} className="text-slate-500" />
                      <span className="font-medium">Income History</span>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left text-rose-600">
                      <LogOut size={16} className="text-rose-500" />
                      <span className="font-medium">Logging Out</span>
                    </button>
                    <div className="h-px bg-slate-100 my-1 mx-2"></div>
                    <button className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left">
                      <LifeBuoy size={16} className="text-slate-500" />
                      <span className="font-medium">Support</span>
                    </button>
                  </>
                )}`;

const newDropdown = `{currentRole === 'CUSTOMER' && (
                  <>
                    <button onClick={() => { setIsToggleMenuOpen(false); document.dispatchEvent(new CustomEvent('OPEN_PROFILE')); }} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left">
                      <User size={16} className="text-slate-500" />
                      <span className="font-medium">Profile</span>
                    </button>
                    <button onClick={() => { setIsToggleMenuOpen(false); document.dispatchEvent(new CustomEvent('OPEN_HISTORY')); }} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left">
                      <History size={16} className="text-slate-500" />
                      <span className="font-medium">Booking History</span>
                    </button>
                    <button onClick={() => { setIsToggleMenuOpen(false); document.dispatchEvent(new CustomEvent('CYCLE_LANGUAGE')); }} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left">
                      <Globe size={16} className="text-slate-500" />
                      <span className="font-medium">Language: {lang.toUpperCase()}</span>
                    </button>
                    <button onClick={() => { setIsToggleMenuOpen(false); logoutCustomer(); }} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left text-rose-600">
                      <LogOut size={16} className="text-rose-500" />
                      <span className="font-medium">Logging Out</span>
                    </button>
                    <div className="h-px bg-slate-100 my-1 mx-2"></div>
                    <button onClick={() => { setIsToggleMenuOpen(false); document.dispatchEvent(new CustomEvent('OPEN_SUPPORT')); }} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left">
                      <LifeBuoy size={16} className="text-slate-500" />
                      <span className="font-medium">Support</span>
                    </button>
                    <button onClick={() => { setIsToggleMenuOpen(false); document.dispatchEvent(new CustomEvent('OPEN_SUPPORT')); }} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left">
                      <Headphones size={16} className="text-slate-500" />
                      <span className="font-medium">Customer Care</span>
                    </button>
                  </>
                )}
                {currentRole === 'WORKER' && (
                  <>
                    <button onClick={() => { setIsToggleMenuOpen(false); document.dispatchEvent(new CustomEvent('OPEN_PROFILE')); }} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left">
                      <User size={16} className="text-slate-500" />
                      <span className="font-medium">Profile</span>
                    </button>
                    <button onClick={() => { setIsToggleMenuOpen(false); document.dispatchEvent(new CustomEvent('OPEN_ORDER_CARD')); }} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left">
                      <FileText size={16} className="text-slate-500" />
                      <span className="font-medium">Order Card</span>
                    </button>
                    <button onClick={() => { setIsToggleMenuOpen(false); document.dispatchEvent(new CustomEvent('CYCLE_LANGUAGE')); }} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left">
                      <Globe size={16} className="text-slate-500" />
                      <span className="font-medium">Language: {lang.toUpperCase()}</span>
                    </button>
                    <button onClick={() => { setIsToggleMenuOpen(false); document.dispatchEvent(new CustomEvent('OPEN_INCOME_HISTORY')); }} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left">
                      <Wallet size={16} className="text-slate-500" />
                      <span className="font-medium">Income History</span>
                    </button>
                    <button onClick={() => { setIsToggleMenuOpen(false); logoutWorker(); }} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left text-rose-600">
                      <LogOut size={16} className="text-rose-500" />
                      <span className="font-medium">Logging Out</span>
                    </button>
                    <div className="h-px bg-slate-100 my-1 mx-2"></div>
                    <button onClick={() => { setIsToggleMenuOpen(false); document.dispatchEvent(new CustomEvent('OPEN_SUPPORT')); }} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors w-full text-left">
                      <LifeBuoy size={16} className="text-slate-500" />
                      <span className="font-medium">Support</span>
                    </button>
                  </>
                )}`;

code = code.replace(targetDropdown, newDropdown);

// Expose logout methods from useAuth
const authHookTarget = `const {
    customerUser,
    isCustomerAuthenticated,
    workerUser,
    isWorkerAuthenticated,
    societyAdminUser,
    isSocietyAdminAuthenticated,
    federationAdminUser,
    isFederationAdminAuthenticated,
    superAdminUser,
    isSuperAdminAuthenticated,
    openAuthModal,
  } = useAuth();`;
  
const authHookReplacement = `const {
    customerUser,
    isCustomerAuthenticated,
    workerUser,
    isWorkerAuthenticated,
    societyAdminUser,
    isSocietyAdminAuthenticated,
    federationAdminUser,
    isFederationAdminAuthenticated,
    superAdminUser,
    isSuperAdminAuthenticated,
    openAuthModal,
    logoutCustomer,
    logoutWorker,
  } = useAuth();`;
code = code.replace(authHookTarget, authHookReplacement);

// Add language cycling logic
const languageCycling = `  useEffect(() => {
    const handleCycleLang = () => {
      const idx = SUPPORTED_LANGUAGES.findIndex(l => l.code === lang);
      const nextIdx = (idx + 1) % SUPPORTED_LANGUAGES.length;
      onSelectLang(SUPPORTED_LANGUAGES[nextIdx].code);
    };
    document.addEventListener('CYCLE_LANGUAGE', handleCycleLang);
    return () => document.removeEventListener('CYCLE_LANGUAGE', handleCycleLang);
  }, [lang, onSelectLang]);`;

if (!code.includes('handleCycleLang')) {
  code = code.replace(/const activeAuthInfo = getRoleAuthInfo\(\);/, languageCycling + '\n\n  const activeAuthInfo = getRoleAuthInfo();');
}

fs.writeFileSync('src/components/common/Header.tsx', code);
console.log('Header actions patched');
