const fs = require('fs');
let code = fs.readFileSync('src/auth.ts', 'utf8');

code = code.replace(
  /provider\.addScope\('https:\/\/www\.googleapis\.com\/auth\/gmail\.send'\);/,
  `provider.addScope('https://www.googleapis.com/auth/gmail.send');
provider.addScope('https://www.googleapis.com/auth/gmail.compose');
provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
provider.addScope('https://www.googleapis.com/auth/gmail.modify');`
);

fs.writeFileSync('src/auth.ts', code);
console.log('scopes patched');
