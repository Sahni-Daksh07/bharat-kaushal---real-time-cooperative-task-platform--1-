const fs = require('fs');
let code = fs.readFileSync('src/components/common/Header.tsx', 'utf8');

// Replace the dynamic header class with the static sticky one
code = code.replace(
  /<header className=\{`sticky top-0 z-40 bg-white\/95 backdrop-blur border-b border-slate-200 shadow-xs transition-transform duration-300 ease-in-out \$\{isVisible \? 'translate-y-0' : '-translate-y-full'\}`\}>/,
  '<header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">'
);

fs.writeFileSync('src/components/common/Header.tsx', code);
console.log('Scroll hide logic removed, header is permanently sticky again');
