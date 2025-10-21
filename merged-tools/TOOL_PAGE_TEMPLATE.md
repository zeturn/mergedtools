# 工具页面设计模板

## 📐 标准页面结构

```tsx
import { useState } from 'react'

export default function ToolPage() {
  const [input, setInput] = useState('')

  return (
    <div className="space-y-8">
      {/* 1. 页面标题 */}
      <div className="border-b border-slate-700/50 pb-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[color1]-300 to-[color2]-300">
          工具名称
        </h1>
        <p className="text-slate-400 mt-2">工具简短描述</p>
      </div>

      {/* 2. 主要内容区 */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gradient-to-b from-[color]-500 to-[color]-500 rounded-full" />
          <h2 className="text-xl font-semibold text-slate-100">功能标题</h2>
        </div>
        
        <div className="space-y-3">
          <label className="block text-sm text-slate-400">输入标签</label>
          <input 
            className="w-full rounded-lg bg-slate-900/50 border border-slate-700 focus:border-[theme]-500 focus:ring-2 focus:ring-[theme]-500/20 p-4 transition-all outline-none" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入提示..."
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm text-slate-400">输出标签</label>
            <button className="text-xs px-3 py-1 rounded-md bg-[theme]-600/20 hover:bg-[theme]-600/30 text-[theme]-300 border border-[theme]-500/30 transition-colors">
              复制
            </button>
          </div>
          <div className="rounded-lg bg-slate-900/50 border border-slate-700 p-4 font-mono text-emerald-300 min-h-[80px]">
            {/* 输出内容 */}
          </div>
        </div>
      </section>

      {/* 3. 信息提示卡（可选） */}
      <div className="rounded-lg bg-[theme]-500/5 border border-[theme]-500/20 p-4">
        <div className="flex gap-3">
          <div className="text-[theme]-400 text-lg">💡</div>
          <div className="text-sm text-slate-300">
            <p className="font-medium text-[theme]-300">提示标题</p>
            <p className="text-slate-400 mt-1">提示内容说明</p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

## 🎨 颜色主题选择

### 可用的主题色（选择一对）
```tsx
// 暖色系
from-amber-300 to-orange-300    // 温暖、活力
from-orange-300 to-red-300      // 热情、警示
from-pink-300 to-rose-300       // 柔和、友好

// 冷色系
from-indigo-300 to-cyan-300     // 专业、技术
from-cyan-300 to-blue-300       // 清爽、可靠
from-emerald-300 to-teal-300    // 自然、成功

// 紫色系
from-violet-300 to-fuchsia-300  // 创意、独特
from-purple-300 to-pink-300     // 神秘、优雅
```

### 组件主题色应用
```tsx
// 标题渐变
bg-gradient-to-r from-indigo-300 to-cyan-300

// 装饰条
bg-gradient-to-b from-indigo-500 to-cyan-500

// 输入框焦点
focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20

// 按钮
bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20

// 信息卡背景
bg-indigo-500/5 border border-indigo-500/20

// 信息卡文字
text-indigo-300 (标题)
text-indigo-400 (图标)
```

## 🧩 常用组件样式

### 文本输入框
```tsx
<input 
  type="text"
  className="w-full rounded-lg bg-slate-900/50 border border-slate-700 
             focus:border-[theme]-500 focus:ring-2 focus:ring-[theme]-500/20 
             p-4 transition-all outline-none" 
/>
```

### 多行文本框
```tsx
<textarea 
  className="w-full h-32 rounded-lg bg-slate-900/50 border border-slate-700 
             focus:border-[theme]-500 focus:ring-2 focus:ring-[theme]-500/20 
             p-4 transition-all outline-none resize-none" 
/>
```

### 数字输入框
```tsx
<input 
  type="number"
  className="w-full rounded-lg bg-slate-900/50 border border-slate-700 
             focus:border-[theme]-500 focus:ring-2 focus:ring-[theme]-500/20 
             p-3 transition-all outline-none" 
  min={0}
  max={255}
