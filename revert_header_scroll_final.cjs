const fs = require('fs');
let code = fs.readFileSync('src/components/common/Header.tsx', 'utf8');

// 1. Remove the scroll logic block
const scrollLogicRegex = /const \[isVisible, setIsVisible\] = useState\(true\);[\s\S]*?}, \[lastScrollY\]\);/;
code = code.replace(scrollLogicRegex, '');

// 2. Replace the dynamic header class with the static sticky one
const headerClassRegex = /<header className=\{`sticky top-0 z-40 bg-white\/95 backdrop-blur border-b border-slate-200 shadow-xs transition-transform duration-700 ease-in-out \$\{isVisible \? 'translate-y-0' : '-translate-y-full'\}`\}>/;
code = code.replace(
  headerClassRegex,
  '<header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">'
);

fs.writeFileSync('src/components/common/Header.tsx', code);
console.log('Scroll hide logic completely removed.');
