const fs = require('fs');
let code = fs.readFileSync('src/components/customer/CustomerPortal.tsx', 'utf8');

if (!code.includes('History,')) {
  code = code.replace(
    /ArrowLeft,\s*} from 'lucide-react';/,
    "ArrowLeft, History } from 'lucide-react';"
  );
}

fs.writeFileSync('src/components/customer/CustomerPortal.tsx', code);
console.log('Customer icon patched');
