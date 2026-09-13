const fs = require('fs');
let code = fs.readFileSync('src/components/customer/CustomerPortal.tsx', 'utf8');

const handler = `
  const handlePayment = async () => {
    if (!paymentBooking) return;
    setIsProcessingPayment(true);
    
    try {
      let token = gmailToken;
      if (needsAuth || !token) {
        const result = await googleSignIn();
        if (result) token = result.accessToken;
      }
      
      const res = await fetch(\`/api/bookings/\${paymentBooking.id}/pay\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'UPI' })
      });
      if (!res.ok) throw new Error('Payment failed');
      const updatedBooking = await res.json();
      
      try {
        await sendInvoiceEmail(updatedBooking, effectiveCustomer.email || 'customer@example.com');
        alert('Payment successful! Invoice sent to your Gmail.');
      } catch (err: any) {
        alert('Payment successful, but failed to send invoice email: ' + err.message);
      }
      setPaymentBooking(null);
    } catch (err: any) {
      alert('Error during payment: ' + err.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };
`;

code = code.replace(
  /const t = \(key: string, fallback\?: string\) => getTranslation\(lang, key, fallback\);/,
  handler + '\n  const t = (key: string, fallback?: string) => getTranslation(lang, key, fallback);'
);

fs.writeFileSync('src/components/customer/CustomerPortal.tsx', code);
console.log('handler patched');
