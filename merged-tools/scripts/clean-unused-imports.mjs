#!/usr/bin/env node

/**
 * 清理未使用的Input/Textarea导入
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toolsDir = path.join(__dirname, '../src/tools');
const pagesDir = path.join(__dirname, '../src/pages');

let fixedCount = 0;

function cleanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // 检查是否有导入但未使用Input或Textarea
  const hasInputImport = /import.*Input.*from.*components\/Input/.test(content);
  const hasTextareaImport = /import.*Textarea.*from.*components\/Input/.test(content);
  
  if (!hasInputImport && !hasTextareaImport) return;
  
  const usesInput = /<Input\s/.test(content);
  const usesTextarea = /<Textarea\s/.test(content);
  
  let modified = false;
  let newContent = content;
  
  // 如果都没使用，删除整个导入行
  if (!usesInput && !usesTextarea) {
    newContent = newContent.replace(/import.*from ['"].*components\/Input['"]\n/g, '');
    modified = true;
  }
  // 如果只使用了其中一个
  else if (hasInputImport && hasTextareaImport) {
    if (!usesInput && usesTextarea) {
      // 只保留Textarea
      newContent = newContent.replace(
        /import\s*{?\s*Input\s*,?\s*Textarea\s*}?\s*from\s*['"](.*)components\/Input['"]/g,
        "import { Textarea } from '$1components/Input'"
      );
      newContent = newContent.replace(
        /import\s*{?\s*Textarea\s*,?\s*Input\s*}?\s*from\s*['"](.*)components\/Input['"]/g,
        "import { Textarea } from '$1components/Input'"
      );
      modified = true;
    } else if (usesInput && !usesTextarea) {
      // 只保留Input
      newContent = newContent.replace(
        /import\s*{?\s*Input\s*,?\s*Textarea\s*}?\s*from\s*['"](.*)components\/Input['"]/g,
        "import Input from '$1components/Input'"
      );
      newContent = newContent.replace(
        /import\s*{?\s*Textarea\s*,?\s*Input\s*}?\s*from\s*['"](.*)components\/Input['"]/g,
        "import Input from '$1components/Input'"
      );
      modified = true;
    }
  }
  // 单独导入的情况
  else if (hasInputImport && !usesInput) {
    newContent = newContent.replace(/import\s+Input\s+from\s+['"].*components\/Input['"]\n/g, '');
    modified = true;
  } else if (hasTextareaImport && !usesTextarea) {
    newContent = newContent.replace(/import\s*{?\s*Textarea\s*}?\s*from\s*['"].*components\/Input['"]\n/g, '');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    fixedCount++;
    console.log(`✅ ${path.relative(process.cwd(), filePath)}`);
  }
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
      cleanFile(fullPath);
    }
  }
}

console.log('🧹 清理未使用的导入...\n');

if (fs.existsSync(toolsDir)) {
  processDirectory(toolsDir);
}

if (fs.existsSync(pagesDir)) {
  processDirectory(pagesDir);
}

console.log(`\n✨ 完成！修复了 ${fixedCount} 个文件\n`);
