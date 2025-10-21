import { useMemo, useState } from 'react'
import { Textarea } from '../../components/Input'

function parseCSV(s: string): string[][] {
  // 简易 CSV（不处理引号嵌套的所有边界，用于小工具足够）：按行、逗号、去除包裹引号
  return s.split(/\r?\n/).filter(l=>l.length>0).map(l => l.split(',').map(c => c.replace(/^"|"$/g, '')))
}

function toMarkdownTable(rows: string[][]) {
  if (rows.length === 0) return ''
  const esc = (s: string) => s.replace(/\|/g, '\\|')
  const cols = Math.max(...rows.map(r => r.length))
  const padRow = (r: string[]) => [...r, ...Array(cols - r.length).fill('')]
  const header = padRow(rows[0]).map(esc)
  const align = Array(cols).fill('---')
  const body = rows.slice(1).map(r => padRow(r).map(esc))
  const join = (r: string[]) => `| ${r.join(' | ')} |`
  return [join(header), join(align), ...body.map(join)].join('\n')
}

function fromMarkdownTable(md: string): string {
  const lines = md.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  if (lines.length < 2) return ''
  const rows = lines.map(l => l.replace(/^\||\|$/g, '').split('|').map(c => c.trim().replace(/\\\|/g, '|')))
  const header = rows[0]
  const body = rows.slice(2)
  const toCSV = (r: string[]) => r.map(c => /[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c).join(',')
  return [toCSV(header), ...body.map(toCSV)].join('\n')
}

export default function Page() {
  const [csv, setCsv] = useState('Name,Age\nAlice,30\nBob,25')
  const [md, setMd] = useState('')

  const mdOut = useMemo(() => toMarkdownTable(parseCSV(csv)), [csv])
  const csvOut = useMemo(() => (md ? fromMarkdownTable(md) : ''), [md])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-500 mb-1">CSV → Markdown 表格</div>
          <Textarea variant="simple" className="h-48" value={csv} onChange={(e)=>setCsv(e.target.value)} />
          <Textarea variant="simple" className="h-48 mt-2" value={mdOut} readOnly />
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-1">Markdown 表格 → CSV</div>
          <Textarea variant="simple" className="h-48" value={md} onChange={(e)=>setMd(e.target.value)} placeholder="粘贴 Markdown 表格文本" />
          <Textarea variant="simple" className="h-48 mt-2" value={csvOut} readOnly />
        </div>
      </div>
    </div>
  )
}
