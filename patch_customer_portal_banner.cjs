const fs = require('fs');
let code = fs.readFileSync('src/components/customer/CustomerPortal.tsx', 'utf8');

code = code.replace(
  /\{activeBooking && activeBooking\.status !== 'COMPLETED' && activeBooking\.status !== 'CANCELLED' && \(/,
  "{activeBooking && activeBooking.status !== 'CANCELLED' && (activeBooking.status !== 'COMPLETED' || !activeBooking.rating) && ("
);

fs.writeFileSync('src/components/customer/CustomerPortal.tsx', code);
console.log('banner patched');
