import fs from 'fs';

let content = fs.readFileSync('src/utils/i18n.ts', 'utf8');

const lines = content.split('\n');
const fixedLines = [];
let keysInCurrentDict = new Set();

for (const line of lines) {
  if (line.match(/^\s+[a-zA-Z0-9_]+:\s+{/)) {
    // new dict
    keysInCurrentDict.clear();
    fixedLines.push(line);
  } else if (line.match(/^\s+[a-zA-Z0-9_]+:/)) {
    const key = line.match(/^\s+([a-zA-Z0-9_]+):/)[1];
    if (keysInCurrentDict.has(key)) {
      // Skip duplicate
      continue;
    }
    keysInCurrentDict.add(key);
    fixedLines.push(line);
  } else {
    if (line.match(/^\s+},/)) {
      keysInCurrentDict.clear();
    }
    fixedLines.push(line);
  }
}

fs.writeFileSync('src/utils/i18n.ts', fixedLines.join('\n'));
console.log('Fixed duplicates in i18n.ts');
