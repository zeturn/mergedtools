import { useEffect, useMemo, useRef, useState } from 'react'
import { useShortcuts } from '../shortcuts/context'
import { tools } from '../tools/registry'
import { useNavigate } from 'react-router-dom'

export default function QuickSwitcher() {
  const { switcherOpen, setSwitcherOpen } = useShortcuts()
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(()=>{
    if (switcherOpen) {
      setTimeout(()=> inputRef.current?.focus(), 0)
    } else {
      setQ('')
    }
  }, [switcherOpen])

  const items = useMemo(()=>{
    const t = q.trim().toLowerCase()
    return tools
      .map(tl => ({ id: tl.meta.id, name: tl.meta.name, desc: tl.meta.desc ?? '' }))
      .filter(x => !t || `${x.name} ${x.desc} ${x.id}`.toLowerCase().includes(t))
      .slice(0, 20)
  }, [q])

  const onEnter = (id?: string) => {
    if (!id) return
    nav(`/${id}`)
    setSwitcherOpen(false)
  }

  if (!switcherOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh]">
      <div className="absolute inset-0 bg-black/50" onClick={()=>setSwitcherOpen(false)} />
      <div className="relative z-10 w-[min(720px,92vw)] rounded-xl border border-slate-700 bg-slate-900 shadow-xl">
        <div className="p-3 border-b border-slate-700">
          <input ref={inputRef} value={q} onChange={(e)=>setQ(e.target.value)} placeholder="搜索工具名称/描述/ID…" className="w-full rounded bg-slate-800/80 p-2 ring-1 ring-slate-700 focus:outline-none focus:ring-slate-500" />
        </div>
        <ul className="max-h-[50vh] overflow-auto p-2">
          {items.map((i) => (
            <li key={i.id}>
              <button onClick={()=>onEnter(i.id)} className="w-full text-left rounded-lg px-3 py-2 hover:bg-slate-800/70">
                <div className="font-medium">{i.name}</div>
                {i.desc && <div className="text-xs text-slate-400 line-clamp-1">{i.desc}</div>}
              </button>
            </li>
          ))}
          {items.length === 0 && (
            <li className="text-center text-slate-500 py-6">无匹配工具</li>
          )}
        </ul>
      </div>
    </div>
  )
}
