import { Project, SyntaxKind } from 'ts-morph';
import fs from 'fs';

const project = new Project();
project.addSourceFilesAtPaths("src/components/**/*.tsx");
project.addSourceFilesAtPaths("src/App.tsx");

function sanitizeKey(str: string) {
  return str.trim().replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30) + '_' + Math.random().toString(36).substring(2, 7);
}

const extractedData: {key: string, original: string}[] = [];

for (const sourceFile of project.getSourceFiles()) {
  let modified = false;
  
  const jsxTexts = sourceFile.getDescendantsOfKind(SyntaxKind.JsxText);
  for (const jsxText of jsxTexts) {
    const text = jsxText.getLiteralText();
    if (text.trim().length > 1 && !/^[{}]+$/.test(text.trim())) {
      const original = text.trim();
      const key = sanitizeKey(original);
      extractedData.push({key, original});
      
      try {
        jsxText.replaceWithText(`{t('${key}', \`${original.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)}`);
        modified = true;
      } catch (e) {
      }
    }
  }

  const jsxAttributes = sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute);
  for (const attr of jsxAttributes) {
    const nameNode = attr.getNameNode();
    const name = nameNode.getText();
    if (['placeholder', 'title', 'label'].includes(name)) {
      const init = attr.getInitializer();
      if (init && init.isKind(SyntaxKind.StringLiteral)) {
        const text = init.getLiteralValue();
        if (text.trim().length > 0) {
          const key = sanitizeKey(text);
          extractedData.push({key, original: text});
          try {
            attr.setInitializer(`{t('${key}', \`${text.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)}`);
            modified = true;
          } catch(e) {}
        }
      }
    }
  }

  if (modified) {
    sourceFile.saveSync();
  }
}

fs.writeFileSync('extracted.json', JSON.stringify(extractedData, null, 2));
console.log('Extraction complete. Found', extractedData.length, 'strings.');
