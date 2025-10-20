import { useRef, useState } from 'react'

export default function Page(){
  const ref = useRef<HTMLDivElement>(null)
  const [html, setHtml] = useState('')
  function cmd(c: string, val?: string){ document.execCommand(c, false, val) }
  function sync(){ setHtml(ref.current?.innerHTML || '') }
  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        <button className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={()=>cmd('bold')}>B</button>
        <button className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={()=>cmd('italic')}>I</button>
        <button className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={()=>cmd('underline')}>U</button>
        <button className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={()=>cmd('insertUnorderedList')}>• list</button>
        <button className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={()=>cmd('insertOrderedList')}>1. list</button>
        <button className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={()=>{ const url = prompt('链接 URL'); if (url) cmd('createLink', url) }}>link</button>
        <button className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={()=>{ ref.current && (ref.current.innerHTML=''); sync() }}>清空</button>
        <button className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={()=>navigator.clipboard?.writeText(html)}>复制 HTML</button>
      </div>
      <div ref={ref} onInput={sync} contentEditable className="min-h-48 rounded bg-white text-black p-3"></div>
      <div className="rounded bg-slate-900 p-2 font-mono whitespace-pre-wrap break-words">{html || '<空>'}</div>
    </div>
  )
}
