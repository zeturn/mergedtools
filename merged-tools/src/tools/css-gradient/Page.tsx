import { useState } from 'react'

interface ColorStop {
  color: string
  position: number
}

export default function CSSGradientPage() {
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear')
  const [angle, setAngle] = useState(90)
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { color: '#667eea', position: 0 },
    { color: '#764ba2', position: 100 }
  ])

  const addColorStop = () => {
    const newPosition = colorStops.length > 0 ? 
      Math.round((colorStops[colorStops.length - 1].position + 100) / 2) : 50
    setColorStops([...colorStops, { color: '#ffffff', position: Math.min(newPosition, 100) }])
  }

  const removeColorStop = (index: number) => {
    if (colorStops.length > 2) {
      setColorStops(colorStops.filter((_, i) => i !== index))
    }
  }

  const updateColorStop = (index: number, field: 'color' | 'position', value: string | number) => {
    const newStops = [...colorStops]
    if (field === 'color') {
      newStops[index].color = value as string
    } else {
      newStops[index].position = Math.max(0, Math.min(100, value as number))
    }
    setColorStops(newStops)
  }

  const generateCSS = () => {
    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position)
    const stopsStr = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ')
    
    if (gradientType === 'linear') {
      return `linear-gradient(${angle}deg, ${stopsStr})`
    } else {
      return `radial-gradient(circle, ${stopsStr})`
    }
  }

  const cssCode = generateCSS()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`background: ${cssCode};`)
  }

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="border-b border-slate-700/50 pb-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">CSS渐变生成器</h1>
        <p className="text-slate-400 mt-2">可视化创建CSS渐变效果</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          {/* Gradient Type */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">渐变类型</label>
            <div className="flex gap-3">
              <button
                onClick={() => setGradientType('linear')}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  gradientType === 'linear' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-slate-900/50 border border-slate-700 text-slate-300 hover:border-purple-500'
                }`}
              >
                线性渐变
              </button>
              <button
                onClick={() => setGradientType('radial')}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  gradientType === 'radial' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-slate-900/50 border border-slate-700 text-slate-300 hover:border-purple-500'
                }`}
              >
                径向渐变
              </button>
            </div>
          </div>

          {/* Angle (for linear gradient) */}
          {gradientType === 'linear' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm text-slate-400">角度</label>
                <span className="text-purple-300 font-mono text-sm">{angle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>
          )}

          {/* Color Stops */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm text-slate-400">颜色节点</label>
              <button
                onClick={addColorStop}
                className="text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-3 py-1 rounded transition-all"
              >
                + 添加节点
              </button>
            </div>
            <div className="space-y-3">
              {colorStops.map((stop, index) => (
                <div key={index} className="flex gap-3 items-center p-3 rounded-lg bg-slate-900/50 border border-slate-700">
                  <input
                    type="color"
                    value={stop.color}
                    onChange={(e) => updateColorStop(index, 'color', e.target.value)}
                    className="w-12 h-10 rounded border border-slate-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={stop.color}
                    onChange={(e) => updateColorStop(index, 'color', e.target.value)}
                    className="flex-1 rounded bg-slate-800 border border-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 p-2 font-mono text-sm transition-all outline-none"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={stop.position}
                    onChange={(e) => updateColorStop(index, 'position', Number(e.target.value))}
                    className="w-16 rounded bg-slate-800 border border-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 p-2 font-mono text-sm transition-all outline-none"
                  />
                  <span className="text-slate-500 text-sm">%</span>
                  {colorStops.length > 2 && (
                    <button
                      onClick={() => removeColorStop(index)}
                      className="text-red-400 hover:text-red-300 px-2 transition-colors"
                      title="删除"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CSS Code */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">CSS 代码</label>
            <div className="relative">
              <pre className="p-4 rounded-lg bg-slate-900 border border-slate-700 overflow-x-auto text-sm font-mono text-slate-200">
                <code>background: {cssCode};</code>
              </pre>
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 px-3 py-1 text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded transition-all"
              >
                复制
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-3">
          <label className="block text-sm text-slate-400">预览</label>
          <div 
            className="w-full h-96 rounded-lg border-2 border-slate-700 shadow-2xl"
            style={{ background: cssCode }}
          />
        </div>
      </div>
    </div>
  )
}
