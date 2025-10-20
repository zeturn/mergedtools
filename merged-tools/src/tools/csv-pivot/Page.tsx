import { useMemo, useState } from 'react'
import Papa from 'papaparse'

type Row = Record<string, string | number>
type Agg = 'count' | 'sum' | 'avg' | 'min' | 'max'

export default function Page(){
  const [raw, setRaw] = useState('')
  const [rows, setRows] = useState<Row[]>([])
  const [rowField, setRowField] = useState('')
  const [colField, setColField] = useState('')
  const [valField, setValField] = useState('')
  const [agg, setAgg] = useState<Agg>('count')

  function loadFile(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0]; if(!f) return
    const reader = new FileReader(); reader.onload = () => setRaw(String(reader.result||'')); reader.readAsText(f)
  }

  function parse(){
    const res = Papa.parse<string[]>(raw, { header: false, skipEmptyLines: true })
    if (res.errors?.length) {
      alert('CSV 解析错误: '+ res.errors[0].message)
      return
    }
    const data = res.data as string[][]
    if (!data.length) { setRows([]); return }
    const headers = data[0]
    const out: Row[] = []
    for (let i=1;i<data.length;i++){
      const row: Row = {}
      headers.forEach((h,idx)=>{ row[h] = parseMaybeNumber(data[i][idx]) })
      out.push(row)
    }
    setRows(out)
    if (!rowField) setRowField(headers[0]||'')
    if (!colField) setColField(headers[1]||'')
    if (!valField) setValField(headers[2]||headers[1]||headers[0]||'')
  }

  const fields = useMemo(()=> rows.length? Object.keys(rows[0]): [], [rows])

  const result = useMemo(()=>{
    if (!rows.length || !rowField || !colField) return { headers: [], table: [] as Array<Array<string|number>> }
    const rowsSet = new Set<string>()
    const colsSet = new Set<string>()
    for (const r of rows){ rowsSet.add(String(r[rowField]??'')); colsSet.add(String(r[colField]??'')) }
    const rKeys = Array.from(rowsSet)
    const cKeys = Array.from(colsSet)

    const grid: Record<string, number[]> = {}
    const ensure = (rk:string, ck:string) => {
      const key = rk+'\u0001'+ck
      if (!grid[key]) grid[key] = []
      return grid[key]
    }
    for (const r of rows){
      const rk = String(r[rowField]??'')
      const ck = String(r[colField]??'')
      let v = 1
      if (agg !== 'count') {
        const rawV = r[valField]
        v = Number(rawV)
        if (!Number.isFinite(v)) continue
      }
      ensure(rk, ck).push(v)
    }
    const headers = [''].concat(cKeys)
    const table: Array<Array<string|number>> = rKeys.map(rk=>{
      const mapped = cKeys.map(ck=> formatAgg(aggregate(grid[rk+'\u0001'+ck]||[], agg), agg))
      const row: (string|number)[] = [rk]
      row.push(...mapped)
      return row
    })
    return { headers, table }
  }, [rows, rowField, colField, valField, agg])

  function exportCsv(){
    const lines = [result.headers.join(',')]
    for (const r of result.table){ lines.push(r.join(',')) }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'pivot.csv'; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center flex-wrap">
        <input type="file" accept=".csv,text/csv" onChange={loadFile} />
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={parse}>解析</button>
      </div>
      <textarea className="w-full min-h-40 rounded bg-slate-900 p-2 font-mono" placeholder="粘贴 CSV 文本或选择文件" value={raw} onChange={(e)=>setRaw(e.target.value)} />
      {!!rows.length && (
        <div className="flex gap-3 items-center flex-wrap">
          <label className="text-sm text-slate-400">行字段
            <select className="ml-2 bg-slate-800 rounded p-1" value={rowField} onChange={(e)=>setRowField(e.target.value)}>
              <option value="">选择</option>
              {fields.map(f=> <option key={f} value={f}>{f}</option>)}
            </select>
          </label>
          <label className="text-sm text-slate-400">列字段
            <select className="ml-2 bg-slate-800 rounded p-1" value={colField} onChange={(e)=>setColField(e.target.value)}>
              <option value="">选择</option>
              {fields.map(f=> <option key={f} value={f}>{f}</option>)}
            </select>
          </label>
          <label className="text-sm text-slate-400">值字段
            <select className="ml-2 bg-slate-800 rounded p-1" value={valField} onChange={(e)=>setValField(e.target.value)} disabled={agg==='count'}>
              <option value="">选择</option>
              {fields.map(f=> <option key={f} value={f}>{f}</option>)}
            </select>
          </label>
          <label className="text-sm text-slate-400">聚合
            <select className="ml-2 bg-slate-800 rounded p-1" value={agg} onChange={(e)=>setAgg(e.target.value as Agg)}>
              <option value="count">Count</option>
              <option value="sum">Sum</option>
              <option value="avg">Avg</option>
              <option value="min">Min</option>
              <option value="max">Max</option>
            </select>
          </label>
          <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={exportCsv}>导出结果 CSV</button>
        </div>
      )}
      {result.headers.length>0 && (
        <div className="overflow-auto border border-slate-700 rounded">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {result.headers.map((h,i)=> <th key={i} className="bg-slate-800 text-left px-2 py-1 whitespace-nowrap">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {result.table.map((r,ri)=> (
                <tr key={ri} className={ri%2? 'bg-slate-900':'bg-slate-950'}>
                  {r.map((c,ci)=> <td key={ci} className="px-2 py-1 whitespace-nowrap">{String(c)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function parseMaybeNumber(s: string): number|string{
  if (s===''||s==null) return ''
  const n = Number(s)
  return Number.isFinite(n)? n: s
}

function aggregate(arr: number[], agg: Agg): number{
  if (arr.length===0) return NaN
  switch(agg){
    case 'count': return arr.length
    case 'sum': return arr.reduce((a,b)=>a+b,0)
    case 'avg': return arr.reduce((a,b)=>a+b,0)/arr.length
    case 'min': return Math.min(...arr)
    case 'max': return Math.max(...arr)
  }
}

function formatAgg(v: number, agg: Agg): string|number{
  if (!Number.isFinite(v)) return ''
  if (agg==='count') return v
  const s = v.toFixed(6)
  return s.replace(/\.0+$/,'').replace(/(\..*?)0+$/,'$1')
}
