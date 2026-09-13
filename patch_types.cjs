const fs = require('fs');
let code = fs.readFileSync('src/types/index.ts', 'utf8');

if (!code.includes('paymentStatus?:')) {
  code = code.replace(
    /rating\?: \{/,
    "paymentStatus?: 'PENDING' | 'PAID';\n  paymentMethod?: string;\n  rating?: {"
  );
  fs.writeFileSync('src/types/index.ts', code);
  console.log('types patched');
}
