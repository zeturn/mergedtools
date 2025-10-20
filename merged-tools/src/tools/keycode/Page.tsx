import { useEffect, useState } from 'react'

type Row = { time: string; key: string; code: string; keyCode: number; ctrl: boolean; shift: boolean; alt: boolean; meta: boolean }

export default function Page(){
  const [rows, setRows] = useState<Row[]>([])

  useEffect(()=>{
    function on(e: KeyboardEvent){
      const r: Row = { time: new Date().toLocaleTimeString(), key: e.key, code: e.code, keyCode: (e as any).keyCode||0, ctrl: e.ctrlKey, shift: e.shiftKey, alt: e.altKey, meta: e.metaKey }
      setRows(prev=> [r, ...prev].slice(0,100))
    }
    window.addEventListener('keydown', on)
    return ()=> window.removeEventListener('keydown', on)
  }, [])

  return (
    <div className="space-y-3">
      <div className="text-sm text-slate-400">在此页面按任意键，记录会出现在下方（保留最近 100 条）。</div>
      <div className="overflow-auto border border-slate-700 rounded">
        <table className="text-sm w-full">
          <thead><tr>
            <th className="text-left px-2 py-1">时间</th>
            <th className="text-left px-2 py-1">key</th>
            <th className="text-left px-2 py-1">code</th>
            <th className="text-left px-2 py-1">keyCode</th>
            <th className="text-left px-2 py-1">Ctrl</th>
            <th className="text-left px-2 py-1">Shift</th>
            <th className="text-left px-2 py-1">Alt</th>
            <th className="text-left px-2 py-1">Meta</th>
          </tr></thead>
          <tbody>
            {rows.map((r,i)=> (
              <tr key={i} className={i%2? 'bg-slate-900':'bg-slate-950'}>
                <td className="px-2 py-1">{r.time}</td>
                <td className="px-2 py-1">{r.key}</td>
                <td className="px-2 py-1">{r.code}</td>
                <td className="px-2 py-1">{r.keyCode}</td>
                <td className="px-2 py-1">{r.ctrl? '✓':''}</td>
                <td className="px-2 py-1">{r.shift? '✓':''}</td>
                <td className="px-2 py-1">{r.alt? '✓':''}</td>
                <td className="px-2 py-1">{r.meta? '✓':''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
