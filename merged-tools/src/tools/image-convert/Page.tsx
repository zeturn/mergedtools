import { useEffect, useRef, useState } from 'react'

type Format = 'image/png' | 'image/jpeg' | 'image/webp'

async function fileToImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.src = url
    await new Promise((res, rej) => { img.onload = () => res(null); img.onerror = rej })
    return img
  } finally {
    URL.revokeObjectURL(url)
  }
}

function drawToCanvas(img: HTMLImageElement, maxW: number, maxH: number): HTMLCanvasElement {
  const scale = Math.min(1, maxW / img.width, maxH / img.height)
  const w = Math.max(1, Math.round(img.width * scale))
  const h = Math.max(1, Math.round(img.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, w, h)
  return canvas
}

export default function Page() {
  const [file, setFile] = useState<File | null>(null)
  const [format, setFormat] = useState<Format>('image/webp')
  const [quality, setQuality] = useState(0.85)
  const [maxW, setMaxW] = useState(2000)
  const [maxH, setMaxH] = useState(2000)
  const [outUrl, setOutUrl] = useState<string>('')
  const [info, setInfo] = useState<string>('')
  const previewRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    let revoked = ''
    ;(async () => {
      if (!file) { setOutUrl(''); setInfo(''); return }
      try {
        const img = await fileToImage(file)
        const canvas = drawToCanvas(img, maxW, maxH)
        const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, format, format === 'image/png' ? undefined : quality))
        if (!blob) { setOutUrl(''); setInfo('转换失败'); return }
        const url = URL.createObjectURL(blob)
        revoked = url
        setOutUrl(url)
        setInfo(`${img.width}x${img.height} → ${canvas.width}x${canvas.height}, ${(blob.size/1024).toFixed(1)} KB`)
      } catch {
        setOutUrl('')
        setInfo('转换失败')
      }
    })()
    return () => { if (revoked) URL.revokeObjectURL(revoked) }
  }, [file, format, quality, maxW, maxH])

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <div className="grid md:grid-cols-2 gap-4">
        <label className="space-y-1">
          <span className="block text-sm text-slate-400">输出格式</span>
          <select className="w-full rounded bg-slate-800 p-2" value={format} onChange={(e) => setFormat(e.target.value as Format)}>
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/webp">WebP</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="block text-sm text-slate-400">质量（JPEG/WebP）: {Math.round(quality*100)}</span>
          <input type="range" min={10} max={100} value={Math.round(quality*100)} onChange={(e) => setQuality(Number(e.target.value)/100)} />
        </label>
        <label className="space-y-1">
          <span className="block text-sm text-slate-400">最大宽</span>
          <input type="number" className="w-full rounded bg-slate-800 p-2" value={maxW} onChange={(e) => setMaxW(Number(e.target.value))} />
        </label>
        <label className="space-y-1">
          <span className="block text-sm text-slate-400">最大高</span>
          <input type="number" className="w-full rounded bg-slate-800 p-2" value={maxH} onChange={(e) => setMaxH(Number(e.target.value))} />
        </label>
      </div>
      {outUrl && (
        <div className="space-y-2">
          <div className="text-sm text-slate-400">{info}</div>
          <img ref={previewRef} src={outUrl} className="max-h-80 rounded bg-white" />
          <a href={outUrl} download={`converted.${format.split('/')[1]}`} className="inline-block px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500">下载</a>
        </div>
      )}
    </div>
  )
}
