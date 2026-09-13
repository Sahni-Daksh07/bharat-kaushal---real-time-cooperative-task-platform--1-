const fs = require('fs');
let code = fs.readFileSync('src/components/chatbot/BharatKaushalCare.tsx', 'utf8');

const target = `  const [isOpen, setIsOpen] = useState(false);`;
const replacement = `  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpenSupport = () => setIsOpen(true);
    document.addEventListener('OPEN_SUPPORT', handleOpenSupport);
    return () => document.removeEventListener('OPEN_SUPPORT', handleOpenSupport);
  }, []);`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/chatbot/BharatKaushalCare.tsx', code);
console.log('Support event patched');
