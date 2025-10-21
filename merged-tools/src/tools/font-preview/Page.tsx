import { useState, useEffect } from 'react'

const popularFonts = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Courier New',
  'Comic Sans MS',
  'Trebuchet MS',
  'Impact',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Raleway',
  'Poppins',
  'Playfair Display',
  'Merriweather',
  'Ubuntu',
  'Noto Sans',
  'Inter',
]

export default function FontPreviewPage() {
  const [selectedFont, setSelectedFont] = useState('Roboto')
  const [customFont, setCustomFont] = useState('')
  const [fontSize, setFontSize] = useState(32)
  const [fontWeight, setFontWeight] = useState(400)
  const [lineHeight, setLineHeight] = useState(1.5)
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [previewText, setPreviewText] = useState('The quick brown fox jumps over the lazy dog')
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set())

  const currentFont = customFont || selectedFont

  useEffect(() => {
    // Load Google Font if not a system font
    const systemFonts = ['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana', 'Courier New', 'Comic Sans MS', 'Trebuchet MS', 'Impact']
    
    if (!systemFonts.includes(currentFont) && !loadedFonts.has(currentFont)) {
      const link = document.createElement('link')
      link.href = `https://fonts.googleapis.com/css2?family=${currentFont.replace(/ /g, '+')}:wght@100;300;400;500;700;900&display=swap`
      link.rel = 'stylesheet'
      document.head.appendChild(link)
      
      setLoadedFonts(prev => new Set(prev).add(currentFont))
      
      return () => {
        document.head.removeChild(link)
      }
    }
  }, [currentFont, loadedFonts])

  const fontStyles = {
    fontFamily: currentFont,
    fontSize: `${fontSize}px`,
    fontWeight,
    lineHeight,
    letterSpacing: `${letterSpacing}px`,
  }

  const generateCSS = () => {
    return `font-family: "${currentFont}", sans-serif;
font-size: ${fontSize}px;
font-weight: ${fontWeight};
line-height: ${lineHeight};
letter-spacing: ${letterSpacing}px;`
  }

  const copyCSS = () => {
    navigator.clipboard.writeText(generateCSS())
  }

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="border-b border-slate-700/50 pb-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-300 to-rose-300">字体预览工具</h1>
        <p className="text-slate-400 mt-2">预览和比较不同字体效果</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
        {/* Controls */}
        <div className="space-y-6">
          {/* Font Selection */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">选择字体</label>
            <select
              value={selectedFont}
              onChange={(e) => {
                setSelectedFont(e.target.value)
                setCustomFont('')
              }}
              className="w-full rounded-lg bg-slate-900/50 border border-slate-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 p-3 transition-all outline-none"
            >
              {popularFonts.map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          {/* Custom Font */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">自定义字体</label>
            <input
              type="text"
              value={customFont}
              onChange={(e) => setCustomFont(e.target.value)}
              placeholder="输入 Google Font 名称..."
              className="w-full rounded-lg bg-slate-900/50 border border-slate-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 p-3 transition-all outline-none"
            />
            <p className="text-xs text-slate-500">例如: Inter, Roboto Mono, Playfair Display</p>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm text-slate-400">字体大小</label>
              <span className="text-orange-300 font-mono text-sm">{fontSize}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="96"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>

          {/* Font Weight */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm text-slate-400">字体粗细</label>
              <span className="text-orange-300 font-mono text-sm">{fontWeight}</span>
            </div>
            <input
              type="range"
              min="100"
              max="900"
              step="100"
              value={fontWeight}
              onChange={(e) => setFontWeight(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Thin</span>
              <span>Regular</span>
              <span>Bold</span>
              <span>Black</span>
            </div>
          </div>

          {/* Line Height */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm text-slate-400">行高</label>
              <span className="text-orange-300 font-mono text-sm">{lineHeight}</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={lineHeight}
              onChange={(e) => setLineHeight(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>

          {/* Letter Spacing */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm text-slate-400">字间距</label>
              <span className="text-orange-300 font-mono text-sm">{letterSpacing}px</span>
            </div>
            <input
              type="range"
              min="-5"
              max="10"
              step="0.5"
              value={letterSpacing}
              onChange={(e) => setLetterSpacing(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>

          {/* CSS Code */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">CSS 代码</label>
            <div className="relative">
              <pre className="p-4 rounded-lg bg-slate-900 border border-slate-700 overflow-x-auto text-xs font-mono text-slate-200 whitespace-pre">
                {generateCSS()}
              </pre>
              <button
                onClick={copyCSS}
                className="absolute top-2 right-2 px-3 py-1 text-xs bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded transition-all"
              >
                复制
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          {/* Preview Text Input */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">预览文本</label>
            <textarea
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="w-full h-24 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 p-3 transition-all outline-none resize-none"
              placeholder="输入预览文本..."
            />
          </div>

          {/* Preview Box */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">预览效果</label>
            <div className="p-8 rounded-lg bg-white border-2 border-slate-700 min-h-[300px]">
              <div style={fontStyles} className="text-gray-900 break-words">
                {previewText}
              </div>
            </div>
          </div>

          {/* Sample Sizes */}
          <div className="space-y-4">
            <label className="block text-sm text-slate-400">不同尺寸预览</label>
            {[48, 32, 24, 16, 12].map((size) => (
              <div key={size} className="p-4 rounded-lg bg-slate-900/30 border border-slate-700/50">
                <div className="text-xs text-slate-500 mb-2">{size}px</div>
                <div style={{ ...fontStyles, fontSize: `${size}px` }} className="text-slate-200">
                  {previewText.substring(0, 50)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
