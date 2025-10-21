import { useState } from 'react'

const presetAnimations = [
  { name: '淡入', keyframes: '0% { opacity: 0; }\n100% { opacity: 1; }' },
  { name: '放大', keyframes: '0% { transform: scale(0); }\n100% { transform: scale(1); }' },
  { name: '旋转', keyframes: '0% { transform: rotate(0deg); }\n100% { transform: rotate(360deg); }' },
  { name: '滑入', keyframes: '0% { transform: translateX(-100%); }\n100% { transform: translateX(0); }' },
  { name: '弹跳', keyframes: '0%, 100% { transform: translateY(0); }\n50% { transform: translateY(-30px); }' },
  { name: '抖动', keyframes: '0%, 100% { transform: translateX(0); }\n25% { transform: translateX(-10px); }\n75% { transform: translateX(10px); }' },
]

export default function CSSAnimationPage() {
  const [animationName, setAnimationName] = useState('fadeIn')
  const [duration, setDuration] = useState(1)
  const [timingFunction, setTimingFunction] = useState<'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'>('ease')
  const [delay, setDelay] = useState(0)
  const [iterationCount, setIterationCount] = useState<number | 'infinite'>(1)
  const [direction, setDirection] = useState<'normal' | 'reverse' | 'alternate' | 'alternate-reverse'>('normal')
  const [keyframes, setKeyframes] = useState('0% { opacity: 0; }\n100% { opacity: 1; }')
  const [isPlaying, setIsPlaying] = useState(false)

  const generateCSS = () => {
    return `@keyframes ${animationName} {
  ${keyframes}
}

.element {
  animation-name: ${animationName};
  animation-duration: ${duration}s;
  animation-timing-function: ${timingFunction};
  animation-delay: ${delay}s;
  animation-iteration-count: ${iterationCount};
  animation-direction: ${direction};
}`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCSS())
  }

  const playAnimation = () => {
    setIsPlaying(false)
    setTimeout(() => setIsPlaying(true), 10)
  }

  const animationStyle: React.CSSProperties = isPlaying ? {
    animationName: animationName,
    animationDuration: `${duration}s`,
    animationTimingFunction: timingFunction,
    animationDelay: `${delay}s`,
    animationIterationCount: iterationCount,
    animationDirection: direction,
  } : {}

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="border-b border-slate-700/50 pb-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-violet-300">CSS动画生成器</h1>
        <p className="text-slate-400 mt-2">创建CSS keyframes动画和过渡效果</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8">
        {/* Controls */}
        <div className="space-y-6">
          {/* Animation Name */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">动画名称</label>
            <input
              type="text"
              value={animationName}
              onChange={(e) => setAnimationName(e.target.value)}
              className="w-full rounded-lg bg-slate-900/50 border border-slate-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 p-3 font-mono transition-all outline-none"
            />
          </div>

          {/* Preset Animations */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">预设动画</label>
            <div className="grid grid-cols-2 gap-2">
              {presetAnimations.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setKeyframes(preset.keyframes)
                    setAnimationName(preset.name.replace(/[\u4e00-\u9fa5]/g, (char) => {
                      const map: Record<string, string> = {
                        '淡入': 'fadeIn',
                        '放大': 'scaleUp',
                        '旋转': 'rotate',
                        '滑入': 'slideIn',
                        '弹跳': 'bounce',
                        '抖动': 'shake',
                      }
                      return map[char] || char
                    }))
                  }}
                  className="py-2 px-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-300 hover:border-pink-500 hover:text-pink-300 transition-all text-sm"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Keyframes */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">Keyframes</label>
            <textarea
              value={keyframes}
              onChange={(e) => setKeyframes(e.target.value)}
              className="w-full h-32 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 p-3 font-mono text-sm transition-all outline-none resize-none"
            />
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm text-slate-400">持续时间</label>
              <span className="text-pink-300 font-mono text-sm">{duration}s</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-pink-500"
            />
          </div>

          {/* Timing Function */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">缓动函数</label>
            <select
              value={timingFunction}
              onChange={(e) => setTimingFunction(e.target.value as any)}
              className="w-full rounded-lg bg-slate-900/50 border border-slate-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 p-3 transition-all outline-none"
            >
              <option value="linear">linear</option>
              <option value="ease">ease</option>
              <option value="ease-in">ease-in</option>
              <option value="ease-out">ease-out</option>
              <option value="ease-in-out">ease-in-out</option>
            </select>
          </div>

          {/* Delay */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm text-slate-400">延迟时间</label>
              <span className="text-pink-300 font-mono text-sm">{delay}s</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              className="w-full accent-pink-500"
            />
          </div>

          {/* Iteration Count */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">重复次数</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={iterationCount === 'infinite' ? '' : iterationCount}
                onChange={(e) => setIterationCount(Number(e.target.value) || 1)}
                className="flex-1 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 p-3 transition-all outline-none"
              />
              <button
                onClick={() => setIterationCount('infinite')}
                className={`px-4 rounded-lg transition-all ${
                  iterationCount === 'infinite'
                    ? 'bg-pink-500 text-white'
                    : 'bg-slate-900/50 border border-slate-700 text-slate-300 hover:border-pink-500'
                }`}
              >
                无限
              </button>
            </div>
          </div>

          {/* Direction */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">方向</label>
            <div className="grid grid-cols-2 gap-2">
              {(['normal', 'reverse', 'alternate', 'alternate-reverse'] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => setDirection(dir)}
                  className={`py-2 px-3 rounded-lg transition-all text-xs ${
                    direction === dir
                      ? 'bg-pink-500 text-white'
                      : 'bg-slate-900/50 border border-slate-700 text-slate-300 hover:border-pink-500'
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview & Code */}
        <div className="space-y-6">
          {/* Preview */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">预览效果</label>
            <div className="h-64 rounded-lg bg-slate-900/50 border-2 border-slate-700 flex items-center justify-center">
              <style>
                {`@keyframes ${animationName} { ${keyframes} }`}
              </style>
              <div
                style={animationStyle}
                className="w-24 h-24 bg-gradient-to-br from-pink-400 to-violet-500 rounded-xl shadow-2xl"
              />
            </div>
            <button
              onClick={playAnimation}
              className="w-full py-3 px-4 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-medium transition-all"
            >
              ▶ 播放动画
            </button>
          </div>

          {/* CSS Code */}
          <div className="space-y-3">
            <label className="block text-sm text-slate-400">CSS 代码</label>
            <div className="relative">
              <pre className="p-4 rounded-lg bg-slate-900 border border-slate-700 overflow-x-auto text-xs font-mono text-slate-200 whitespace-pre max-h-96">
                {generateCSS()}
              </pre>
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 px-3 py-1 text-xs bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 rounded transition-all"
              >
                复制
              </button>
            </div>
          </div>

          {/* Shorthand */}
          <div className="p-4 rounded-lg bg-slate-900/30 border border-slate-700/50">
            <div className="text-sm text-slate-400 mb-2">简写形式：</div>
            <code className="text-xs font-mono text-pink-300">
              animation: {animationName} {duration}s {timingFunction} {delay}s {iterationCount} {direction};
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}
