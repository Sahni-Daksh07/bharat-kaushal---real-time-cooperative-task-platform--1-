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

  // Make buttons that are "flex items-center gap-" also be "w-full sm:w-auto justify-center sm:justify-start" if they aren't already.
  // This is safer to do conditionally if they are standalone action buttons, but doing it broadly to all `button className="... flex items-center` could break icon-only buttons.
  // We'll target buttons with `px-` and `py-` which typically have text.

  content = content.replace(
    /<button([^>]*)className="([^"]*?)px-([0-9\.]+) py-([0-9\.]+)([^"]*?)flex items-center gap-([^"]*?)"/g,
    (match, p1, p2, p3, p4, p5, p6) => {
      // Avoid if already has justify-center or w-full
      if (match.includes('w-full') || match.includes('justify-center')) {
        return match;
      }
      return `<button${p1}className="${p2}px-${p3} py-${p4}${p5}w-full sm:w-auto flex items-center justify-center sm:justify-start gap-${p6}"`;
    }
  );

  if (content !== original) {
    fs.writeFileSync(file, content);
    totalReplaced++;
  }
});

console.log(`Standardized button layouts in ${totalReplaced} files.`);
