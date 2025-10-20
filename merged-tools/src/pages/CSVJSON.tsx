import { useMemo, useState } from 'react'
import Papa from 'papaparse'

function csvToJson(csv: string) {
  if (!csv.trim()) return ''
  const res = Papa.parse(csv, { header: true, skipEmptyLines: true })
  return JSON.stringify(res.data, null, 2)
}

function jsonToCsv(json: string) {
  try {
    const data = JSON.parse(json)
    return Papa.unparse(data)
  } catch {
    return ''
  }
}

export default function CSVJSONPage() {
  const [csv, setCsv] = useState('name,age\nTom,18\nAna,22')
  const [json, setJson] = useState('')
  const outJson = useMemo(() => csvToJson(csv), [csv])
  const outCsv = useMemo(() => jsonToCsv(json), [json])

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">CSV → JSON</h2>
        <textarea className="w-full h-48 rounded bg-slate-800 p-3 font-mono" value={csv} onChange={(e) => setCsv(e.target.value)} />
        <pre className="rounded bg-slate-800 p-3 font-mono overflow-auto whitespace-pre-wrap">{outJson}</pre>
      </section>
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">JSON → CSV</h2>
        <textarea className="w-full h-48 rounded bg-slate-800 p-3 font-mono" value={json} onChange={(e) => setJson(e.target.value)} />
        <pre className="rounded bg-slate-800 p-3 font-mono overflow-auto whitespace-pre-wrap">{outCsv}</pre>
      </section>
    </div>
  )
}
