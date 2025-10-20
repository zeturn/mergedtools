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

function extractArrayValues(blockText, key) {
  const m = blockText.match(new RegExp(`${key}\\s*:\\s*\\[([\\s\\S]*?)\\]`))
  if (!m) return []
  const inside = m[1]
  return [...inside.matchAll(/['\"]([^'\"]+)['\"]/g)].map(x=>x[1])
}

function extractValue(blockText, key) {
  const m = blockText.match(new RegExp(`${key}\\s*:\\s*['\"]([^'\"]+)['\"]`))
  return m ? m[1] : null
}

async function run(){
  const entries = await readdir(toolsDir, { withFileTypes: true })
  const rows = []
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
      const id = extractValue(blockText, 'id') || d.name
      const name = extractValue(blockText, 'name') || id
      const desc = extractValue(blockText, 'desc') || ''
      const keywords = extractArrayValues(blockText, 'keywords')
      const ogImage = extractValue(blockText, 'ogImage') || ''
      rows.push({ id, name, desc, keywords, ogImage })
    } catch (e) {
      // ignore
    }
  }
  await writeFile(path.join(process.cwd(), 'tools-seo.json'), JSON.stringify(rows, null, 2))
  // also csv
  const csv = ['id,name,desc,keywords,ogImage', ...rows.map(r=>`"${r.id.replace(/"/g,'')}","${r.name.replace(/"/g,'')}","${r.desc.replace(/"/g,'')}","${(r.keywords||[]).join('|').replace(/"/g,'')}","${(r.ogImage||'').replace(/"/g,'')}"`)].join('\n')
  await writeFile(path.join(process.cwd(), 'tools-seo.csv'), csv)
  console.log('Exported', rows.length)
}

run().catch(e=>{ console.error(e); process.exit(1) })
