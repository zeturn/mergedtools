import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'

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

export default function Page() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    (async () => {
      setText('')
      if (!file) return
      const img = await fileToImage(file)
      const canvas = canvasRef.current ?? document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const max = 1200
      const scale = Math.min(1, max / img.width, max / img.height)
      const w = Math.max(1, Math.round(img.width * scale))
      const h = Math.max(1, Math.round(img.height * scale))
      canvas.width = w
      canvas.height = h
      ctx.drawImage(img, 0, 0, w, h)
      const imageData = ctx.getImageData(0, 0, w, h)
      const res = jsQR(imageData.data, w, h)
      if (res && res.data) setText(res.data)
      else setText('未识别到二维码')
    })()
  }, [file])

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
      <canvas ref={canvasRef} className="max-w-full bg-white rounded" />
      <div className="rounded bg-slate-800 p-3 font-mono whitespace-pre-wrap">{text}</div>
    </div>
  )
}
