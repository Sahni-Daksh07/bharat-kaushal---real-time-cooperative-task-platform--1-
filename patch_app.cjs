const fs = require('fs');

let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

appTsx = appTsx.replace(
  "import React, { useState, Component, ErrorInfo, ReactNode } from 'react';",
  "import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';"
);

const effectStr = `
  useEffect(() => {
    (window as any).__currentLang = lang;
    
    const triggerTranslation = () => {
      const gTranslateObj = document.querySelector('.goog-te-combo');
      if (gTranslateObj) {
        // Find if language is in the dropdown
        let found = false;
        for (let i = 0; i < gTranslateObj.options.length; i++) {
          if (gTranslateObj.options[i].value === lang) {
            found = true;
            break;
          }
        }
        
        if (found || lang === 'en') {
          gTranslateObj.value = lang === 'en' ? 'en' : lang;
          gTranslateObj.dispatchEvent(new Event('change'));
        }
      }
    };
    
    // Slight delay to ensure script loaded if changed immediately
    setTimeout(triggerTranslation, 500);
    setTimeout(triggerTranslation, 2000); // fallback
  }, [lang]);
`;

appTsx = appTsx.replace(
  "const { toasts, dismissToast } = useRealtime();",
  "const { toasts, dismissToast } = useRealtime();\n" + effectStr
);

fs.writeFileSync('src/App.tsx', appTsx);
console.log('App.tsx patched with Google Translate effect.');
