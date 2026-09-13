const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /booking\.status = 'COMPLETED';/,
  "booking.status = 'PAYMENT_PENDING';\n  booking.paymentStatus = 'PENDING';"
);

fs.writeFileSync('server.ts', code);
console.log('payment patched server');
