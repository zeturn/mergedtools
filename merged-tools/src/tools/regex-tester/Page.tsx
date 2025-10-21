import { useMemo, useState } from 'react'
import Input from '../../components/Input'

function safeRegex(pattern: string, flags: string): RegExp | null {
  try {
    return new RegExp(pattern, flags)
  } catch {
    return null
  }
}

function highlightMatches(text: string, re: RegExp | null) {
  if (!re) return [text]
  const parts: (string | { m: string })[] = []
  if (!re.global) {
    const m = text.match(re)
    if (!m) return [text]
    const idx = m.index ?? 0
    const before = text.slice(0, idx)
    const match = m[0]
    const after = text.slice(idx + match.length)
    if (before) parts.push(before)
    parts.push({ m: match })
    if (after) parts.push(after)
    return parts
  }
  let last = 0
  re.lastIndex = 0
  for (const m of text.matchAll(re)) {
    const idx = m.index ?? 0
    if (idx > last) parts.push(text.slice(last, idx))
    parts.push({ m: m[0] })
    last = idx + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

export default function Page() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [input, setInput] = useState('Hello 123\nWorld 456')
  const [replace, setReplace] = useState('[$&]')

  const re = useMemo(() => safeRegex(pattern, flags), [pattern, flags])
  const error = useMemo(() => (pattern ? (re ? '' : '正则语法错误或非法标志') : ''), [pattern, re])

  const parts = useMemo(() => highlightMatches(input, re), [input, re])
  const groups = useMemo(() => {
    if (!re) return [] as string[][]
    if (!re.global) {
      const m = input.match(re)
      return m ? [Array.from(m)] : []
    }
    const out: string[][] = []
    re.lastIndex = 0
    for (const m of input.matchAll(re)) out.push(Array.from(m))
    return out
  }, [input, re])

  const replaced = useMemo(() => {
    if (!re) return ''
    try { return input.replace(re, replace) } catch { return '' }
  }, [input, re, replace])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="grid grid-cols-[auto,1fr] items-center gap-2">
            <label className="text-sm">正则</label>
            <Input  variant="simple" className="" placeholder="例如: (\\w+)\\s+(\\d+)" value={pattern} onChange={e=>setPattern(e.target.value)} />
            <label className="text-sm">标志</label>
            <Input  variant="simple" className="" placeholder="g i m s u y" value={flags} onChange={e=>setFlags(e.target.value.replace(/[^gimsuy]/g,''))} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <label className="block text-sm mb-1">输入文本</label>
            <textarea className="w-full h-40 border rounded px-2 py-1 font-mono" value={input} onChange={e=>setInput(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">替换模板</label>
            <Input  variant="simple" className="" value={replace} onChange={e=>setReplace(e.target.value)} />
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">匹配高亮</label>
            <div className="border rounded p-2 whitespace-pre-wrap font-mono">
              {parts.map((p, i) => typeof p === 'string'
                ? <span key={i}>{p}</span>
                : <mark key={i} className="bg-yellow-200 text-inherit">{p.m}</mark>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">分组</label>
            {groups.length === 0 ? (
              <p className="text-gray-500 text-sm">无匹配</p>
            ) : (
              <div className="space-y-2">
                {groups.map((g, idx) => (
                  <div key={idx} className="border rounded p-2 overflow-auto">
                    <div className="text-xs text-gray-500 mb-1">匹配 {idx+1}</div>
                    <table className="text-sm">
                      <tbody>
                        {g.map((val, gi) => (
                          <tr key={gi}>
                            <td className="pr-3 text-gray-500">${'${'}gi{'}'}</td>
                            <td className="font-mono break-all">{val === undefined ? 'undefined' : val === '' ? '""' : val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">替换预览</label>
            <div className="border rounded p-2 whitespace-pre-wrap font-mono">{replaced}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