/>
```

### 主要按钮
```tsx
<button className="px-6 py-3 rounded-lg bg-[theme]-600 hover:bg-[theme]-500 
                   text-white font-medium shadow-lg shadow-[theme]-500/20 
                   transition-all flex items-center justify-center gap-2">
  <svg className="w-5 h-5">...</svg>
  按钮文字
</button>
```

### 次要按钮
```tsx
<button className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 
                   text-slate-200 border border-slate-600 transition-all">
  按钮文字
</button>
```

### 小型按钮（如复制）
```tsx
<button className="text-xs px-3 py-1 rounded-md bg-[theme]-600/20 
                   hover:bg-[theme]-600/30 text-[theme]-300 
                   border border-[theme]-500/30 transition-colors">
  复制
</button>
```

### 输出显示框
```tsx
<div className="rounded-lg bg-slate-900/50 border border-slate-700 
                p-4 font-mono text-emerald-300 min-h-[80px]">
  {output || <span className="text-slate-500">结果将显示在这里</span>}
</div>
```

### 分隔符
```tsx
<div className="relative">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-slate-700/50" />
  </div>
  <div className="relative flex justify-center">
    <span className="bg-slate-800/80 px-4 text-slate-500 text-sm">⇅</span>
  </div>
</div>
```

### 网格布局（双栏）
```tsx
<div className="grid md:grid-cols-2 gap-4">
  <div>左侧内容</div>
  <div>右侧内容</div>
</div>
```

### 网格布局（三栏）
```tsx
<div className="grid md:grid-cols-3 gap-4">
  <div>栏1</div>
  <div>栏2</div>
  <div>栏3</div>
</div>
```

## 🎯 最佳实践

### 1. 间距统一
- 外层容器：`space-y-8`
- 区块内部：`space-y-4`
- 小元素间：`space-y-3`
- 内边距：`p-4`（小）、`p-6`（中）、`p-8`（大）

### 2. 圆角统一
- 输入框/按钮：`rounded-lg`（8px）
- 卡片容器：`rounded-lg` 或 `rounded-xl`（12px）
- 大容器：`rounded-2xl`（16px）

### 3. 边框统一
- 常规边框：`border border-slate-700`
- 半透明边框：`border border-slate-700/50`
- 主题色边框：`border border-[theme]-500/30`

### 4. 文字颜色
- 主标题：`text-slate-100` 或渐变
- 次标题：`text-slate-200`
- 标签：`text-slate-400`
- 提示：`text-slate-500`
- 输出结果：`text-emerald-300`

### 5. 背景透明度
- 主背景：`bg-slate-900/50`
- 卡片背景：`bg-slate-800/40`
- 提示背景：`bg-[theme]-500/5`

### 6. 阴影层次
- 小阴影：`shadow-sm`
- 中阴影：`shadow-lg`
- 大阴影：`shadow-xl`
- 主题色阴影：`shadow-lg shadow-[theme]-500/20`

## 📱 响应式断点

```tsx
// 手机（默认）
className="text-base"

// 平板及以上
className="md:text-lg"

// 桌面及以上
className="lg:text-xl"
```

常用响应式模式：
- `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- `hidden md:block`
- `px-4 md:px-6 lg:px-8`
- `text-2xl md:text-3xl lg:text-4xl`

## 🔍 SVG 图标

### Heroicons（推荐使用）
```tsx
// 复制图标
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
</svg>

// 下载图标
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
</svg>

// 刷新图标
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
</svg>

// 检查图标（成功）
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M5 13l4 4L19 7" />
</svg>
```

## 🚀 交互增强

### 复制功能
```tsx
const [copied, setCopied] = useState(false)

const copyToClipboard = async () => {
  await navigator.clipboard.writeText(text)
  setCopied(true)
  setTimeout(() => setCopied(false), 2000)
}

<button onClick={copyToClipboard}>
  {copied ? '已复制' : '复制'}
</button>
```

### 下载功能
```tsx
const download = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
```

---

**提示**：复制此模板，替换颜色主题，填充业务逻辑即可快速创建新工具页面！
