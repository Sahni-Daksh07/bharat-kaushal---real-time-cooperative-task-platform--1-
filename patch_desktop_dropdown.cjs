const fs = require('fs');
let code = fs.readFileSync('src/components/common/Header.tsx', 'utf8');

const targetDesktopBtn = `          {/* Desktop Notifications Bell */}
          <div className="relative hidden md:block">
            <button
              id="btn-notifications-toggle"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
              )}
            </button>
          </div>`;

const replacementDesktopBtn = `          {/* Desktop Notifications Bell */}
          <div className="relative hidden md:block">
            <button
              id="btn-notifications-toggle"
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (isToggleMenuOpen) setIsToggleMenuOpen(false);
              }}
              className="relative p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
              )}
            </button>
          </div>

          {/* Desktop Toggle Menu Button */}
          {(currentRole === 'CUSTOMER' || currentRole === 'WORKER') && (
            <div className="relative hidden md:block">
              <button
                onClick={() => {
                  setIsToggleMenuOpen(!isToggleMenuOpen);
                  if (showNotifications) setShowNotifications(false);
                }}
                className="relative p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Menu size={18} />
              </button>
            </div>
          )}`;

code = code.replace(targetDesktopBtn, replacementDesktopBtn);

// Also need to handle closing notifications when clicking toggle on mobile
const mobileBtnTarget = `            <button
              id="btn-mobile-notifications-toggle"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 text-slate-600 bg-slate-100 rounded-lg"
            >`;
const mobileBtnReplacement = `            <button
              id="btn-mobile-notifications-toggle"
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (isToggleMenuOpen) setIsToggleMenuOpen(false);
              }}
              className="relative p-1.5 text-slate-600 bg-slate-100 rounded-lg"
            >`;
code = code.replace(mobileBtnTarget, mobileBtnReplacement);

const mobileToggleBtnTarget = `              <button
                onClick={() => setIsToggleMenuOpen(!isToggleMenuOpen)}
                className="relative p-1.5 text-slate-600 bg-slate-100 rounded-lg"
              >`;
const mobileToggleBtnReplacement = `              <button
                onClick={() => {
                  setIsToggleMenuOpen(!isToggleMenuOpen);
                  if (showNotifications) setShowNotifications(false);
                }}
                className="relative p-1.5 text-slate-600 bg-slate-100 rounded-lg"
              >`;
code = code.replace(mobileToggleBtnTarget, mobileToggleBtnReplacement);


const targetDropdown = `          {/* Dropdown Menu (Renders absolutely, shared between mobile/desktop trigger) */}`;

const newDropdownMenu = `          {/* Toggle Menu Dropdown */}
          {isToggleMenuOpen && (currentRole === 'CUSTOMER' || currentRole === 'WORKER') && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex flex-col text-sm text-slate-700">
                {currentRole === 'CUSTOMER' && (
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
                )}
              </div>
            </div>
          )}
          
          {/* Dropdown Menu (Renders absolutely, shared between mobile/desktop trigger) */}`;

code = code.replace(targetDropdown, newDropdownMenu);

fs.writeFileSync('src/components/common/Header.tsx', code);
console.log('Desktop toggle and dropdown patched');
