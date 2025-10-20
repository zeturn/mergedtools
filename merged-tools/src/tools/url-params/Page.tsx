import { useMemo, useState } from 'react'

export default function Page() {
  const [url, setUrl] = useState('https://example.com?a=1&b=2')
  const [paramLines, setParamLines] = useState('c=3\nd=4\nb=over')
  const [mode, setMode] = useState<'add'|'remove'|'replace'>('add')
  const [sortKeys, setSortKeys] = useState(true)
  const [keepExisting, setKeepExisting] = useState(true)

  const result = useMemo(() => {
    try {
      const u = new URL(url)
      const sp = new URLSearchParams(u.search)
      const items = paramLines.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
      const pairs = items.map(l => {
        const idx = l.indexOf('=')
        if (idx === -1) return [l, ''] as const
        return [l.slice(0, idx), l.slice(idx + 1)] as const
      })
      if (mode === 'remove') {
        for (const [k] of pairs) sp.delete(k)
      } else if (mode === 'replace') {
        if (!keepExisting) u.search = ''
        const tmp = keepExisting ? sp : new URLSearchParams()
        for (const [k, v] of pairs) { tmp.set(k, v) }
        u.search = tmp.toString()
      } else {
        for (const [k, v] of pairs) sp.append(k, v)
        u.search = sp.toString()
      }
      if (sortKeys && u.search) {
        const sp2 = new URLSearchParams(u.search)
        const entries = Array.from(sp2.entries()).sort(([a],[b]) => a.localeCompare(b))
        const sp3 = new URLSearchParams()
        for (const [k, v] of entries) sp3.append(k, v)
        u.search = sp3.toString()
      }
      return u.toString()
    } catch (e: any) {
      return '错误：' + (e.message || String(e))
    }
  }, [url, paramLines, mode, sortKeys, keepExisting])

  return (
    <div className="space-y-4">
      <input className="input" value={url} onChange={(e)=>setUrl(e.target.value)} />
      <div className="flex flex-wrap items-center gap-2">
        <select className="select" value={mode} onChange={(e)=>setMode(e.target.value as any)}>
          <option value="add">添加（append）</option>
          <option value="remove">删除（按 key）</option>
          <option value="replace">替换（set）</option>
        </select>
        {mode==='replace' && (
          <label className="flex items-center gap-2 text-sm text-gray-500"><input type="checkbox" checked={keepExisting} onChange={(e)=>setKeepExisting(e.target.checked)} /> 保留原有参数</label>
        )}
        <label className="flex items-center gap-2 text-sm text-gray-500"><input type="checkbox" checked={sortKeys} onChange={(e)=>setSortKeys(e.target.checked)} /> 按 key 排序</label>
      </div>
      <textarea className="textarea h-40" value={paramLines} onChange={(e)=>setParamLines(e.target.value)} placeholder="key=value 每行一条" />
      <textarea className="textarea h-32" value={result} readOnly />
    </div>
  )
}
