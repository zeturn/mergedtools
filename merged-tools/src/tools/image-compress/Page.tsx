import { useState } from 'react'
function bytesToSize(n: number){ if(n<1024) return n+' B'; if(n<1024*1024) return (n/1024).toFixed(1)+' KB'; return (n/1024/1024).toFixed(2)+' MB' }

export default function Page(){
  const [file, setFile] = useState<File|null>(null)
  const [quality, setQuality] = useState(0.8)
  const [maxW, setMaxW] = useState<number|''>('')
  const [maxH, setMaxH] = useState<number|''>('')
  const [mime, setMime] = useState<'image/jpeg'|'image/webp'|'image/png'>('image/jpeg')
  const [outUrl, setOutUrl] = useState<string>('')
  const [inSize, setInSize] = useState<number>(0)
  const [outSize, setOutSize] = useState<number>(0)

  async function run(){
    if(!file) return
    setInSize(file.size)
    const img = new Image()
    img.src = URL.createObjectURL(file)
    await new Promise(res=> img.onload = res)
    let w = img.naturalWidth, h = img.naturalHeight
    if (typeof maxW==='number' && w>maxW){ h = Math.round(h*maxW/w); w = maxW }
    if (typeof maxH==='number' && h>maxH){ w = Math.round(w*maxH/h); h = maxH }
    const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, w, h)
    const blob = await new Promise<Blob>((resolve)=> canvas.toBlob(b=> resolve(b!), mime, quality))
    setOutSize(blob.size)
    setOutUrl(URL.createObjectURL(blob))
  }

  return (
    <div className="space-y-3">
      <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
      <div className="flex gap-2 items-center flex-wrap">
        <label className="text-sm text-slate-400">输出格式</label>
        <select className="rounded bg-slate-800 p-2" value={mime} onChange={(e)=>setMime(e.target.value as any)}>
          <option value="image/jpeg">JPEG</option>
          <option value="image/webp">WebP</option>
          <option value="image/png">PNG</option>
        </select>
        <label className="text-sm text-slate-400">质量</label>
        <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e)=>setQuality(Number(e.target.value))} />
        <label className="text-sm text-slate-400">最大宽</label>
        <input type="number" className="w-28 rounded bg-slate-800 p-2" value={maxW} onChange={(e)=>setMaxW(e.target.value? Number(e.target.value): '')} />
        <label className="text-sm text-slate-400">最大高</label>
        <input type="number" className="w-28 rounded bg-slate-800 p-2" value={maxH} onChange={(e)=>setMaxH(e.target.value? Number(e.target.value): '')} />
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={run} disabled={!file}>开始</button>
      </div>
      {(inSize>0) && <div className="text-sm text-slate-400">原始体积：{bytesToSize(inSize)}</div>}
      {(outSize>0) && <div className="text-sm text-slate-400">输出体积：{bytesToSize(outSize)}（压缩比 {(outSize/(inSize||1)*100).toFixed(1)}%）</div>}
      {outUrl && <img src={outUrl} alt="output" className="max-w-full rounded" />}
    </div>
  )
}
