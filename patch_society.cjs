const fs = require('fs');
let code = fs.readFileSync('src/components/society/SocietyAdminPortal.tsx', 'utf8');

code = code.replace(
  /className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5 transition-all"/g,
  'className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center sm:justify-start gap-1.5 transition-all"'
);

code = code.replace(
  /className=\{`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs border \$\{/g,
  'className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center sm:justify-start gap-1.5 transition-all shadow-2xs border ${'
);

fs.writeFileSync('src/components/society/SocietyAdminPortal.tsx', code);
console.log('SocietyAdminPortal patched.');
