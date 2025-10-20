import { useMemo, useState } from 'react'
import Papa from 'papaparse'

export default function Page(){
  const [input, setInput] = useState('id,name\n1,Alice\n2,Bob')
  const [root, setRoot] = useState('rows')
  const [row, setRow] = useState('row')

  const xml = useMemo(()=>{
    try{
      const parsed = Papa.parse<string[]>(input, { header: true, skipEmptyLines: true })
      const rows = parsed.data as any[]
      const body = rows.map(r => {
        const fields = Object.entries(r).map(([k, v]) => `<${escapeXmlName(String(k))}>${escapeXml(String(v ?? ''))}</${escapeXmlName(String(k))}>`).join('')
        return `<${row}>${fields}</${row}>`
      }).join('\n')
      return `<${root}>\n${body}\n</${root}>`
    }catch(e: any){
      return String(e?.message || e)
    }
  }, [input, root, row])

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-3">
        <L label="根元素名"><input className="input" value={root} onChange={e=>setRoot(e.target.value)} /></L>
        <L label="行元素名"><input className="input" value={row} onChange={e=>setRow(e.target.value)} /></L>
      </div>
      <textarea className="textarea h-48" value={input} onChange={e=>setInput(e.target.value)} />
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{xml}</pre>
    </div>
  )
}

function L({ label, children }: { label: string; children: React.ReactNode }){
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-slate-300">{label}</span>
      {children}
    </label>
  )
}

function escapeXml(s: string){
  return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')
}
function escapeXmlName(s: string){
  return s.replace(/[^A-Za-z0-9_.:-]/g, '_') || 'field'
}
