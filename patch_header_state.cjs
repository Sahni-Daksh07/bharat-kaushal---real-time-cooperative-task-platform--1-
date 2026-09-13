const fs = require('fs');
let code = fs.readFileSync('src/components/common/Header.tsx', 'utf8');

if (!code.includes('isToggleMenuOpen')) {
  code = code.replace(
    /const \[showNotifications, setShowNotifications\] = useState\(false\);/,
    "const [showNotifications, setShowNotifications] = useState(false);\n  const [isToggleMenuOpen, setIsToggleMenuOpen] = useState(false);"
  );
}

fs.writeFileSync('src/components/common/Header.tsx', code);
console.log('State patched');
