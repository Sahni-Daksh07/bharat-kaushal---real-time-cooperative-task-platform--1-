const fs = require('fs');
let code = fs.readFileSync('src/components/worker/WorkerPortal.tsx', 'utf8');

code = code.replace(
  /<div className="flex items-start sm:items-center gap-4">/,
  '<div className="flex items-start sm:items-center gap-4 w-full md:w-auto min-w-0 flex-1">'
);

code = code.replace(
  /<div className="space-y-1">/g,
  '<div className="space-y-1 min-w-0 flex-1">'
);

code = code.replace(
  /className="text-xs bg-slate-50 border border-slate-300 rounded px-2 py-0.5 text-slate-700 font-medium"/,
  'className="max-w-full text-xs bg-slate-50 border border-slate-300 rounded px-2 py-0.5 text-slate-700 font-medium truncate"'
);

fs.writeFileSync('src/components/worker/WorkerPortal.tsx', code);
console.log('Worker layout fixed.');
