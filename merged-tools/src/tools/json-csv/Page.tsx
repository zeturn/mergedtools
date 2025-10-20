import { useMemo, useState } from 'react'

function toCsv(rows: any[], sep: string, eol: string, includeHeader: boolean): string {
  const headers = Array.from(rows.reduce<Set<string>>((s, r) => { Object.keys(r||{}).forEach(k=>s.add(k)); return s }, new Set<string>()).values())
  const escape = (v: any) => {
    if (v === null || v === undefined) return ''
    const s = typeof v === 'string' ? v : JSON.stringify(v)
    const needsQuote = s.includes('"') || s.includes('\n') || s.includes('\r') || s.includes(sep) || s.startsWith(' ') || s.endsWith(' ')
    const body = s.replace(/"/g, '""')
    return needsQuote ? `"${body}"` : body
  }
  const out: string[] = []
  if (includeHeader) out.push(headers.map(escape).join(sep))
  for (const r of rows) out.push(headers.map(h => escape((r||{})[h])).join(sep))
  return out.join(eol)
}

export default function Page() {
  const [json, setJson] = useState('[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]')
  const [sep, setSep] = useState(',')
  const [eol, setEol] = useState('\n')
  const [includeHeader, setIncludeHeader] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const csv = useMemo(() => {
    try {
      setError(null)
      const val = JSON.parse(json)
      if (!Array.isArray(val)) throw new Error('输入必须是对象数组')
      return toCsv(val, sep, eol === '\\n' ? '\n' : eol === '\\r\n' ? '\r\n' : eol, includeHeader)
    } catch (e: any) {
      setError(e.message || String(e))
      return ''
    }
  }, [json, sep, eol, includeHeader])

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="space-y-2">
        <h3 className="text-lg font-semibold">JSON（对象数组）</h3>
        <textarea className="w-full h-60 rounded bg-slate-800 p-2 font-mono" value={json} onChange={(e)=>setJson(e.target.value)} />
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <label className="flex items-center gap-1">分隔符<input className="w-16 rounded bg-slate-800 p-1" value={sep} onChange={(e)=>setSep(e.target.value)} /></label>
          <label className="flex items-center gap-1">行结束<select className="rounded bg-slate-800 p-1" value={eol} onChange={(e)=>setEol(e.target.value)}>
            <option value="\n">\\n</option>
            <option value="\r\n">\\r\\n</option>
          </select></label>
          <label className="flex items-center gap-1"><input type="checkbox" checked={includeHeader} onChange={(e)=>setIncludeHeader(e.target.checked)} />包含表头</label>
        </div>
        {error && <div className="text-amber-400 text-sm">{error}</div>}
      </section>
      <section className="space-y-2">
        <h3 className="text-lg font-semibold">CSV 输出</h3>
        <textarea className="w-full h-60 rounded bg-slate-800 p-2 font-mono" readOnly value={csv} />
        <a className="inline-block px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500" href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`} download="output.csv">下载 CSV</a>
      </section>
    </div>
  )
}
