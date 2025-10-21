import { useState } from 'react'

interface Device {
  name: string
  width: number
  height: number
  icon: string
}

const devices: Device[] = [
  { name: 'iPhone SE', width: 375, height: 667, icon: '📱' },
  { name: 'iPhone 12/13', width: 390, height: 844, icon: '📱' },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932, icon: '📱' },
  { name: 'iPad Mini', width: 768, height: 1024, icon: '📱' },
  { name: 'iPad Pro', width: 1024, height: 1366, icon: '💻' },
  { name: 'Laptop', width: 1366, height: 768, icon: '💻' },
  { name: 'Desktop', width: 1920, height: 1080, icon: '🖥️' },
]

export default function ResponsivePreviewPage() {
  const [url, setUrl] = useState('https://example.com')
  const [selectedDevice, setSelectedDevice] = useState(devices[0])
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [customWidth, setCustomWidth] = useState(375)
  const [customHeight, setCustomHeight] = useState(667)
  const [isCustom, setIsCustom] = useState(false)

  const currentWidth = isCustom ? customWidth : 
    orientation === 'portrait' ? selectedDevice.width : selectedDevice.height
  const currentHeight = isCustom ? customHeight : 
    orientation === 'portrait' ? selectedDevice.height : selectedDevice.width

  const scale = Math.min(1, (window.innerWidth - 100) / currentWidth, 600 / currentHeight)

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="border-b border-slate-700/50 pb-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-300">响应式断点预览</h1>
        <p className="text-slate-400 mt-2">在不同屏幕尺寸下预览网页效果</p>
      </div>

      {/* URL Input */}
      <div className="space-y-3">
        <label className="block text-sm text-slate-400">网页地址</label>
        <div className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 font-mono transition-all outline-none"
          />
        </div>
      </div>

      {/* Device Selection */}
      <div className="space-y-3">
        <label className="block text-sm text-slate-400">设备预设</label>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {devices.map((device) => (
            <button
              key={device.name}
              onClick={() => {
                setSelectedDevice(device)
                setIsCustom(false)
              }}
              className={`p-3 rounded-lg transition-all text-sm ${
                !isCustom && selectedDevice.name === device.name
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-900/50 border border-slate-700 text-slate-300 hover:border-blue-500'
              }`}
            >
              <div className="text-2xl mb-1">{device.icon}</div>
              <div className="font-medium">{device.name}</div>
              <div className="text-xs opacity-70">{device.width}×{device.height}</div>
            </button>
          ))}
          <button
            onClick={() => setIsCustom(true)}
            className={`p-3 rounded-lg transition-all text-sm ${
              isCustom
                ? 'bg-blue-500 text-white'
                : 'bg-slate-900/50 border border-slate-700 text-slate-300 hover:border-blue-500'
            }`}
          >
            <div className="text-2xl mb-1">⚙️</div>
            <div className="font-medium">自定义</div>
          </button>
        </div>
      </div>

      {/* Custom Size */}
      {isCustom && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm text-slate-400">宽度 (px)</label>
            <input
              type="number"
              value={customWidth}
              onChange={(e) => setCustomWidth(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-lg bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 font-mono transition-all outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm text-slate-400">高度 (px)</label>
            <input
              type="number"
              value={customHeight}
              onChange={(e) => setCustomHeight(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-lg bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 font-mono transition-all outline-none"
            />
          </div>
        </div>
      )}

      {/* Orientation Toggle */}
      {!isCustom && (
        <div className="flex items-center gap-3">
          <label className="block text-sm text-slate-400">方向：</label>
          <button
            onClick={() => setOrientation('portrait')}
            className={`px-4 py-2 rounded-lg transition-all ${
              orientation === 'portrait'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-900/50 border border-slate-700 text-slate-300 hover:border-blue-500'
            }`}
          >
            竖屏
          </button>
          <button
            onClick={() => setOrientation('landscape')}
            className={`px-4 py-2 rounded-lg transition-all ${
              orientation === 'landscape'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-900/50 border border-slate-700 text-slate-300 hover:border-blue-500'
            }`}
          >
            横屏
          </button>
        </div>
      )}

      {/* Viewport Info */}
      <div className="flex items-center gap-6 text-sm text-slate-400">
        <div>
          视口: <span className="text-blue-300 font-mono">{currentWidth} × {currentHeight}</span> px
        </div>
        <div>
          缩放: <span className="text-blue-300 font-mono">{Math.round(scale * 100)}%</span>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="flex justify-center py-8">
        <div 
          className="bg-slate-900 border-8 border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
          style={{
            width: currentWidth * scale,
            height: currentHeight * scale,
          }}
        >
          <iframe
            src={url}
            title="Responsive Preview"
            className="w-full h-full bg-white"
            style={{
              width: currentWidth,
              height: currentHeight,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          />
        </div>
      </div>
    </div>
  )
}
