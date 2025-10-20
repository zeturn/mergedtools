import { useState } from 'react'

type Item = { name: string; img: HTMLImageElement; w: number; h: number }

export default function Page(){
  const [items, setItems] = useState<Item[]>([])
  const [cols, setCols] = useState<number|''>('')
  const [gap, setGap] = useState(2)
  const [bg, setBg] = useState('#00000000')
  const [sheetUrl, setSheetUrl] = useState('')
  const [json, setJson] = useState('')

  async function pick(e: React.ChangeEvent<HTMLInputElement>){
    const files = e.target.files; if(!files) return
    const list: Item[] = []
    for (const f of Array.from(files)){
      const img = new Image(); img.src = URL.createObjectURL(f)
      await new Promise(res=> img.onload=res)
      list.push({ name: f.name, img, w: img.naturalWidth, h: img.naturalHeight })
    }
    setItems(list)
  }

  function hexToRgba(h: string){
    // #RRGGBB[AA] or #RRGGBBAA
    const s = h.replace('#','')
    const r = parseInt(s.slice(0,2),16), g = parseInt(s.slice(2,4),16), b = parseInt(s.slice(4,6),16)
    const a = s.length>=8? parseInt(s.slice(6,8),16)/255 : (s.length===6? 1:0)
    return `rgba(${r},${g},${b},${a})`
  }

  function pack(){
    if(items.length===0) return
    const c = typeof cols==='number' && cols>0 ? cols : items.length
    const cellW = Math.max(...items.map(i=>i.w))
    const cellH = Math.max(...items.map(i=>i.h))
    const rows = Math.ceil(items.length / c)
    const width = c*cellW + (c-1)*gap
    const height = rows*cellH + (rows-1)*gap
    const canvas = document.createElement('canvas'); canvas.width=width; canvas.height=height
    const ctx = canvas.getContext('2d')!
    if (bg && bg!=='#00000000'){ ctx.fillStyle = hexToRgba(bg); ctx.fillRect(0,0,width,height) }
    const mapping: Record<string,{x:number,y:number,w:number,h:number}> = {}
    items.forEach((it, idx)=>{
      const col = idx % c, row = Math.floor(idx / c)
      const x = col*(cellW+gap), y = row*(cellH+gap)
      ctx.drawImage(it.img, x, y)
      mapping[it.name] = { x, y, w: it.w, h: it.h }
    })
    canvas.toBlob(b=>{ if (!b) return; setSheetUrl(URL.createObjectURL(b)); setJson(JSON.stringify(mapping, null, 2)) }, 'image/png')
  }

  return (
    <div className="space-y-3">
      <input type="file" accept="image/*" multiple onChange={pick} />
      <div className="flex gap-2 items-center flex-wrap">
        <span className="text-sm text-slate-400">列数（留空=单行）</span>
        <input type="number" className="w-24 rounded bg-slate-800 p-2" value={cols} onChange={(e)=>setCols(e.target.value? Number(e.target.value): '')} />
        <span className="text-sm text-slate-400">间距</span>
        <input type="number" className="w-24 rounded bg-slate-800 p-2" value={gap} onChange={(e)=>setGap(Number(e.target.value))} />
        <span className="text-sm text-slate-400">背景</span>
        <input type="text" className="w-36 rounded bg-slate-800 p-2" value={bg} onChange={(e)=>setBg(e.target.value)} placeholder="#RRGGBBAA" />
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={pack} disabled={items.length===0}>生成</button>
      </div>
      {sheetUrl && <img src={sheetUrl} className="max-w-full rounded" />}
      {json && <textarea className="w-full min-h-24 rounded bg-slate-900 p-2 font-mono" value={json} onChange={(e)=>setJson(e.target.value)} />}
    </div>
  )
}
