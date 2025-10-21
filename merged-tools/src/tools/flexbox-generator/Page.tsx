import { useState } from 'react'

export default function FlexboxGeneratorPage() {
  const [flexDirection, setFlexDirection] = useState<'row' | 'column' | 'row-reverse' | 'column-reverse'>('row')
  const [justifyContent, setJustifyContent] = useState<'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'>('flex-start')
  const [alignItems, setAlignItems] = useState<'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'>('stretch')
  const [flexWrap, setFlexWrap] = useState<'nowrap' | 'wrap' | 'wrap-reverse'>('nowrap')
  const [gap, setGap] = useState(8)
  const [numItems, setNumItems] = useState(5)

  const generateCSS = () => {
    return `.container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  gap: ${gap}px;
}`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCSS())
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection,
    justifyContent,
    alignItems,
    flexWrap,
    gap: `${gap}px`,
  }

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="border-b border-slate-700/50 pb-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-emerald-300">Flexbox布局生成器</h1>
        <p className="text-slate-400 mt-2">可视化生成CSS Flexbox布局代码</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
        {/* Controls */}
        <div className="space-y-6">
          {/* Flex Direction */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">flex-direction</label>
            <div className="grid grid-cols-2 gap-2">
              {(['row', 'column', 'row-reverse', 'column-reverse'] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => setFlexDirection(dir)}
                  className={`py-2 px-3 rounded-lg transition-all text-sm ${
                    flexDirection === dir
                      ? 'bg-teal-500 text-white'
                      : 'bg-slate-900/50 border border-slate-700 text-slate-300 hover:border-teal-500'
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>

          {/* Justify Content */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">justify-content</label>
            <div className="grid grid-cols-2 gap-2">
              {(['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'] as const).map((justify) => (
                <button
                  key={justify}
                  onClick={() => setJustifyContent(justify)}
                  className={`py-2 px-3 rounded-lg transition-all text-xs ${
                    justifyContent === justify
                      ? 'bg-teal-500 text-white'
                      : 'bg-slate-900/50 border border-slate-700 text-slate-300 hover:border-teal-500'
                  }`}
                >
                  {justify}
                </button>
              ))}
            </div>
          </div>

          {/* Align Items */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">align-items</label>
            <div className="grid grid-cols-2 gap-2">
              {(['flex-start', 'center', 'flex-end', 'stretch', 'baseline'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => setAlignItems(align)}
                  className={`py-2 px-3 rounded-lg transition-all text-sm ${
                    alignItems === align
                      ? 'bg-teal-500 text-white'
                      : 'bg-slate-900/50 border border-slate-700 text-slate-300 hover:border-teal-500'
                  }`}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>

          {/* Flex Wrap */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">flex-wrap</label>
            <div className="grid grid-cols-3 gap-2">
              {(['nowrap', 'wrap', 'wrap-reverse'] as const).map((wrap) => (
                <button
                  key={wrap}
                  onClick={() => setFlexWrap(wrap)}
                  className={`py-2 px-3 rounded-lg transition-all text-sm ${
                    flexWrap === wrap
                      ? 'bg-teal-500 text-white'
                      : 'bg-slate-900/50 border border-slate-700 text-slate-300 hover:border-teal-500'
                  }`}
                >
                  {wrap}
                </button>
              ))}
            </div>
          </div>

          {/* Gap */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm text-slate-400">gap</label>
              <span className="text-teal-300 font-mono text-sm">{gap}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              className="w-full accent-teal-500"
            />
          </div>

          {/* Number of Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm text-slate-400">项目数量</label>
              <span className="text-teal-300 font-mono text-sm">{numItems}</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              value={numItems}
              onChange={(e) => setNumItems(Number(e.target.value))}
              className="w-full accent-teal-500"
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
                onClick={copyToClipboard}
                className="absolute top-2 right-2 px-3 py-1 text-xs bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 rounded transition-all"
              >
                复制
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <label className="block text-sm text-slate-400">实时预览</label>
          <div className="p-8 rounded-lg bg-slate-900/50 border-2 border-slate-700 min-h-[500px]">
            <div style={containerStyle} className="h-full">
              {Array.from({ length: numItems }, (_, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg"
                  style={{
                    minWidth: flexDirection.includes('column') ? 'auto' : '80px',
                    minHeight: flexDirection.includes('column') ? '60px' : '80px',
                    padding: '20px',
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Property Descriptions */}
          <div className="space-y-4 p-4 rounded-lg bg-slate-900/30 border border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-300">属性说明</h3>
            <div className="space-y-3 text-xs text-slate-400">
              <div>
                <span className="text-teal-300 font-mono">flex-direction</span>: 定义主轴方向（子元素排列方向）
              </div>
              <div>
                <span className="text-teal-300 font-mono">justify-content</span>: 定义主轴上的对齐方式
              </div>
              <div>
                <span className="text-teal-300 font-mono">align-items</span>: 定义交叉轴上的对齐方式
              </div>
              <div>
                <span className="text-teal-300 font-mono">flex-wrap</span>: 定义是否换行
              </div>
              <div>
                <span className="text-teal-300 font-mono">gap</span>: 定义项目之间的间距
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
