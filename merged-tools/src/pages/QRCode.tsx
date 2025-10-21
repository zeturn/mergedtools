import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

export default function QRCodePage() {
  const [text, setText] = useState('https://example.com')
  const [size, setSize] = useState(256)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    QRCode.toCanvas(canvas, text || ' ', { width: size, margin: 1, errorCorrectionLevel: 'M' }).catch(() => {})
  }, [text, size])

  const downloadQR = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="border-b border-slate-700/50 pb-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-300">二维码生成器</h1>
        <p className="text-slate-400 mt-2">将文本或链接转换为二维码</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_auto] gap-8">
        {/* Input section */}
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">输入内容</label>
            <textarea 
              className="w-full h-32 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 p-4 transition-all outline-none resize-none" 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              placeholder="输入文本、链接或其他内容..."
            />
          </div>

          {/* Size control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm text-slate-400">二维码尺寸</label>
              <span className="text-emerald-300 font-mono text-sm">{size}×{size}px</span>
            </div>
            <input 
              type="range" 
              min={128} 
              max={512} 
              step={32}
              value={size} 
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-700"
              style={{
                background: `linear-gradient(to right, rgb(16 185 129) 0%, rgb(16 185 129) ${((size - 128) / (512 - 128)) * 100}%, rgb(51 65 85) ${((size - 128) / (512 - 128)) * 100}%, rgb(51 65 85) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>128px</span>
              <span>512px</span>
            </div>
          </div>

          {/* Download button */}
          <button 
            onClick={downloadQR}
            className="w-full px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            下载二维码
          </button>
        </div>

        {/* QR Code display */}
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-2xl bg-white p-6 shadow-2xl">
            <canvas ref={canvasRef} className="block" />
          </div>
          <div className="text-xs text-slate-500 text-center">使用相机扫描二维码</div>
        </div>
      </div>

      {/* Info tip */}
      <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-4">
        <div className="flex gap-3">
          <div className="text-emerald-400 text-lg">💡</div>
          <div className="text-sm text-slate-300">
            <p className="font-medium text-emerald-300">提示</p>
            <p className="text-slate-400 mt-1">二维码支持存储文本、链接、联系方式等信息。容错级别设置为 M，平衡了容量与可靠性。</p>
          </div>
        </div>
      </div>
    </div>
  )
}
