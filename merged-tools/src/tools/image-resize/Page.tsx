import { useEffect, useRef, useState } from 'react'

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    const r = new FileReader()
    r.onload = () => { img.src = String(r.result) }
    r.onerror = reject
    r.readAsDataURL(file)
  })
}

export default function Page(){
  const [file, setFile] = useState<File|null>(null)
  const [img, setImg] = useState<HTMLImageElement|null>(null)
  const [w, setW] = useState(800)
  const [h, setH] = useState(600)
  const [keep, setKeep] = useState(true)
  const [fmt, setFmt] = useState<'image/png'|'image/jpeg'|'image/webp'>('image/jpeg')
  const [q, setQ] = useState(0.85)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => { (async () => { if (file) setImg(await loadImage(file)) })() }, [file])
  useEffect(() => { if (!img) return; if (keep){ const r = img.width / img.height; setH(Math.round(w / r)) } }, [w, keep, img])
  useEffect(() => { if (!img) return; if (keep){ const r = img.width / img.height; setW(Math.round(h * r)) } }, [h])

  useEffect(() => {
    const c = canvasRef.current; if (!c || !img) return
    c.width = Math.max(1, w); c.height = Math.max(1, h)
    const ctx = c.getContext('2d')!
    ctx.clearRect(0,0,c.width,c.height)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, 0, 0, c.width, c.height)
  }, [img, w, h])

  function download(){
    const c = canvasRef.current; if (!c) return
    c.toBlob((blob) => {
      if (!blob) return
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = (file?.name?.replace(/\.[^.]+$/,'') || 'image') + (fmt==='image/png'?'.png':fmt==='image/webp'?'.webp':'.jpg')
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    }, fmt, fmt==='image/png'? undefined : q)
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">选择图片</h3>
        <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
        <div className="flex flex-wrap gap-2 items-center">
          <label>宽 <input type="number" className="w-24 rounded bg-slate-800 p-2" value={w} onChange={(e)=>setW(Number(e.target.value)||0)} /></label>
          <label>高 <input type="number" className="w-24 rounded bg-slate-800 p-2" value={h} onChange={(e)=>setH(Number(e.target.value)||0)} /></label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={keep} onChange={(e)=>setKeep(e.target.checked)} />保持比例</label>
          <select className="rounded bg-slate-800 p-2" value={fmt} onChange={(e)=>setFmt(e.target.value as any)}>
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
          </select>
          {fmt!=='image/png' && (
            <label>质量 <input type="number" step={0.01} min={0} max={1} className="w-24 rounded bg-slate-800 p-2" value={q} onChange={(e)=>setQ(Number(e.target.value)||0)} /></label>
          )}
          <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50" onClick={download} disabled={!img}>导出</button>
        </div>
      </section>
      <section>
        <canvas ref={canvasRef} className="max-w-full rounded border border-slate-700" />
      </section>
    </div>
  )
}
