import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const toolsDir = path.resolve(process.cwd(), 'src/tools')

function parseBlock(content, startIdx) {
  let i = content.indexOf('{', startIdx)
  if (i === -1) return null
  let depth = 0
  let inSingle = false
  let inDouble = false
  let inTemplate = false
  let escaped = false
  for (let j = i; j < content.length; j++) {
    const ch = content[j]
    if (escaped) { escaped = false; continue }
    if (ch === '\\') { escaped = true; continue }
    if (ch === "'" && !inDouble && !inTemplate) inSingle = !inSingle
    else if (ch === '"' && !inSingle && !inTemplate) inDouble = !inDouble
    else if (ch === '`' && !inSingle && !inDouble) inTemplate = !inTemplate
    else if (!inSingle && !inDouble && !inTemplate) {
      if (ch === '{') depth++
      else if (ch === '}') {
        depth--
        if (depth === 0) return { start: i, end: j+1, text: content.slice(i, j+1) }
      }
    }
  }
  return null
}

function extractStringArray(text) {
  // naive extract of ['a','b'] -> array
  const m = text.match(/\[([\s\S]*?)\]/)
  if (!m) return []
  const inside = m[1]
  const items = [...inside.matchAll(/['\"]([^'\"]+)['\"]/g)].map(x=>x[1])
  return items
}

async function run() {
  const entries = await readdir(toolsDir, { withFileTypes: true })
  let modified = 0
  for (const d of entries) {
    if (!d.isDirectory()) continue
    const idxPath = path.join(toolsDir, d.name, 'index.tsx')
    try {
      const text = await readFile(idxPath, 'utf8')
      const exportIdx = text.indexOf('export const meta')
      if (exportIdx === -1) continue
      const block = parseBlock(text, exportIdx)
      if (!block) continue
      const blockText = block.text
      const hasDesc = /\bdesc\s*\:/.test(blockText)
      const hasKeywords = /\bkeywords\s*\:/.test(blockText)
      if (hasDesc && hasKeywords) continue

      // extract name, tags, id
      let name = (blockText.match(/\bname\s*:\s*['\"]([^'\"]+)['\"]/)||[])[1]
      const id = (blockText.match(/\bid\s*:\s*['\"]([^'\"]+)['\"]/)||[])[1] || d.name
      if (!name) name = id.split('-').map(s=>s[0]?.toUpperCase()+s.slice(1)).join(' ')
      const tags = extractStringArray(blockText.match(/tags\s*:\s*\[([\s\S]*?)\]/)?.[0] || '')

      // build desc and keywords
      const defaultDesc = `${name}：一个在线实用工具，用于 ${tags.length? tags.join('、') : '常见格式与数据处理'}。在浏览器内实时运行，无需上传或后端服务。`
      const kwSet = new Set()
      name.split(/[\s\-_/]+/).forEach(t=>t && kwSet.add(t.toLowerCase()))
      id.split(/[-_]+/).forEach(t=>t && kwSet.add(t.toLowerCase()))
      tags.forEach(t=>kwSet.add(t.toLowerCase()))
      const keywords = Array.from(kwSet).slice(0, 10)

      // prepare insertion
      let newBlock = blockText
      const indent = blockText.match(/^{\n(\s*)/)?.[1] || '  '
      const inserts = []
      if (!hasDesc) inserts.push(`${indent}desc: ${JSON.stringify(defaultDesc)},`)
      if (!hasKeywords) inserts.push(`${indent}keywords: [${keywords.map(k=>JSON.stringify(k)).join(', ')}],`)
      if (inserts.length) {
        // place after opening brace
        newBlock = blockText.replace(/^{\n/, `{\n${inserts.join('\n')}
`)
        const newText = text.slice(0, block.start) + newBlock + text.slice(block.end)
        await writeFile(idxPath, newText)
        modified++
        console.log('Updated', idxPath)
      }
    } catch (e) {
      // ignore missing files
    }
  }
  console.log('Done. modified=', modified)
}

run().catch(e=>{ console.error(e); process.exit(1) })
