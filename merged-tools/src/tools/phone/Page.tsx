import { useMemo, useState } from 'react'
import Input from '../../components/Input'

// 极简清理与E.164拼接（注意：未引入 libphonenumber，准确性有限）
function normalize(raw: string) {
  // 保留+和数字
  return raw.replace(/[^+\d]/g, '')
}

function e164(raw: string, defaultCC: string) {
  const s = normalize(raw)
  if (!s) return ''
  if (s.startsWith('+')) return s
  const cc = defaultCC.replace(/[^\d]/g, '')
  return cc ? `+${cc}${s}` : s
}

export default function Page() {
  const [input, setInput] = useState('+86 138-0013-8000\n(202) 555-0100')
  const [defaultCC, setDefaultCC] = useState('86')

  const lines = useMemo(()=> input.split(/\r?\n/), [input])
  const out = useMemo(()=> lines.map(l=> e164(l.trim(), defaultCC)).join('\n'), [lines, defaultCC])

  const copy = async () => { await navigator.clipboard.writeText(out) }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">输入（每行一个）</label>
            <textarea className="w-full h-48 border rounded px-2 py-1 font-mono" value={input} onChange={e=>setInput(e.target.value)} />
          </div>
          <label className="text-sm">默认国家码
            <Input  variant="simple" className="" value={defaultCC} onChange={e=>setDefaultCC(e.target.value)} />
          </label>
        </div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={copy}>复制结果</button>
          </div>
          <textarea className="w-full h-48 border rounded px-2 py-1 font-mono" readOnly value={out} />
          <p className="text-xs text-gray-500">说明：为保持纯前端与轻量，未使用大型号码库，无法覆盖特定国家复杂规则，但 E.164 拼接在大多数情形下可用。</p>
        </div>
      </div>
    </div>
  )
}
