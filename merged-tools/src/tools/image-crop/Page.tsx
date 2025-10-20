import { useEffect, useState } from 'react'

async function fileToImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.src = url
    await new Promise((res, rej) => { img.onload = () => res(null); img.onerror = rej })
    return img
  } finally { URL.revokeObjectURL(url) }
}

export default function Page() {
  const [file, setFile] = useState<File | null>(null)
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [w, setW] = useState(100)
  const [h, setH] = useState(100)
  const [out, setOut] = useState<string>('')

  useEffect(() => { (async ()=> { if (file) setImg(await fileToImage(file)); else setImg(null) })() }, [file])
  useEffect(() => {
    if (!img) { setOut(''); return }
    const canvas = document.createElement('canvas')
    const cx = Math.max(0, Math.min(img.width, x))
    const cy = Math.max(0, Math.min(img.height, y))
    const cw = Math.max(1, Math.min(img.width - cx, w))
    const ch = Math.max(1, Math.min(img.height - cy, h))
    canvas.width = cw; canvas.height = ch
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, cx, cy, cw, ch, 0, 0, cw, ch)
    canvas.toBlob((b)=> { if (!b) return; const url = URL.createObjectURL(b); setOut(url) }, 'image/png')
  }, [img, x, y, w, h])

  return (
    <div className="space-y-3">
      <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
      <div className="grid md:grid-cols-4 gap-3">
        <label className="space-y-1"><span className="text-xs text-slate-400">x</span><input type="number" className="w-full rounded bg-slate-800 p-2" value={x} onChange={(e)=>setX(Number(e.target.value))} /></label>
        <label className="space-y-1"><span className="text-xs text-slate-400">y</span><input type="number" className="w-full rounded bg-slate-800 p-2" value={y} onChange={(e)=>setY(Number(e.target.value))} /></label>
        <label className="space-y-1"><span className="text-xs text-slate-400">w</span><input type="number" className="w-full rounded bg-slate-800 p-2" value={w} onChange={(e)=>setW(Number(e.target.value))} /></label>
        <label className="space-y-1"><span className="text-xs text-slate-400">h</span><input type="number" className="w-full rounded bg-slate-800 p-2" value={h} onChange={(e)=>setH(Number(e.target.value))} /></label>
      </div>
      {img && <div className="text-sm text-slate-400">原图尺寸：{img.width}x{img.height}</div>}
      {out && <div className="space-y-2"><img src={out} className="max-h-80 rounded bg-white" /><a href={out} download="crop.png" className="inline-block px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500">下载</a></div>}
    </div>
  )
}
