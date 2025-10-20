import { useMemo, useState } from 'react'

const TRACK_PARAMS = new Set([
  'utm_source','utm_medium','utm_campaign','utm_term','utm_content','utm_id','utm_reader','utm_name','utm_cid','utm_brand','utm_social','utm_social-type',
  'gclid','fbclid','mc_cid','mc_eid','igshid','msclkid','yclid','utm_referrer','spm','scm','utm_sq','pk_campaign','pk_kwd','vero_id','wickedid'
])

function cleanOne(u: string, extraStrip: string[], extraKeep: string[]): string {
  try {
    const url = new URL(u)
    const keep = new Set(extraKeep.map(s=>s.trim()).filter(Boolean))
    const strip = new Set([...TRACK_PARAMS, ...extraStrip.map(s=>s.trim()).filter(Boolean)].map(s=>s.toLowerCase()))
    for (const [k] of url.searchParams) {
      const key = k.toLowerCase()
      if (keep.has(k) || keep.has(key)) continue
      if (strip.has(key)) url.searchParams.delete(k)
    }
    return url.toString()
  } catch {
    return u
  }
}

export default function Page() {
  const [input, setInput] = useState('https://example.com/?utm_source=twitter&foo=1#hash')
  const [extraStrip, setExtraStrip] = useState('')
  const [extraKeep, setExtraKeep] = useState('')

  const lines = useMemo(() => input.split(/\r?\n/), [input])
  const result = useMemo(() => {
    const strip = extraStrip.split(',').map(s=>s.trim()).filter(Boolean)
    const keep = extraKeep.split(',').map(s=>s.trim()).filter(Boolean)
    return lines.map(l => cleanOne(l.trim(), strip, keep)).join('\n')
  }, [lines, extraStrip, extraKeep])

  const copy = async () => { await navigator.clipboard.writeText(result) }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">输入 URL（每行一个）</label>
            <textarea className="w-full h-48 border rounded px-2 py-1 font-mono" value={input} onChange={e=>setInput(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="text-sm">额外移除参数（逗号分隔）
              <input className="mt-1 w-full border rounded px-2 py-1" value={extraStrip} onChange={e=>setExtraStrip(e.target.value)} />
            </label>
            <label className="text-sm">强制保留参数（逗号分隔）
              <input className="mt-1 w-full border rounded px-2 py-1" value={extraKeep} onChange={e=>setExtraKeep(e.target.value)} />
            </label>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={copy}>复制结果</button>
          </div>
          <textarea className="w-full h-48 border rounded px-2 py-1 font-mono" readOnly value={result} />
        </div>
      </div>
    </div>
  )
}
