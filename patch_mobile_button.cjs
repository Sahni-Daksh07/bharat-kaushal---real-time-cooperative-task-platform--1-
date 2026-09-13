const fs = require('fs');
let code = fs.readFileSync('src/components/common/Header.tsx', 'utf8');

const target = `            </button>
          </div>
        </div>

        {/* Multi-role Navigation Tabs */}`;

const replacement = `            </button>
            {(currentRole === 'CUSTOMER' || currentRole === 'WORKER') && (
              <button
                onClick={() => setIsToggleMenuOpen(!isToggleMenuOpen)}
                className="relative p-1.5 text-slate-600 bg-slate-100 rounded-lg"
              >
                <Menu size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Multi-role Navigation Tabs */}`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/common/Header.tsx', code);
console.log('Mobile button patched');
