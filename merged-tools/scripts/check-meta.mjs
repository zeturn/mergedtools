import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const toolsDir = path.resolve(process.cwd(), 'src/tools')

async function run(){
  const entries = await readdir(toolsDir, { withFileTypes: true })
  const missingDesc = []
  const missingKeywords = []
  for (const d of entries) {
    if (!d.isDirectory()) continue
    const idxPath = path.join(toolsDir, d.name, 'index.tsx')
    try {
      const text = await readFile(idxPath, 'utf8')
      const exportIdx = text.indexOf('export const meta')
      if (exportIdx === -1) continue
      const slice = text.slice(exportIdx, exportIdx+800)
      if (!/\bdesc\s*:\s*/.test(slice)) missingDesc.push(d.name)
      if (!/\bkeywords\s*:\s*/.test(slice)) missingKeywords.push(d.name)
    } catch (e) {
      // ignore
    }
  }
  console.log('missingDesc:', missingDesc.length)
  console.log('missingKeywords:', missingKeywords.length)
  if (missingDesc.length) console.log('desc missing sample:', missingDesc.slice(0,20).join(', '))
  if (missingKeywords.length) console.log('keywords missing sample:', missingKeywords.slice(0,20).join(', '))
}

run().catch(e=>{ console.error(e); process.exit(1) })
