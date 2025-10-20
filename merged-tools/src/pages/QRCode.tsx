import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

export default function QRCodePage() {
  const [text, setText] = useState('https://example.com')
  const [size, setSize] = useState(192)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    QRCode.toCanvas(canvas, text || ' ', { width: size, margin: 1, errorCorrectionLevel: 'M' }).catch(() => {})
  }, [text, size])

  return (
    <div className="space-y-4">
      <input className="w-full rounded bg-slate-800 p-2" value={text} onChange={(e) => setText(e.target.value)} placeholder="输入文本/链接" />
      <div className="flex items-center gap-3">
        <label className="text-sm text-slate-400">尺寸</label>
        <input type="range" min={128} max={512} value={size} onChange={(e) => setSize(Number(e.target.value))} />
        <div className="text-sm text-slate-400 w-12">{size}px</div>
      </div>
      <div className="p-4 bg-white rounded inline-block"><canvas ref={canvasRef} /></div>
    </div>
  )
}
