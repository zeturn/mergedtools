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

function generateDesc(name, tags, id) {
  // simple templates
  const domain = tags && tags.length ? tags.slice(0,3).join('、') : '格式与数据处理'
  const verbs = ['转换', '格式化', '校验', '分析', '生成', '比较']
  const verb = verbs[ Math.floor(Math.random() * verbs.length) ]
  return `${name}：在浏览器中${verb} ${domain} 的实用工具，快速响应、无需上传、适合开发与日常使用。`
}

function generateKeywords(name, tags, id) {
  const s = new Set()
  name.split(/\s+|[-_]+/).forEach(t=>t && s.add(t.toLowerCase()))
  id.split(/[-_]+/).forEach(t=>t && s.add(t.toLowerCase()))
  tags.forEach(t=>s.add(t.toLowerCase()))
  // some base kws
  ['在线','工具','实用','开发者'].forEach(k=>s.add(k))
  return Array.from(s).slice(0,10)
}

async function run(){
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
      const name = extractValue(blockText, 'name') || d.name
      const id = extractValue(blockText, 'id') || d.name
      const tags = extractArrayValues(blockText, 'tags')
      const descExists = /\bdesc\s*\:/.test(blockText)
      const keywordsExists = /\bkeywords\s*\:/.test(blockText)

      const newFields = []
      if (!descExists) {
        const desc = generateDesc(name, tags, id)
        newFields.push(`  desc: ${JSON.stringify(desc)},`)
      } else {
        // optionally enhance existing desc if short
        const cur = extractValue(blockText, 'desc')
        if (cur && cur.length < 30) {
          const desc = generateDesc(name, tags, id)
          // replace the existing desc value
          const updatedBlock = blockText.replace(/(desc\s*:\s*)['\"][^'\"]+['\"]/ , `$1${JSON.stringify(desc)}`)
          const newText = text.slice(0, block.start) + updatedBlock + text.slice(block.end)
          await writeFile(idxPath, newText)
          modified++
          console.log('Enhanced desc for', d.name)
          continue
        }
      }
      if (!keywordsExists) {
        const kws = generateKeywords(name, tags, id)
        newFields.push(`  keywords: [${kws.map(k=>JSON.stringify(k)).join(', ')}],`)
      }
      if (newFields.length) {
        const newBlock = blockText.replace(/^{\n/, `{\n${newFields.join('\n')}\n`)
        const newText = text.slice(0, block.start) + newBlock + text.slice(block.end)
        await writeFile(idxPath, newText)
        modified++
        console.log('Updated', idxPath)
      }
    } catch (e) {
      // ignore
    }
  }
  console.log('Done. modified=', modified)
}

run().catch(e=>{ console.error(e); process.exit(1) })
