const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src/components');

let totalReplaced = 0;

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Add flex-wrap to simple flex containers that might wrap
  content = content.replace(/className="flex items-center gap-([1-4](?:\.5)?)"/g, 'className="flex flex-wrap items-center gap-$1"');
  
  // Make "flex items-center justify-between" wrap on small screens, unless it already has flex-wrap or flex-col
  content = content.replace(/className="flex items-center justify-between"/g, 'className="flex flex-wrap items-center justify-between gap-3"');
  
  // Some combinations
  content = content.replace(/className="flex items-center justify-between gap-([1-4](?:\.5)?)"/g, 'className="flex flex-wrap items-center justify-between gap-$1"');
  
  // Also button alignment:
  // Let's ensure buttons inside these portals have full width on mobile if they don't already have it, but it might be too broad.
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    totalReplaced++;
  }
});

console.log(`Standardized flex layouts in ${totalReplaced} files.`);
