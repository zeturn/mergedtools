import { useMemo, useState } from 'react'

type Mode =
  | 'first-char'
  | 'last-char'
  | 'length'
  | 'regex'
  | 'split-part'
  | 'slice'
  | 'prefix'
  | 'suffix'

function makeKeyFn(mode: Mode, param: string, ignoreCase: boolean) {
  return (x: string) => {
    let s = ignoreCase ? x.toLowerCase() : x
    switch (mode) {
      case 'first-char':
        return s[0] ?? ''
      case 'last-char':
        return s[s.length - 1] ?? ''
      case 'length':
        return String(s.length)
      case 'regex': {
        // param: pattern[,flags[,groupIndex]]
        const [pat = '', flags = '', groupIdxStr = '0'] = param.split(',')
        try {
          const re = new RegExp(pat, flags)
          const m = s.match(re)
          if (!m) return '(no-match)'
          const gi = Math.max(0, Number.parseInt(groupIdxStr.trim(), 10) || 0)
          return m[gi] ?? '(no-match)'
        } catch {
          return '(re-error)'
        }
      }
      case 'split-part': {
        // param: delim,index  (index: supports negative)
        const [delim = '', idxStr = '0'] = param.split(',')
        const parts = delim ? s.split(delim) : s.split(/\s+/)
        let idx = Number.parseInt(idxStr.trim(), 10)
        if (Number.isNaN(idx)) idx = 0
        if (idx < 0) idx = parts.length + idx
        return parts[idx] ?? ''
      }
      case 'slice': {
        // param: start,end  (supports negative like Array.prototype.slice)
        const [a = '0', b = ''] = param.split(',')
        let start = Number.parseInt(a.trim(), 10)
        let end = b === '' ? undefined : Number.parseInt(b.trim(), 10)
        if (Number.isNaN(start)) start = 0
        if (end !== undefined && Number.isNaN(end)) end = undefined
        return s.slice(start, end)
      }
      case 'prefix': {
        const n = Number.parseInt(param.trim(), 10) || 0
        return s.slice(0, Math.max(0, n))
      }
      case 'suffix': {
        const n = Number.parseInt(param.trim(), 10) || 0
        return n <= 0 ? '' : s.slice(-n)
      }
      default:
        return s
    }
  }
}

export default function Page() {
  const [input, setInput] = useState('a1 a2 b1 b2 a3')
  const [sep, setSep] = useState(' ')
  const [mode, setMode] = useState<Mode>('first-char')
  const [param, setParam] = useState('')
  const [ignoreCase, setIgnoreCase] = useState(false)

  const out = useMemo(() => {
    try {
      const items = (sep ? input.split(sep) : input.split(/\s+/)).filter(Boolean)
      const keyFn = makeKeyFn(mode, param, ignoreCase)
      const map = new Map<string, string[]>()
      for (const it of items) {
        const k = String(keyFn(it))
        const arr = map.get(k) || []
        arr.push(it)
        map.set(k, arr)
      }
      return [...map.entries()]
        .map(([k, arr]) => `${k}: ${arr.join(sep || ' ')}`)
        .join('\n')
    } catch (e: any) {
      return e.message || String(e)
    }
  }, [input, sep, mode, param, ignoreCase])

  return (
    <div className="space-y-3">
      <textarea
        className="textarea h-36"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="grid md:grid-cols-2 gap-2">
        <input
          className="input"
          placeholder="分隔符(留空=空白)"
          value={sep}
          onChange={(e) => setSep(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-2">
          <select
            className="select"
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
            title="分组键类型"
          >
            <option value="first-char">首字符</option>
            <option value="last-char">尾字符</option>
            <option value="length">长度</option>
            <option value="regex">正则捕获</option>
            <option value="split-part">按分隔符取第N段</option>
            <option value="slice">子串范围 slice(start,end)</option>
            <option value="prefix">前缀 N</option>
            <option value="suffix">后缀 N</option>
          </select>
          <input
            className="input"
            placeholder={
              mode === 'regex'
                ? 'pattern[,flags[,groupIndex]]'
                : mode === 'split-part'
                ? 'delim,index'
                : mode === 'slice'
                ? 'start,end'
                : mode === 'prefix' || mode === 'suffix'
                ? 'N'
                : '（可选参数）'
            }
            value={param}
            onChange={(e) => setParam(e.target.value)}
          />
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={(e) => setIgnoreCase(e.target.checked)}
          />
          忽略大小写
        </label>
      </div>
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{out}</pre>
    </div>
  )
}
