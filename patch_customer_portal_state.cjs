const fs = require('fs');
let code = fs.readFileSync('src/components/customer/CustomerPortal.tsx', 'utf8');

code = code.replace(
  /const \[isEmailModalOpen, setIsEmailModalOpen\] = useState\(false\);/,
  "const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);\n  const [paymentBooking, setPaymentBooking] = useState<Booking | null>(null);\n  const [isProcessingPayment, setIsProcessingPayment] = useState(false);\n  const [needsAuth, setNeedsAuth] = useState(false);\n  const [gmailToken, setGmailToken] = useState<string | null>(null);\n\n  React.useEffect(() => {\n    initAuth(\n      (user, token) => { setNeedsAuth(false); setGmailToken(token); },\n      () => setNeedsAuth(true)\n    );\n  }, []);"
);

fs.writeFileSync('src/components/customer/CustomerPortal.tsx', code);
console.log('state patched');
