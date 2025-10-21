import { useState } from 'react'

interface ColorPalette {
  [key: string]: string
}

export default function TailwindConfigPage() {
  const [colors, setColors] = useState<ColorPalette>({
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
  })
  const [fontFamily, setFontFamily] = useState({
    sans: 'Inter, system-ui, sans-serif',
    serif: 'Georgia, serif',
    mono: 'Menlo, monospace',
  })
  const [spacing, setSpacing] = useState({
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  })
  const [borderRadius, setBorderRadius] = useState({
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  })

  const addColor = () => {
    const key = `color${Object.keys(colors).length + 1}`
    setColors({ ...colors, [key]: '#000000' })
  }

  const removeColor = (key: string) => {
    const newColors = { ...colors }
    delete newColors[key]
    setColors(newColors)
  }

  const updateColor = (oldKey: string, newKey: string, value: string) => {
    const newColors: ColorPalette = {}
    Object.keys(colors).forEach(k => {
      if (k === oldKey) {
        newColors[newKey] = value
      } else {
        newColors[k] = colors[k]
      }
    })
    setColors(newColors)
  }

  const generateConfig = () => {
    return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 8).replace(/\n/g, '\n      ')},
      fontFamily: ${JSON.stringify(fontFamily, null, 8).replace(/\n/g, '\n      ')},
      spacing: ${JSON.stringify(spacing, null, 8).replace(/\n/g, '\n      ')},
      borderRadius: ${JSON.stringify(borderRadius, null, 8).replace(/\n/g, '\n      ')},
    },
  },
  plugins: [],
}`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateConfig())
  }

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="border-b border-slate-700/50 pb-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">Tailwind配置生成器</h1>
        <p className="text-slate-400 mt-2">可视化配置Tailwind CSS</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Configuration */}
        <div className="space-y-6">
          {/* Colors */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm text-slate-400">颜色配置</label>
              <button
                onClick={addColor}
                className="text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-3 py-1 rounded transition-all"
              >
                + 添加颜色
              </button>
            </div>
            <div className="space-y-2">
              {Object.entries(colors).map(([key, value]) => (
                <div key={key} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => updateColor(key, e.target.value, value)}
                    className="w-32 rounded bg-slate-900/50 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 p-2 text-sm transition-all outline-none"
                    placeholder="名称"
                  />
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => updateColor(key, key, e.target.value)}
                    className="w-12 h-10 rounded border border-slate-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateColor(key, key, e.target.value)}
                    className="flex-1 rounded bg-slate-900/50 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 p-2 font-mono text-sm transition-all outline-none"
                  />
                  {Object.keys(colors).length > 1 && (
                    <button
                      onClick={() => removeColor(key)}
                      className="text-red-400 hover:text-red-300 px-2 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">字体配置</label>
            <div className="space-y-2">
              {Object.entries(fontFamily).map(([key, value]) => (
                <div key={key} className="flex gap-2 items-center">
                  <span className="w-20 text-sm text-slate-400">{key}</span>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setFontFamily({ ...fontFamily, [key]: e.target.value })}
                    className="flex-1 rounded bg-slate-900/50 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 p-2 text-sm transition-all outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Spacing */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">间距配置</label>
            <div className="space-y-2">
              {Object.entries(spacing).map(([key, value]) => (
                <div key={key} className="flex gap-2 items-center">
                  <span className="w-20 text-sm text-slate-400">{key}</span>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setSpacing({ ...spacing, [key]: e.target.value })}
                    className="flex-1 rounded bg-slate-900/50 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 p-2 font-mono text-sm transition-all outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Border Radius */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">圆角配置</label>
            <div className="space-y-2">
              {Object.entries(borderRadius).map(([key, value]) => (
                <div key={key} className="flex gap-2 items-center">
                  <span className="w-20 text-sm text-slate-400">{key}</span>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setBorderRadius({ ...borderRadius, [key]: e.target.value })}
                    className="flex-1 rounded bg-slate-900/50 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 p-2 font-mono text-sm transition-all outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview & Code */}
        <div className="space-y-6">
          {/* Color Preview */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">颜色预览</label>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(colors).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div
                    className="h-20 rounded-lg border-2 border-slate-700 shadow-lg"
                    style={{ backgroundColor: value }}
                  />
                  <div className="text-center text-xs text-slate-400">{key}</div>
                  <div className="text-center text-xs font-mono text-slate-500">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Spacing Preview */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">间距预览</label>
            <div className="space-y-2 p-4 rounded-lg bg-slate-900/30 border border-slate-700/50">
              {Object.entries(spacing).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-12">{key}</span>
                  <div className="h-4 bg-cyan-500/30" style={{ width: value }} />
                  <span className="text-xs font-mono text-slate-500">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Border Radius Preview */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">圆角预览</label>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(borderRadius).map(([key, value]) => (
                <div key={key} className="text-center space-y-2">
                  <div
                    className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-400 to-blue-500"
                    style={{ borderRadius: value }}
                  />
                  <div className="text-xs text-slate-400">{key}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Config */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">生成的配置文件</label>
            <div className="relative">
              <pre className="p-4 rounded-lg bg-slate-900 border border-slate-700 overflow-x-auto text-xs font-mono text-slate-200 max-h-96 whitespace-pre">
                {generateConfig()}
              </pre>
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 px-3 py-1 text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded transition-all"
              >
                复制
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
