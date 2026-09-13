const fs = require('fs');
let code = fs.readFileSync('src/components/worker/WorkerPortal.tsx', 'utf8');

code = code.replace(
  /className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 transition-all shadow-2xs"/g,
  'className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center sm:justify-start gap-1.5 transition-all shadow-2xs"'
);

code = code.replace(
  /className=\{`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs border \$\{/g,
  'className={`flex items-center justify-center sm:justify-start gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs border ${'
);

code = code.replace(
  /className=\{`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs \$\{/g,
  'className={`flex items-center justify-center sm:justify-start gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${'
);

fs.writeFileSync('src/components/worker/WorkerPortal.tsx', code);
console.log('WorkerPortal patched.');
