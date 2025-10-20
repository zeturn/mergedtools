import { useEffect, useRef, useState } from 'react'
import JsBarcode from 'jsbarcode'

type Format = 'CODE128' | 'EAN13'

type Item = { text: string; ref: React.RefObject<HTMLCanvasElement | null> }

export default function Page(){
  const [list, setList] = useState<string>('123456789012\nHELLO-001\nHELLO-002')
  const [format, setFormat] = useState<Format>('CODE128')
  const [width, setWidth] = useState(2)
  const [height, setHeight] = useState(80)
  const [displayValue, setDisplayValue] = useState(true)

  const items: Item[] = list.split(/\r?\n/).filter(Boolean).map(t=> ({ text: t.trim(), ref: useRef<HTMLCanvasElement>(null) }))

  useEffect(()=>{
    for (const it of items){
      const canvas = it.ref.current; if (!canvas) continue
      try{
        JsBarcode(canvas, it.text, { format, width, height, displayValue })
      }catch{/* ignore invalid content for format */}
    }
  }, [list, format, width, height, displayValue])

  function downloadOne(it: Item){
    const c = it.ref.current; if (!c) return
    c.toBlob(b=>{ if(!b) return; const url = URL.createObjectURL(b); const a = document.createElement('a'); a.href=url; a.download=`${it.text}.png`; a.click(); URL.revokeObjectURL(url) })
  }

  function downloadAll(){
    for (const it of items){ downloadOne(it) }
  }

  return (
    <div className="space-y-3">
      <textarea className="w-full min-h-40 rounded bg-slate-900 p-2 font-mono" value={list} onChange={(e)=>setList(e.target.value)} />
      <div className="flex gap-3 items-center flex-wrap">
        <label className="text-sm text-slate-400">格式
          <select className="ml-2 bg-slate-800 rounded p-1" value={format} onChange={(e)=>setFormat(e.target.value as Format)}>
            <option value="CODE128">CODE128</option>
            <option value="EAN13">EAN13</option>
          </select>
        </label>
        <label className="text-sm text-slate-400">条宽<input type="number" className="ml-2 w-20 bg-slate-800 rounded p-1" value={width} onChange={(e)=>setWidth(Number(e.target.value))} /></label>
        <label className="text-sm text-slate-400">高度<input type="number" className="ml-2 w-24 bg-slate-800 rounded p-1" value={height} onChange={(e)=>setHeight(Number(e.target.value))} /></label>
        <label className="text-sm text-slate-400 flex items-center gap-2"><input type="checkbox" checked={displayValue} onChange={(e)=>setDisplayValue(e.target.checked)} />显示文本</label>
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={downloadAll}>下载全部</button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map(it=> (
          <div key={it.text} className="bg-slate-900 rounded p-3">
            <div className="text-xs text-slate-400 mb-1">{it.text}</div>
            <canvas ref={it.ref} className="bg-white rounded" />
            <div className="mt-2">
              <button className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={()=>downloadOne(it)}>下载</button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400">提示：EAN13 仅支持 12 位数字（自动校验位）。如需 ZIP 打包导出，可后续加入压缩依赖。</p>
    </div>
  )
}
