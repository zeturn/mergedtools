import { useMemo, useState } from 'react'

function basicSlug(s: string, sep: string, lower: boolean) {
  // normalize + remove diacritics
  let out = s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  // replace non-word with separator, collapse repeats
  out = out.replace(/[^\p{L}\p{N}]+/gu, sep)
  out = out.replace(new RegExp(`${sep}{2,}`, 'g'), sep)
  // trim separators
  const reTrim = new RegExp(`^${sep}|${sep}$`, 'g')
  out = out.replace(reTrim, '')
  if (lower) out = out.toLowerCase()
  return out
}

export default function Page() {
  const [input, setInput] = useState('Hello, 世界! 这是一段标题——Slugify 测试')
  const [sep, setSep] = useState('-')
  const [lower, setLower] = useState(true)

  const slug = useMemo(() => basicSlug(input, sep, lower), [input, sep, lower])

  const copy = async () => { await navigator.clipboard.writeText(slug) }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">原文本</label>
            <textarea className="w-full h-40 border rounded px-2 py-1" value={input} onChange={e=>setInput(e.target.value)} />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm">分隔符
              <input className="ml-2 w-24 border rounded px-2 py-1" value={sep} maxLength={2} onChange={e=>setSep(e.target.value || '-')} />
            </label>
            <label className="text-sm inline-flex items-center gap-2">
              <input type="checkbox" checked={lower} onChange={e=>setLower(e.target.checked)} /> 小写
            </label>
            <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={copy}>复制</button>
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">结果</label>
          <input className="w-full border rounded px-2 py-1 font-mono" readOnly value={slug} />
        </div>
      </div>
    </div>
  )
}
 
