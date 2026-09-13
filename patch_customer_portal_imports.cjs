const fs = require('fs');
let code = fs.readFileSync('src/components/customer/CustomerPortal.tsx', 'utf8');

code = code.replace(
  /import \{ EmailVerificationModal \} from '\.\.\/common\/EmailVerificationModal';/,
  "import { EmailVerificationModal } from '../common/EmailVerificationModal';\nimport { initAuth, googleSignIn, getAccessToken } from '../../auth';\nimport { sendInvoiceEmail } from '../../lib/gmail';"
);

fs.writeFileSync('src/components/customer/CustomerPortal.tsx', code);
console.log('imports patched');
