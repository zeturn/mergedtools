export type ToolItem = {
  id: string
  name: string
  desc?: string
  license?: string
}

import { Link } from 'react-router-dom'

export type ToolCard = {
  id: string
  name: string
  desc?: string
  license?: string
}

export default function ToolsList({ items, onHover }: { items: ToolCard[]; onHover?: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((t) => (
        <Link
          key={t.id}
          to={`/${t.id}`}
          onMouseEnter={() => onHover?.(t.id)}
          className="group rounded-xl bg-slate-800/80 ring-1 ring-slate-700 p-5 shadow block hover:ring-slate-500 hover:shadow-lg transition"
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/25 border border-indigo-400/30 flex items-center justify-center text-indigo-200 font-semibold">
              {t.name?.[0] ?? 'T'}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold group-hover:text-white truncate">{t.name}</h3>
              <p className="text-sm text-slate-400 mt-1 line-clamp-2">{t.desc}</p>
              {t.license && <div className="mt-2 text-xs text-slate-500">{t.license}</div>}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
