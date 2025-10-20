import { useEffect, useMemo, useRef, useState } from 'react'

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'

function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = (e) => reject(e)
      img.src = String(reader.result)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default function Page() {
  const [baseImage, setBaseImage] = useState<HTMLImageElement | null>(null)
  const [wmImage, setWmImage] = useState<HTMLImageElement | null>(null)
  const [text, setText] = useState('')
  const [textSize, setTextSize] = useState(32)
  const [textColor, setTextColor] = useState('#ffffff')
  const [textOpacity, setTextOpacity] = useState(0.5)
  const [imgOpacity, setImgOpacity] = useState(0.5)
  const [position, setPosition] = useState<Position>('bottom-right')
  const [margin, setMargin] = useState(16)
  const [scale, setScale] = useState(0.25) // watermark image scale relative to base width
  const [filterBrightness, setFilterBrightness] = useState(100)
  const [filterContrast, setFilterContrast] = useState(100)
  const [filterGrayscale, setFilterGrayscale] = useState(0)
  const [filterInvert, setFilterInvert] = useState(0)
  const [filterBlur, setFilterBlur] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const cssFilter = useMemo(() => {
    return `brightness(${filterBrightness}%) contrast(${filterContrast}%) grayscale(${filterGrayscale}%) invert(${filterInvert}%) blur(${filterBlur}px)`
  }, [filterBrightness, filterContrast, filterGrayscale, filterInvert, filterBlur])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !baseImage) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = baseImage.naturalWidth
    const h = baseImage.naturalHeight
    canvas.width = w
    canvas.height = h

    // draw base with filters
    ctx.filter = cssFilter
    ctx.drawImage(baseImage, 0, 0, w, h)

    // draw watermark image
    if (wmImage) {
      const targetW = Math.max(1, Math.round(w * scale))
      const ratio = wmImage.naturalWidth ? targetW / wmImage.naturalWidth : 1
      const targetH = Math.max(1, Math.round(wmImage.naturalHeight * ratio))
      const { x, y } = computePos(w, h, targetW, targetH, position, margin)
      ctx.save()
      ctx.globalAlpha = Math.min(1, Math.max(0, imgOpacity))
      ctx.drawImage(wmImage, x, y, targetW, targetH)
      ctx.restore()
    }

    // draw text watermark
    if (text.trim().length > 0) {
      ctx.save()
      ctx.globalAlpha = Math.min(1, Math.max(0, textOpacity))
      ctx.fillStyle = textColor
      ctx.textBaseline = 'bottom'
      ctx.font = `${textSize}px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`
      const metrics = ctx.measureText(text)
      const tW = Math.ceil(metrics.width)
      const tH = Math.ceil(textSize)
      const { x, y } = computePos(w, h, tW, tH, position, margin)
      ctx.fillText(text, x, y + tH)
      ctx.restore()
    }
  }, [baseImage, wmImage, text, textSize, textColor, textOpacity, imgOpacity, position, margin, scale, cssFilter])

  const onSelectBase = async (f: File | null) => {
    if (!f) { setBaseImage(null); return }
    const img = await fileToImage(f)
    setBaseImage(img)
  }
  const onSelectWm = async (f: File | null) => {
    if (!f) { setWmImage(null); return }
    const img = await fileToImage(f)
    setWmImage(img)
  }

  const onDownload = async () => {
    const c = canvasRef.current
    if (!c) return
    c.toBlob((b) => b && downloadBlob(b, 'watermarked.png'))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="block text-sm font-medium">原图</label>
            <input type="file" accept="image/*"
              onChange={(e) => onSelectBase(e.target.files?.[0] ?? null)} />
          </div>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">滤镜</legend>
            <Slider label={`亮度 ${filterBrightness}%`} value={filterBrightness} min={0} max={200} step={1} onChange={setFilterBrightness} />
            <Slider label={`对比度 ${filterContrast}%`} value={filterContrast} min={0} max={200} step={1} onChange={setFilterContrast} />
            <Slider label={`灰度 ${filterGrayscale}%`} value={filterGrayscale} min={0} max={100} step={1} onChange={setFilterGrayscale} />
            <Slider label={`反相 ${filterInvert}%`} value={filterInvert} min={0} max={100} step={1} onChange={setFilterInvert} />
            <Slider label={`模糊 ${filterBlur}px`} value={filterBlur} min={0} max={10} step={0.5} onChange={setFilterBlur} />
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">图片水印</legend>
            <div>
              <input type="file" accept="image/*" onChange={(e) => onSelectWm(e.target.files?.[0] ?? null)} />
            </div>
            <Slider label={`水印图片大小（相对宽度） ${Math.round(scale * 100)}%`} value={scale} min={0.05} max={1} step={0.01} onChange={setScale} />
            <Slider label={`水印图片透明度 ${Math.round(imgOpacity * 100)}%`} value={imgOpacity} min={0} max={1} step={0.01} onChange={setImgOpacity} />
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">文字水印</legend>
            <input className="w-full border rounded px-2 py-1" placeholder="输入文字…" value={text} onChange={(e) => setText(e.target.value)} />
            <div className="grid grid-cols-2 gap-2 items-center">
              <div>
                <label className="block text-xs text-gray-500">颜色</label>
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
              </div>
              <Slider label={`字号 ${textSize}px`} value={textSize} min={8} max={200} step={1} onChange={setTextSize} />
            </div>
            <Slider label={`文字透明度 ${Math.round(textOpacity * 100)}%`} value={textOpacity} min={0} max={1} step={0.01} onChange={setTextOpacity} />
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">位置与边距</legend>
            <div className="flex flex-wrap gap-2">
              {(['top-left','top-right','bottom-left','bottom-right','center'] as Position[]).map(p => (
                <button key={p}
                  className={`px-2 py-1 rounded border ${p===position? 'bg-blue-600 text-white border-blue-600':'bg-white'}`}
                  onClick={() => setPosition(p)}>
                  {labelPos(p)}
                </button>
              ))}
            </div>
            <Slider label={`边距 ${margin}px`} value={margin} min={0} max={200} step={1} onChange={setMargin} />
          </fieldset>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={onDownload} disabled={!baseImage}>下载 PNG</button>
          </div>
        </div>
        <div className="min-h-[240px] border rounded flex items-center justify-center bg-gray-50">
          {baseImage ? (
            <canvas ref={canvasRef} className="max-w-full h-auto" />
          ) : (
            <p className="text-gray-500">请先选择一张图片</p>
          )}
        </div>
      </div>
    </div>
  )
}

function labelPos(p: Position) {
  switch (p) {
    case 'top-left': return '左上'
    case 'top-right': return '右上'
    case 'bottom-left': return '左下'
    case 'bottom-right': return '右下'
    case 'center': return '居中'
  }
}

function computePos(baseW: number, baseH: number, w: number, h: number, pos: Position, margin: number) {
  let x = 0, y = 0
  switch (pos) {
    case 'top-left':
      x = margin; y = margin; break
    case 'top-right':
      x = baseW - w - margin; y = margin; break
    case 'bottom-left':
      x = margin; y = baseH - h - margin; break
    case 'bottom-right':
      x = baseW - w - margin; y = baseH - h - margin; break
    case 'center':
      x = (baseW - w)/2; y = (baseH - h)/2; break
  }
  return { x: Math.round(x), y: Math.round(y) }
}

type SliderProps = { label: string, value: number, min: number, max: number, step: number, onChange: (v:number)=>void }
function Slider({ label, value, min, max, step, onChange }: SliderProps) {
  return (
    <label className="block text-sm">
      <div className="mb-1 text-gray-700">{label}</div>
      <input type="range" className="w-full" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  )
}
