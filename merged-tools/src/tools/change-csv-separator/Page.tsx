import { useMemo, useState } from 'react'
import Papa from 'papaparse'

export default function Page(){
  const [input, setInput] = useState('a,b\n1,2\n3,4')
  const [inSep, setInSep] = useState(',')
  const [outSep, setOutSep] = useState(';')
  const [quote, setQuote] = useState('"')
  const [newline, setNewline] = useState('\n')

  const out = useMemo(()=>{
    try{
      const parsed = Papa.parse<string[]>(input, { delimiter: inSep, newline: guessNewline(input), skipEmptyLines: false })
      if (parsed.errors?.length) return `解析错误：${parsed.errors[0].message}`
      return Papa.unparse(parsed.data as any, { delimiter: outSep, quotes: false, quoteChar: quote || '"', newline: newline || '\n' })
    }catch(e: any){
      return String(e?.message || e)
    }
  }, [input, inSep, outSep, quote, newline])

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-4 gap-3">
        <L label="输入分隔符"><input className="input" value={inSep} onChange={e=>setInSep(e.target.value)} /></L>
        <L label="输出分隔符"><input className="input" value={outSep} onChange={e=>setOutSep(e.target.value)} /></L>
        <L label="输出引号"><input className="input" value={quote} onChange={e=>setQuote(e.target.value)} /></L>
        <L label="输出换行"><input className="input" value={newline} onChange={e=>setNewline(e.target.value)} placeholder={'\n 或 \r\n'} /></L>
      </div>
      <textarea className="textarea h-48" value={input} onChange={e=>setInput(e.target.value)} />
      <div className="grid md:grid-cols-2 gap-4">
        <section>
          <h3 className="font-semibold mb-2">预览</h3>
          <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{out}</pre>
        </section>
        <section>
          <h3 className="font-semibold mb-2">表格</h3>
          <Table csv={out} sep={outSep} />
        </section>
      </div>
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

function guessNewline(s: string){
  if (s.includes('\r\n')) return '\r\n'
  return '\n'
}

function Table({ csv, sep }: { csv: string; sep: string }){
  const data = useMemo(()=> Papa.parse<string[]>(csv, { delimiter: sep, skipEmptyLines: false }).data as string[][], [csv, sep])
  return (
    <div className="overflow-auto border border-slate-700 rounded">
      <table className="min-w-full text-sm">
        <tbody>
          {data.map((row, i)=>(
            <tr key={i} className={i%2? 'bg-slate-800/40' : ''}>
              {row.map((cell, j)=> <td key={j} className="px-2 py-1 border border-slate-700 whitespace-pre">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
