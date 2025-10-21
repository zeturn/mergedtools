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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="border-b border-slate-700/50 pb-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-orange-300">CSV ⇄ JSON 转换</h1>
        <p className="text-slate-400 mt-2">在 CSV 和 JSON 格式之间互相转换</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* CSV to JSON */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
            <h2 className="text-xl font-semibold text-slate-100">CSV → JSON</h2>
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">CSV 输入</label>
            <textarea 
              className="w-full h-48 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 p-4 font-mono text-sm transition-all outline-none resize-none" 
              value={csv} 
              onChange={(e) => setCsv(e.target.value)}
              placeholder="name,age&#10;Tom,18&#10;Ana,22"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm text-slate-400">JSON 输出</label>
              <button
                onClick={() => copyToClipboard(outJson)}
                className="text-xs px-3 py-1 rounded-md bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 transition-colors"
              >
                复制
              </button>
            </div>
            <pre className="rounded-lg bg-slate-900/50 border border-slate-700 p-4 font-mono text-sm overflow-auto whitespace-pre-wrap text-emerald-300 min-h-[200px]">
              {outJson || <span className="text-slate-500">JSON 结果将显示在这里</span>}
            </pre>
          </div>
        </section>

        {/* JSON to CSV */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full" />
            <h2 className="text-xl font-semibold text-slate-100">JSON → CSV</h2>
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">JSON 输入</label>
            <textarea 
              className="w-full h-48 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 p-4 font-mono text-sm transition-all outline-none resize-none" 
              value={json} 
              onChange={(e) => setJson(e.target.value)}
              placeholder='[{"name":"Tom","age":18}]'
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm text-slate-400">CSV 输出</label>
              <button
                onClick={() => copyToClipboard(outCsv)}
                className="text-xs px-3 py-1 rounded-md bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/30 transition-colors"
              >
                复制
              </button>
            </div>
            <pre className="rounded-lg bg-slate-900/50 border border-slate-700 p-4 font-mono text-sm overflow-auto whitespace-pre-wrap text-emerald-300 min-h-[200px]">
              {outCsv || <span className="text-slate-500">CSV 结果将显示在这里</span>}
            </pre>
          </div>
        </section>
      </div>

      {/* Info tip */}
      <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-4">
        <div className="flex gap-3">
          <div className="text-amber-400 text-lg">💡</div>
          <div className="text-sm text-slate-300">
            <p className="font-medium text-amber-300">格式说明</p>
            <ul className="text-slate-400 mt-1 space-y-1">
              <li>• CSV 第一行将作为列名（header）</li>
              <li>• JSON 需要是对象数组格式</li>
              <li>• 自动处理空行和格式化</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
