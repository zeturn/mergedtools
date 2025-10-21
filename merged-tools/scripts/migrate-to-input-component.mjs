#!/usr/bin/env node

/**
 * 自动将所有工具页面中的输入框迁移到统一的Input组件
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toolsDir = path.join(__dirname, '../src/tools');
const pagesDir = path.join(__dirname, '../src/pages');

// 统计信息
const stats = {
  totalFiles: 0,
  modifiedFiles: 0,
  inputsReplaced: 0,
  textareasReplaced: 0,
  errors: []
};

/**
 * 检查文件是否需要更新
 */
function needsUpdate(content) {
  return (
    (content.includes('<input') || content.includes('<textarea')) &&
    !content.includes('from \'../../components/Input\'') &&
    !content.includes('from \'../components/Input\'')
  );
}

/**
 * 更新文件内容
 */
function updateFileContent(content, filePath) {
  let modified = false;
  let inputCount = 0;
  let textareaCount = 0;
  
  // 判断是 pages 还是 tools
  const isPages = filePath.includes('/pages/');
  const importPath = isPages ? '../components/Input' : '../../components/Input';
  
  // 检查是否需要导入Input或Textarea
  const hasInput = /<input\s/.test(content) && !/<input\s+type=["'](checkbox|radio|file|color|date|datetime-local|number|range)["']/.test(content);
  const hasTextarea = /<textarea\s/.test(content);
  
  if (!hasInput && !hasTextarea) {
    return { content, modified, inputCount, textareaCount };
  }
  
  // 添加导入语句
  const importStatements = [];
  if (hasInput) importStatements.push('Input');
  if (hasTextarea) importStatements.push('Textarea');
  
  if (importStatements.length > 0) {
    const importLine = importStatements.length === 1 && importStatements[0] === 'Input'
      ? `import Input from '${importPath}'`
      : `import { ${importStatements.join(', ')} } from '${importPath}'`;
    
    // 在第一个import之后插入
    const importMatch = content.match(/^(import\s+.*\n)+/m);
    if (importMatch) {
      content = content.replace(
        importMatch[0],
        importMatch[0] + importLine + '\n'
      );
      modified = true;
    }
  }
  
  // 替换 <textarea className="textarea ...
  if (hasTextarea) {
    content = content.replace(
      /<textarea\s+className="textarea([^"]*)"/g,
      (match, extraClasses) => {
        textareaCount++;
        // 保留额外的类名
        const cleanClasses = extraClasses.trim();
        if (cleanClasses) {
          return `<Textarea variant="simple" className="${cleanClasses}"`;
        }
        return '<Textarea variant="simple"';
      }
    );
    modified = true;
  }
  
  // 替换 <input className="input ...（但不包括特殊类型的input）
  if (hasInput) {
    // 先处理有className="input"的情况
    content = content.replace(
      /<input\s+([^>]*?)className="input([^"]*)"/g,
      (match, before, extraClasses) => {
        // 检查是否已经是Input组件
        if (before.includes('variant=')) return match;
        
        inputCount++;
        const cleanClasses = extraClasses.trim();
        const cleanBefore = before.trim() ? before.trim() + ' ' : '';
        
        if (cleanClasses) {
          return `<Input ${cleanBefore}variant="simple" className="${cleanClasses}"`;
        }
        return `<Input ${cleanBefore}variant="simple"`;
      }
    );
    
    modified = true;
  }
  
  return { content, modified, inputCount, textareaCount };
}

/**
 * 处理单个文件
 */
function processFile(filePath) {
  try {
    stats.totalFiles++;
    
    const content = fs.readFileSync(filePath, 'utf-8');
    
    if (!needsUpdate(content)) {
      return;
    }
    
    const result = updateFileContent(content, filePath);
    
    if (result.modified) {
      fs.writeFileSync(filePath, result.content, 'utf-8');
      stats.modifiedFiles++;
      stats.inputsReplaced += result.inputCount;
      stats.textareasReplaced += result.textareaCount;
      console.log(`✅ ${path.relative(process.cwd(), filePath)} - ${result.inputCount} inputs, ${result.textareaCount} textareas`);
    }
  } catch (error) {
    stats.errors.push({ file: filePath, error: error.message });
    console.error(`❌ ${path.relative(process.cwd(), filePath)}: ${error.message}`);
  }
}

/**
 * 递归处理目录
 */
function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && (entry.name === 'Page.tsx' || entry.name.endsWith('.tsx'))) {
      processFile(fullPath);
    }
  }
}

// 主执行
console.log('🚀 开始迁移输入框到统一组件...\n');

// 处理tools目录
if (fs.existsSync(toolsDir)) {
  console.log('📁 处理 tools 目录...');
  processDirectory(toolsDir);
}

// 处理pages目录
if (fs.existsSync(pagesDir)) {
  console.log('\n📁 处理 pages 目录...');
  processDirectory(pagesDir);
}

// 输出统计信息
console.log('\n' + '='.repeat(50));
console.log('📊 迁移统计:');
console.log(`   总文件数: ${stats.totalFiles}`);
console.log(`   修改文件数: ${stats.modifiedFiles}`);
console.log(`   输入框替换: ${stats.inputsReplaced}`);
console.log(`   文本域替换: ${stats.textareasReplaced}`);

if (stats.errors.length > 0) {
  console.log(`\n❌ 错误数: ${stats.errors.length}`);
  stats.errors.forEach(({ file, error }) => {
    console.log(`   - ${path.relative(process.cwd(), file)}: ${error}`);
  });
}

console.log('='.repeat(50));
console.log('✨ 迁移完成!\n');
