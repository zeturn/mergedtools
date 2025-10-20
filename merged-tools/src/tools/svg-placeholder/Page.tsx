import { useMemo, useState } from 'react'

export default function Page(){
  const [w, setW] = useState(800)
  const [h, setH] = useState(400)
  const [bg, setBg] = useState('#e2e8f0')
  const [fg, setFg] = useState('#475569')
  const [text, setText] = useState('800×400')
  const [fontSize, setFontSize] = useState(32)

  const svg = useMemo(()=> buildSvg({ w, h, bg, fg, text, fontSize }), [w,h,bg,fg,text,fontSize])

  function download(){
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href=url; a.download=`placeholder-${w}x${h}.svg`; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3 items-end">
        <label className="text-sm text-slate-400">宽<input type="number" className="w-full bg-slate-800 rounded p-2" value={w} onChange={(e)=>setW(Number(e.target.value))} /></label>
        <label className="text-sm text-slate-400">高<input type="number" className="w-full bg-slate-800 rounded p-2" value={h} onChange={(e)=>setH(Number(e.target.value))} /></label>
        <label className="text-sm text-slate-400">背景<input type="color" className="w-full bg-slate-800 rounded p-2" value={bg} onChange={(e)=>setBg(e.target.value)} /></label>
        <label className="text-sm text-slate-400">前景<input type="color" className="w-full bg-slate-800 rounded p-2" value={fg} onChange={(e)=>setFg(e.target.value)} /></label>
        <label className="text-sm text-slate-400 col-span-2">文字<input className="w-full bg-slate-800 rounded p-2" value={text} onChange={(e)=>setText(e.target.value)} /></label>
        <label className="text-sm text-slate-400">字号<input type="number" className="w-full bg-slate-800 rounded p-2" value={fontSize} onChange={(e)=>setFontSize(Number(e.target.value))} /></label>
      </div>
      <div className="bg-slate-900 rounded p-3 overflow-auto">
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={download}>下载 SVG</button>
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={()=>navigator.clipboard.writeText(svg)}>复制 SVG 文本</button>
      </div>
    </div>
  )
}

function buildSvg({ w, h, bg, fg, text, fontSize }:{ w:number; h:number; bg:string; fg:string; text:string; fontSize:number }){
  const esc = (s:string)=> s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
  const x = w/2, y = h/2
  return `<?xml version="1.0" encoding="UTF-8"?>\n`+
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`+
  `<rect width="100%" height="100%" fill="${bg}"/>`+
  `<text x="${x}" y="${y}" fill="${fg}" font-family="system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, sans-serif" font-size="${fontSize}" text-anchor="middle" dominant-baseline="middle">${esc(text)}</text>`+
  `</svg>`
}
