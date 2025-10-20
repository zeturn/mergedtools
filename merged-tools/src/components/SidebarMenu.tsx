import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { tools } from '../tools/registry'

export default function SidebarMenu() {
  const [q, setQ] = useState('')
  const loc = useLocation()

  const grouped = useMemo(() => {
    const g = new Map<string, { id: string; name: string; desc?: string }[]>()
    for (const t of tools) {
      const text = `${t.meta.name} ${t.meta.desc ?? ''} ${t.meta.id}`.toLowerCase()
      if (q && !text.includes(q.toLowerCase())) continue
      const tag = t.meta.tags?.[0] ?? '其他'
      if (!g.has(tag)) g.set(tag, [])
      g.get(tag)!.push({ id: t.meta.id, name: t.meta.name, desc: t.meta.desc })
    }
    // 排序: 类别名 -> 工具名
    return Array.from(g.entries()).sort((a,b)=>a[0].localeCompare(b[0])).map(([cat, list])=>[cat, list.sort((x,y)=>x.name.localeCompare(y.name))] as const)
  }, [q])

  return (
    <aside className="w-72 lg:w-80 shrink-0">
      <div className="sticky top-3 sm:top-4 lg:top-6">
        <div className="flex flex-col gap-3" style={{height:'calc(100vh - 5rem)'}}>
          <input id="global-search" value={q} onChange={(e)=>setQ(e.target.value)} placeholder="搜索工具…" className="w-full rounded bg-slate-800/80 border border-slate-700 p-2" />
          <div className="overflow-auto pr-1 custom-scrollbar min-h-0">
            <div className="space-y-4">
          {grouped.map(([cat, list]) => (
            <div key={cat}>
              <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">{cat}</div>
              <ul className="space-y-1">
                {list.map((i) => {
                  const active = loc.pathname === `/${i.id}`
                  return (
                    <li key={i.id}>
                      <Link to={`/${i.id}`} className={`block px-2 py-1 rounded ring-1 ${active ? 'bg-slate-700 ring-slate-600' : 'bg-slate-800/80 hover:bg-slate-700 ring-slate-800'}`}>
                        <div className="text-sm">{i.name}</div>
                        {i.desc && <div className="text-xs text-slate-400 line-clamp-1">{i.desc}</div>}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
            </div>
          </div>
        </div>
        </div>
    </aside>
  )
}
