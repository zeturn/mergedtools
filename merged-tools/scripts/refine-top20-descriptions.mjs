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

function refineDescription(name, tags, id) {
  // handcrafted templates to feel more natural
  const tagStr = tags && tags.length ? tags.slice(0,3).join('、') : ''
  const base = `${name} 是一个在线工具` 
  const use = tagStr ? `，用于${tagStr}` : '，用于常见格式与数据处理'
  const benefits = '。在浏览器中即时运行，无需上传，适合开发与日常使用。'
  // Add a short example for a few known tools by heuristics
  const lname = name.toLowerCase()
  if (lname.includes('json')) return `${name}：快速格式化、校验与查看 JSON 数据，支持粘贴与文件导入，方便调试与分析。`
  if (lname.includes('csv') || lname.includes('tsv')) return `${name}：在浏览器中处理表格数据（CSV/TSV），支持转换、拆分、合并与导出，适合数据清洗与快速查看。`
  if (lname.includes('qr')) return `${name}：生成或解码二维码（QR），支持文本与 Wi‑Fi / vCard 等信息类型，方便分享与扫描。`
  if (lname.includes('image') || lname.includes('img') || lname.includes('compress') || lname.includes('convert')) return `${name}：轻量的客户端图像处理工具，支持转换、压缩、裁剪等常见操作，保护隐私无需上传。`
  if (lname.includes('hash') || lname.includes('md5') || lname.includes('sha')) return `${name}：生成与校验各种哈希（MD5/SHA），用于完整性校验与快速验证。`
  if (lname.includes('pdf')) return `${name}：提供 PDF 合并、签名检查等实用功能，便于文档处理与验证。`
  if (lname.includes('base64')) return `${name}：在浏览器内对文本或文件进行 Base64 编码与解码，快速便捷。`

  return `${base}${use}${benefits}`
}

async function run(){
  const entries = await readdir(toolsDir, { withFileTypes: true })
  const list = []
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
      const tags = extractArrayValues(blockText, 'tags')
      list.push({ id, name, tags, idxPath, block, blockText })
    } catch (e) {
      // ignore
    }
  }
  // sort by name and pick top 20
  list.sort((a,b)=>a.name.localeCompare(b.name))
  const top = list.slice(0,20)
  console.log('Top 20 tools to refine:')
  top.forEach((t,i)=>console.log(i+1, t.id, '-', t.name))

  let modified = 0
  for (const t of top) {
    const newDesc = refineDescription(t.name, t.tags, t.id)
    const hasDesc = /\bdesc\s*\:/.test(t.blockText)
    let newBlockText = t.blockText
    if (hasDesc) {
      // replace existing desc string (naive)
      if (/desc\s*:\s*['\"]/.test(newBlockText)) {
        newBlockText = newBlockText.replace(/(desc\s*:\s*)['\"][^'\"]*['\"]/ , `$1${JSON.stringify(newDesc)}`)
      } else {
        // fallback: insert
        newBlockText = newBlockText.replace(/^{\n/, `{\n  desc: ${JSON.stringify(newDesc)},\n`)
      }
    } else {
      newBlockText = newBlockText.replace(/^{\n/, `{\n  desc: ${JSON.stringify(newDesc)},\n`)
    }
    const newText = (await readFile(t.idxPath, 'utf8')).slice(0, t.block.start) + newBlockText + (await readFile(t.idxPath, 'utf8')).slice(t.block.end)
    await writeFile(t.idxPath, newText)
    console.log('Wrote desc for', t.id)
    modified++
  }
  console.log('Done. modified=', modified)
}

run().catch(e=>{ console.error(e); process.exit(1) })
