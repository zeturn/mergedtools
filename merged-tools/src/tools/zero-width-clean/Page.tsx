import { useMemo, useState } from 'react'

const INVISIBLE = /[\u200B\u200C\u200D\uFEFF\u2066\u2067\u2068\u2069\u202A-\u202E]/g // ZWSP/ZWNJ/ZWJ/BOM/LRI/RLI/FSI/PDI + bidi overrides

function analyze(s: string) {
  const counts = new Map<string, number>()
  for (const ch of s.match(INVISIBLE) ?? []) counts.set(ch, (counts.get(ch) ?? 0) + 1)
  return counts
}

export default function Page() {
  const [input, setInput] = useState('Hi\u200B there\u200D!')
  const counts = useMemo(() => analyze(input), [input])
  const cleaned = useMemo(() => input.replace(INVISIBLE, ''), [input])

  const copy = async () => { await navigator.clipboard.writeText(cleaned) }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">输入文本</label>
            <textarea className="w-full h-48 border rounded px-2 py-1" value={input} onChange={e=>setInput(e.target.value)} />
          </div>
          <div className="text-sm text-gray-600">
            将移除：ZWSP(\u200B)、ZWNJ(\u200C)、ZWJ(\u200D)、BOM(\uFEFF)、LRI/RLI/FSI/PDI(\u2066-\u2069)、bidi 控制(\u202A-\u202E)
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">检测统计</label>
            {counts.size === 0 ? (
              <p className="text-gray-500 text-sm">未检测到零宽/不可见字符</p>
            ) : (
              <ul className="text-sm list-disc pl-5">
                {[...counts.entries()].map(([ch, n]) => (
                  <li key={ch}>
                    U+{ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4,'0')} × {n}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={copy}>复制清理结果</button>
          </div>
          <textarea className="w-full h-40 border rounded px-2 py-1 font-mono" readOnly value={cleaned} />
        </div>
      </div>
    </div>
  )
}
