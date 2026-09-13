const fs = require('fs');
let code = fs.readFileSync('src/components/common/Header.tsx', 'utf8');

// 1. Add `useEffect` to imports
if (!code.includes('useEffect')) {
  code = code.replace(/import React, { useState } from 'react';/, "import React, { useState, useEffect } from 'react';");
}

// 2. Add state and scroll tracking logic before `return`
const scrollLogic = `
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If we scroll down more than 50px, hide it. If we scroll up, show it.
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      // Always show at the very top
      if (currentScrollY <= 20) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const activeAuthInfo = getRoleAuthInfo();
`;

code = code.replace(
  /const activeAuthInfo = getRoleAuthInfo\(\);/,
  scrollLogic
);

// 3. Update header className to transition
code = code.replace(
  /<header className="sticky top-0 z-40 bg-white\/95 backdrop-blur border-b border-slate-200 shadow-xs">/,
  "<header className={`sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>"
);

fs.writeFileSync('src/components/common/Header.tsx', code);
console.log('Scroll hide logic added');
