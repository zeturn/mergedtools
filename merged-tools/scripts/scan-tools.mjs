#!/usr/bin/env node

/**
 * 扫描merged-tools中需要后端支持的工具
 * 这些工具依赖外部命令行工具或服务
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const TOOLS_DIR = './src/tools';

// 需要后端支持的工具名称模式
const BACKEND_TOOLS = [
  'calibre-convert',
  'libreoffice-convert', 
  'pandoc-convert',
  'xelatex',
  'dvisvgm',
  'inkscape',
  'resvg',
  'potrace',
  'vtracer',
  'imagemagick',
  'graphicsmagick',
  'vips',
  'libheif',
  'libjxl',
  'msgconvert',
  'dasel',
  'docker-run-compose',
];

// 过于简单的工具
const SIMPLE_TOOLS = [
  'sum',
  'percentage',
  'arithmetic-sequence',
  'reverse',
  'repeat',
  'randomize-case',
  'swap-csv-columns',
  'insert-csv-columns',
  'truncate-clock-time',
  'convert-days-to-hours',
  'convert-hours-to-days',
  'convert-seconds-to-time',
  'convert-time-to-seconds',
];

// 可以合并的工具组
const MERGEABLE_GROUPS = {
  'base-encoders': [
    'base32', 'base45', 'base58', 'base62', 
    'base64', 'base64-file', 'base85'
  ],
  'hash-tools': [
    'hash', 'hash-extra', 'hash-text', 'file-hash'
  ],
  'json-tools': [
    'json-format', 'json-minify', 'json-viewer',
    'json-stringify', 'validate-json', 'escape-json'
  ],
  'time-tools': [
    'timestamp', 'convert-unix-to-date', 'date-diff',
    'time-between-dates'
  ],
  'list-tools': [
    'list-converter', 'list-duplicate', 'list-find-most-popular',
    'list-find-unique', 'list-group', 'list-reverse',
    'list-rotate', 'list-shuffle', 'list-sort',
    'list-truncate', 'list-unwrap', 'list-wrap'
  ]
};

async function scanTools() {
  const entries = await readdir(TOOLS_DIR, { withFileTypes: true });
  const tools = entries.filter(e => e.isDirectory()).map(e => e.name);
  
  console.log('📊 工具分析报告\n');
  console.log(`总工具数: ${tools.length}\n`);
  
  // 需要后端的工具
  const backendTools = tools.filter(t => BACKEND_TOOLS.includes(t));
  console.log('🖥️  需要后端支持的工具 (' + backendTools.length + '个):');
  backendTools.forEach(t => console.log('  ❌ ' + t));
  console.log();
  
  // 过于简单的工具
  const simpleTools = tools.filter(t => SIMPLE_TOOLS.includes(t));
  console.log('🔧 功能过于简单的工具 (' + simpleTools.length + '个):');
  simpleTools.forEach(t => console.log('  ❌ ' + t));
  console.log();
  
  // 可以合并的工具
  console.log('🔀 可以合并的工具组:\n');
  for (const [groupName, groupTools] of Object.entries(MERGEABLE_GROUPS)) {
    const existing = groupTools.filter(t => tools.includes(t));
    if (existing.length > 0) {
      console.log(`  ${groupName} (${existing.length}个):`);
      existing.forEach(t => console.log('    → ' + t));
      console.log();
    }
  }
  
  // 统计
  const toDelete = backendTools.length + simpleTools.length;
  const toMerge = Object.values(MERGEABLE_GROUPS)
    .flat()
    .filter(t => tools.includes(t))
    .length;
  const remaining = tools.length - toDelete;
  const afterMerge = remaining - toMerge + Object.keys(MERGEABLE_GROUPS).length;
  
  console.log('📈 优化预期:\n');
  console.log(`  当前工具数: ${tools.length}`);
  console.log(`  建议删除: ${toDelete} 个`);
  console.log(`  建议合并: ${toMerge} 个 → ${Object.keys(MERGEABLE_GROUPS).length} 个`);
  console.log(`  优化后预计: ${afterMerge} 个`);
  console.log(`  减少: ${tools.length - afterMerge} 个 (${Math.round((tools.length - afterMerge) / tools.length * 100)}%)`);
}

scanTools().catch(console.error);
