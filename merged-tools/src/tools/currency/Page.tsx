import { useEffect, useMemo, useState } from 'react'

type Rates = Record<string, number> // base = 1.0 for a chosen currency

const LS_KEY = 'currency-rates'

export default function Page(){
  const [base, setBase] = useState('USD')
  const [rates, setRates] = useState<Rates>({ USD: 1, CNY: 7.0, EUR: 0.9, JPY: 150 })
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('CNY')
  const [amount, setAmount] = useState(1)

  useEffect(()=>{
    try{
      const saved = localStorage.getItem(LS_KEY)
      if (saved){ const obj = JSON.parse(saved); if (obj.base && obj.rates) { setBase(obj.base); setRates(obj.rates) } }
    }catch{}
  }, [])

  useEffect(()=>{
    localStorage.setItem(LS_KEY, JSON.stringify({ base, rates }))
  }, [base, rates])

  const allCodes = useMemo(()=> Object.keys(rates).sort(), [rates])

  function setRate(code: string, v: number){ setRates(prev=> ({ ...prev, [code]: v })) }

  function addCode(){
    const code = prompt('新增币种代码（如 GBP）')?.toUpperCase().trim()
    if (!code) return
    if (rates[code]!=null) return alert('已存在')
    setRates(prev=> ({ ...prev, [code]: 1 }))
  }

  function removeCode(code: string){
    if (!confirm(`删除 ${code}?`)) return
    const r = { ...rates }; delete r[code]; setRates(r)
  }

  function convert(v: number, from: string, to: string){
    if (from===to) return v
    const rFrom = rates[from]; const rTo = rates[to]
    if (!(Number.isFinite(rFrom) && Number.isFinite(rTo))) return NaN
    // rates are relative to base: 1 base = rates[code] code
    // convert from->base->to
    const inBase = v / rFrom
    return inBase * rTo
  }

  function importCfg(){
    const txt = prompt('粘贴配置 JSON（{"base":"USD","rates":{...}}）')
    if (!txt) return
    try{ const obj = JSON.parse(txt); if(obj.base&&obj.rates){ setBase(obj.base); setRates(obj.rates) }}catch{ alert('JSON 无效') }
  }
  function exportCfg(){
    const blob = new Blob([JSON.stringify({ base, rates }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'rates.json'; a.click(); URL.revokeObjectURL(url)
  }

  const out = convert(amount, from, to)

  return (
    <div className="space-y-3">
      <div className="flex gap-3 items-center flex-wrap">
        <label className="text-sm text-slate-400">基准货币
          <select className="ml-2 bg-slate-800 rounded p-1" value={base} onChange={(e)=>setBase(e.target.value)}>
            {allCodes.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={importCfg}>导入配置</button>
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={exportCfg}>导出配置</button>
      </div>
      <div className="flex gap-3 items-end flex-wrap">
        <div>
          <div className="text-sm text-slate-400">从</div>
          <select className="bg-slate-800 rounded p-2" value={from} onChange={(e)=>setFrom(e.target.value)}>
            {allCodes.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <div className="text-sm text-slate-400">到</div>
          <select className="bg-slate-800 rounded p-2" value={to} onChange={(e)=>setTo(e.target.value)}>
            {allCodes.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <div className="text-sm text-slate-400">金额</div>
          <input type="number" className="bg-slate-800 rounded p-2 w-40" value={amount} onChange={(e)=>setAmount(Number(e.target.value))} />
        </div>
        <div className="px-3 py-2 rounded bg-slate-800 min-w-40">{Number.isFinite(out)? out.toFixed(4): '—'}</div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-400">汇率表（相对于 {base}）</div>
          <button className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={addCode}>新增币种</button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {allCodes.map(code=> (
            <div key={code} className="flex items-center gap-2 bg-slate-900 rounded p-2">
              <div className="w-16">{code}</div>
              <input type="number" step="0.0001" className="flex-1 bg-slate-800 rounded p-2" value={rates[code]}
                onChange={(e)=>setRate(code, Number(e.target.value))} />
              <button className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={()=>removeCode(code)}>删除</button>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-slate-400">注意：本工具不联网，数据来源取决于你填入的汇率，请定期更新。</p>
    </div>
  )
}
