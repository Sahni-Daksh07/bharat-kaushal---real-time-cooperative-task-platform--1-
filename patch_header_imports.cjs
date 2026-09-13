const fs = require('fs');
let code = fs.readFileSync('src/components/common/Header.tsx', 'utf8');

if (!code.includes('Menu,')) {
  code = code.replace(
    /ChevronDown,\s*} from 'lucide-react';/,
    "ChevronDown, Menu, LogOut, History, Wallet, Globe, Headphones, LifeBuoy, FileText } from 'lucide-react';"
  );
}

fs.writeFileSync('src/components/common/Header.tsx', code);
console.log('Imports patched');
