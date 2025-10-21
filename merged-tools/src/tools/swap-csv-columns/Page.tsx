import { useMemo, useState } from 'react'
import * as Papa from 'papaparse'
import { Textarea } from '../../components/Input'

function swapCols(data: any[][], a: number, b: number) {
  return data.map((row) => {
    const copy = row.slice()
    const max = Math.max(a, b)
    while (copy.length <= max) copy.push('')
    const t = copy[a]
    copy[a] = copy[b]
    copy[b] = t
    return copy
  })
}

export default function Page() {
  const [input, setInput] = useState('name,age,city\nAlice,18,Paris\nBob,20,Rome')
  const [useHeader, setUseHeader] = useState(true)
  const [colA, setColA] = useState('name')
  const [colB, setColB] = useState('city')

  const output = useMemo(() => {
    try {
      const parsed = Papa.parse<string[]>(input.trim(), { delimiter: ',', skipEmptyLines: false })
      const rows = parsed.data as any[][]
      if (!rows.length) return ''
      let aIdx = 0
      let bIdx = 1
      if (useHeader) {
        const header = rows[0] as string[]
        const ha = header.indexOf(colA)
        const hb = header.indexOf(colB)
        if (ha < 0 || hb < 0) return '未找到列名，请检查表头' 
        aIdx = ha
        bIdx = hb
      } else {
        aIdx = Math.max(0, parseInt(colA || '0', 10))
        bIdx = Math.max(0, parseInt(colB || '1', 10))
      }
      const swapped = swapCols(rows, aIdx, bIdx)
      return Papa.unparse(swapped)
    } catch (e: any) {
      return String(e?.message || e)
    }
  }, [input, useHeader, colA, colB])

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <label className="flex items-center gap-2"><input type="checkbox" checked={useHeader} onChange={e=>setUseHeader(e.target.checked)} /> 使用表头</label>
        {useHeader ? (
          <div className="grid grid-cols-2 gap-2">
            <input className="input" placeholder="列名 A" value={colA} onChange={e=>setColA(e.target.value)} />
            <input className="input" placeholder="列名 B" value={colB} onChange={e=>setColB(e.target.value)} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <input className="input" placeholder="列号 A(从0)" value={colA} onChange={e=>setColA(e.target.value)} />
            <input className="input" placeholder="列号 B(从0)" value={colB} onChange={e=>setColB(e.target.value)} />
          </div>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Textarea variant="simple" className="h-52" value={input} onChange={e=>setInput(e.target.value)} />
        <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{output}</pre>
      </div>
    </div>
  )
}
