import ToolsList from '../components/ToolsList'
import { tools, getToolById } from '../tools/registry'
import SearchBar from '../components/SearchBar'
import { useMemo, useState } from 'react'

export default function Menu() {
  const [q, setQ] = useState('')
  const grouped = useMemo(() => {
    const g = new Map<string, { id: string; name: string; desc?: string; license?: string }[]>()
    for (const t of tools) {
      const tag = t.meta.tags?.[0] ?? '其他'
      if (q && !(`${t.meta.name} ${t.meta.desc ?? ''} ${t.meta.id}`.toLowerCase().includes(q.toLowerCase()))) continue
      if (!g.has(tag)) g.set(tag, [])
      g.get(tag)!.push({ id: t.meta.id, name: t.meta.name, desc: t.meta.desc, license: t.meta.license })
    }
    return Array.from(g.entries())
  }, [q])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-cyan-200 to-emerald-200">工具目录</h1>
        <p className="text-slate-400 mt-1">按类别浏览或搜索所有工具。</p>
      </div>
      <SearchBar value={q} onChange={setQ} />
      {grouped.map(([cat, list]) => (
        <section key={cat} className="space-y-3">
          <h2 className="text-2xl font-semibold">{cat}</h2>
          <ToolsList items={list} onHover={(id) => getToolById(id)?.prefetch?.()} />
        </section>
      ))}
    </div>
  )
}
