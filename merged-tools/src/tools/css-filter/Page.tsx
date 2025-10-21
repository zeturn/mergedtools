import { useState } from 'react'

interface FilterValues {
  blur: number
  brightness: number
  contrast: number
  grayscale: number
  hueRotate: number
  invert: number
  saturate: number
  sepia: number
  opacity: number
}

export default function CSSFilterPage() {
  const [filters, setFilters] = useState<FilterValues>({
    blur: 0,
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    hueRotate: 0,
    invert: 0,
    saturate: 100,
    sepia: 0,
    opacity: 100,
  })

  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800')

  const updateFilter = (key: keyof FilterValues, value: number) => {
    setFilters({ ...filters, [key]: value })
  }

  const resetFilters = () => {
    setFilters({
      blur: 0,
      brightness: 100,
      contrast: 100,
      grayscale: 0,
      hueRotate: 0,
      invert: 0,
      saturate: 100,
      sepia: 0,
      opacity: 100,
    })
  }

  const generateCSS = () => {
    const parts = []
    if (filters.blur > 0) parts.push(`blur(${filters.blur}px)`)
    if (filters.brightness !== 100) parts.push(`brightness(${filters.brightness}%)`)
    if (filters.contrast !== 100) parts.push(`contrast(${filters.contrast}%)`)
    if (filters.grayscale > 0) parts.push(`grayscale(${filters.grayscale}%)`)
    if (filters.hueRotate !== 0) parts.push(`hue-rotate(${filters.hueRotate}deg)`)
    if (filters.invert > 0) parts.push(`invert(${filters.invert}%)`)
    if (filters.saturate !== 100) parts.push(`saturate(${filters.saturate}%)`)
    if (filters.sepia > 0) parts.push(`sepia(${filters.sepia}%)`)
    if (filters.opacity !== 100) parts.push(`opacity(${filters.opacity}%)`)
    return parts.length > 0 ? parts.join(' ') : 'none'
  }

  const cssCode = generateCSS()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`filter: ${cssCode};`)
  }

  const filterStyle = {
    filter: cssCode,
  }

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="border-b border-slate-700/50 pb-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">CSS滤镜生成器</h1>
        <p className="text-slate-400 mt-2">可视化调整CSS滤镜效果</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
        {/* Controls */}
        <div className="space-y-6">
          {/* Image URL */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">图片地址</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="输入图片URL..."
              className="w-full rounded-lg bg-slate-900/50 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 p-3 transition-all outline-none text-sm"
            />
          </div>

          {/* Blur */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-400">模糊 (Blur)</label>
              <span className="text-indigo-300 font-mono text-sm">{filters.blur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={filters.blur}
              onChange={(e) => updateFilter('blur', Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          {/* Brightness */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-400">亮度 (Brightness)</label>
              <span className="text-indigo-300 font-mono text-sm">{filters.brightness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="1"
              value={filters.brightness}
              onChange={(e) => updateFilter('brightness', Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          {/* Contrast */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-400">对比度 (Contrast)</label>
              <span className="text-indigo-300 font-mono text-sm">{filters.contrast}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="1"
              value={filters.contrast}
              onChange={(e) => updateFilter('contrast', Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          {/* Grayscale */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-400">灰度 (Grayscale)</label>
              <span className="text-indigo-300 font-mono text-sm">{filters.grayscale}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={filters.grayscale}
              onChange={(e) => updateFilter('grayscale', Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          {/* Hue Rotate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-400">色相旋转 (Hue)</label>
              <span className="text-indigo-300 font-mono text-sm">{filters.hueRotate}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={filters.hueRotate}
              onChange={(e) => updateFilter('hueRotate', Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          {/* Invert */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-400">反相 (Invert)</label>
              <span className="text-indigo-300 font-mono text-sm">{filters.invert}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={filters.invert}
              onChange={(e) => updateFilter('invert', Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          {/* Saturate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-400">饱和度 (Saturate)</label>
              <span className="text-indigo-300 font-mono text-sm">{filters.saturate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="1"
              value={filters.saturate}
              onChange={(e) => updateFilter('saturate', Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          {/* Sepia */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-400">褐色 (Sepia)</label>
              <span className="text-indigo-300 font-mono text-sm">{filters.sepia}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={filters.sepia}
              onChange={(e) => updateFilter('sepia', Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          {/* Opacity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-400">不透明度 (Opacity)</label>
              <span className="text-indigo-300 font-mono text-sm">{filters.opacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={filters.opacity}
              onChange={(e) => updateFilter('opacity', Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="w-full py-2 px-4 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-300 hover:border-indigo-500 hover:text-indigo-300 transition-all"
          >
            重置所有滤镜
          </button>

          {/* CSS Code */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">CSS 代码</label>
            <div className="relative">
              <pre className="p-4 rounded-lg bg-slate-900 border border-slate-700 overflow-x-auto text-xs font-mono text-slate-200 whitespace-pre-wrap break-all">
                <code>filter: {cssCode};</code>
              </pre>
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 px-3 py-1 text-xs bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded transition-all"
              >
                复制
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Original */}
            <div className="space-y-3">
              <label className="block text-sm text-slate-400">原图</label>
              <div className="rounded-lg overflow-hidden border-2 border-slate-700 bg-slate-900">
                <img
                  src={imageUrl}
                  alt="Original"
                  className="w-full h-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23334155" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif"%3E无法加载图片%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>
            </div>

            {/* Filtered */}
            <div className="space-y-3">
              <label className="block text-sm text-slate-400">预览效果</label>
              <div className="rounded-lg overflow-hidden border-2 border-slate-700 bg-slate-900">
                <img
                  src={imageUrl}
                  alt="Filtered"
                  style={filterStyle}
                  className="w-full h-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23334155" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif"%3E无法加载图片%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Preset Filters */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">预设滤镜效果</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <button
                onClick={() => setFilters({ blur: 0, brightness: 100, contrast: 100, grayscale: 0, hueRotate: 0, invert: 0, saturate: 100, sepia: 0, opacity: 100 })}
                className="p-2 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-indigo-500 transition-all text-sm text-slate-300"
              >
                正常
              </button>
              <button
                onClick={() => setFilters({ ...filters, grayscale: 100, contrast: 110 })}
                className="p-2 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-indigo-500 transition-all text-sm text-slate-300"
              >
                黑白
              </button>
              <button
                onClick={() => setFilters({ ...filters, sepia: 100, saturate: 150, brightness: 110 })}
                className="p-2 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-indigo-500 transition-all text-sm text-slate-300"
              >
                复古
              </button>
              <button
                onClick={() => setFilters({ ...filters, blur: 3, brightness: 110, saturate: 130 })}
                className="p-2 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-indigo-500 transition-all text-sm text-slate-300"
              >
                柔光
              </button>
              <button
                onClick={() => setFilters({ ...filters, contrast: 150, saturate: 150, brightness: 110 })}
                className="p-2 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-indigo-500 transition-all text-sm text-slate-300"
              >
                鲜艳
              </button>
              <button
                onClick={() => setFilters({ ...filters, invert: 100, hueRotate: 180 })}
                className="p-2 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-indigo-500 transition-all text-sm text-slate-300"
              >
                反色
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
