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
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/40 to-slate-800/20 backdrop-blur-sm p-4 shadow-xl" style={{height:'calc(100vh - 5rem)'}}>
          {/* Search bar with icon */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              id="global-search" 
              value={q} 
              onChange={(e)=>setQ(e.target.value)} 
              placeholder="搜索工具…" 
              className="w-full rounded-lg bg-slate-900/50 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 pl-10 pr-4 py-2.5 text-sm transition-all outline-none" 
            />
          </div>
          
          {/* Tools list */}
          <div className="overflow-auto pr-2 custom-scrollbar min-h-0">
            <div className="space-y-5">
              {grouped.map(([cat, list]) => (
                <div key={cat}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                    <div className="text-xs uppercase tracking-wide text-slate-400 font-semibold">{cat}</div>
                  </div>
                  <ul className="space-y-1.5">
                    {list.map((i) => {
                      const active = loc.pathname === `/${i.id}`
                      return (
                        <li key={i.id}>
                          <Link 
                            to={`/${i.id}`} 
                            className={`block px-3 py-2.5 rounded-lg transition-all ${
                              active 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 border border-indigo-500' 
                                : 'bg-slate-900/30 hover:bg-slate-800/60 text-slate-200 border border-slate-700/50 hover:border-slate-600'
                            }`}
                          >
                            <div className="text-sm font-medium">{i.name}</div>
                            {i.desc && <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{i.desc}</div>}
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
