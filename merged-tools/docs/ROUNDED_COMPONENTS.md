# 圆角表单组件更新说明

## 概述

所有表单元素（输入框、文本域、按钮、下拉框）现在都统一使用圆角样式（`rounded-lg` / `0.5rem`），提供更现代化的视觉体验。

## 更新内容

### 1. 输入框和文本域 (Input & Textarea)

#### 组件位置
- `src/components/Input.tsx`

#### 样式特点
- ✅ 圆角边框：`border-radius: 0.5rem` (8px)
- ✅ 深色半透明背景
- ✅ 焦点时紫色光晕效果
- ✅ 平滑过渡动画

#### 使用方式

```tsx
import { Input, Textarea } from '../../components/Input'

// Modern 样式 (默认) - 内联样式
<Input 
  value={text}
  onChange={(e) => setText(e.target.value)}
  placeholder="输入内容..."
/>

// Simple 样式 - 使用全局CSS类
<Input 
  variant="simple"
  value={text}
  onChange={(e) => setText(e.target.value)}
/>

// Textarea
<Textarea 
  value={content}
  onChange={(e) => setContent(e.target.value)}
  rows={6}
/>
```

### 2. 按钮 (Button)

#### 组件位置
- `src/components/Button.tsx`

#### 样式变体

**Default (默认灰色)**
```tsx
import Button from '../../components/Button'

<Button onClick={handleClick}>
  普通按钮
</Button>
```

**Primary (主要按钮 - 渐变紫色)**
```tsx
<Button variant="primary" onClick={handleSubmit}>
  提交
</Button>
```

**Simple (使用全局.btn类)**
```tsx
<Button variant="simple" onClick={handleClick}>
  简单按钮
</Button>
```

#### 按钮特性
- ✅ 圆角：`border-radius: 0.5rem`
- ✅ 悬停效果：轻微上浮 + 阴影
- ✅ 点击反馈：下压效果
- ✅ 禁用状态：半透明 + 禁用交互
- ✅ Primary变体：紫色渐变背景

### 3. 下拉框 (Select)

#### 组件位置
- `src/components/Select.tsx`

#### 使用方式

```tsx
import Select from '../../components/Select'

// Modern 样式 (默认)
<Select value={value} onChange={(e) => setValue(e.target.value)}>
  <option value="1">选项1</option>
  <option value="2">选项2</option>
  <option value="3">选项3</option>
</Select>

// Simple 样式
<Select variant="simple" value={value} onChange={handleChange}>
  <option>选择...</option>
</Select>
```

#### Select特性
- ✅ 圆角边框
- ✅ 自定义下拉箭头图标
- ✅ 深色主题适配
- ✅ 焦点光晕效果

### 4. 全局CSS类

在 `src/index.css` 中定义，可直接使用：

```tsx
// 使用全局类名
<input className="input" />
<textarea className="textarea" />
<select className="select" />
<button className="btn" />
<button className="btn btn-primary" />
```

#### 全局样式特点
- `.input`, `.textarea`, `.select` - 统一的表单元素样式
- `.btn` - 基础按钮样式
- `.btn-primary` - 主要按钮样式（紫色渐变）
- 所有元素都是圆角（`border-radius: 0.5rem`）

## 完整示例

### 表单页面示例

```tsx
import { useState } from 'react'
import { Input, Textarea } from '../../components/Input'
import Button from '../../components/Button'
import Select from '../../components/Select'

export default function FormPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [type, setType] = useState('general')
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    console.log({ name, email, type, message })
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">联系表单</h1>

      {/* 输入框 - 圆角 */}
      <div>
        <label className="block text-sm mb-2">姓名</label>
        <Input 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="请输入姓名"
        />
      </div>

      {/* 输入框 - Email */}
      <div>
        <label className="block text-sm mb-2">邮箱</label>
        <Input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
        />
      </div>

      {/* 下拉框 - 圆角 */}
      <div>
        <label className="block text-sm mb-2">类型</label>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="general">一般咨询</option>
          <option value="support">技术支持</option>
          <option value="feedback">反馈建议</option>
        </Select>
      </div>

      {/* 文本域 - 圆角 */}
      <div>
        <label className="block text-sm mb-2">留言</label>
        <Textarea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="请输入您的留言..."
          rows={6}
        />
      </div>

      {/* 按钮组 - 圆角 */}
      <div className="flex gap-3">
        <Button variant="primary" onClick={handleSubmit}>
          提交
        </Button>
        <Button onClick={() => {
          setName('')
          setEmail('')
          setType('general')
          setMessage('')
        }}>
          重置
        </Button>
      </div>
    </div>
  )
}
```

### 工具页面示例

```tsx
import { useState } from 'react'
import { Textarea } from '../../components/Input'
import Button from '../../components/Button'
import Select from '../../components/Select'

export default function ToolPage() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('encode')
  const [output, setOutput] = useState('')

  const handleProcess = () => {
    // 处理逻辑
    setOutput(input.toUpperCase())
  }

  return (
    <div className="space-y-4">
      {/* 模式选择 - 圆角下拉框 */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">模式:</label>
        <Select 
          value={mode} 
          onChange={(e) => setMode(e.target.value)}
          className="w-48"
        >
          <option value="encode">编码</option>
          <option value="decode">解码</option>
        </Select>
      </div>

      {/* 输入区 - 圆角文本域 */}
      <div>
        <label className="block text-sm text-slate-400 mb-2">输入</label>
        <Textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="在这里输入文本..."
        />
      </div>

      {/* 操作按钮 - 圆角 */}
      <div className="flex gap-2">
        <Button variant="primary" onClick={handleProcess}>
          处理
        </Button>
        <Button onClick={() => setInput('')}>
          清空
        </Button>
      </div>

      {/* 输出区 - 圆角文本域 */}
      <div>
        <label className="block text-sm text-slate-400 mb-2">输出</label>
        <Textarea 
          value={output}
          readOnly
          className="font-mono"
        />
      </div>
    </div>
  )
}
```

### 使用全局类名（兼容旧代码）

```tsx
export default function LegacyPage() {
  return (
    <div className="space-y-4">
      {/* 这些仍然有圆角效果 */}
      <input className="input" placeholder="输入框" />
      <textarea className="textarea" placeholder="文本域" />
      <select className="select">
        <option>选项1</option>
      </select>
      <button className="btn">普通按钮</button>
      <button className="btn btn-primary">主要按钮</button>
    </div>
  )
}
```

## 视觉效果

### 圆角尺寸
- **统一圆角**: `0.5rem` (8px)
- 适中的圆角提供现代感，同时不失专业感

### 交互效果

**输入框/文本域/下拉框**
- 默认: 灰色边框
- 悬停: 无变化
- 焦点: 紫色边框 + 紫色光晕

**按钮**
- 默认: 灰色背景
- 悬停: 上浮1px + 阴影
- 点击: 下压效果
- Primary: 紫色渐变背景

## 迁移指南

### 从旧代码迁移

**之前:**
```tsx
<input className="input" />
<button className="btn">点击</button>
```

**现在 (推荐):**
```tsx
import { Input } from '../../components/Input'
import Button from '../../components/Button'

<Input />
<Button>点击</Button>
```

**现在 (兼容方式):**
```tsx
// 旧代码仍然有效，全局CSS已更新
<input className="input" />
<button className="btn">点击</button>
```

## 优势

1. ✅ **视觉统一**: 所有表单元素统一圆角风格
2. ✅ **现代化**: 圆角设计更符合现代UI趋势
3. ✅ **易用性**: 组件化封装，使用简单
4. ✅ **向后兼容**: 全局CSS确保旧代码仍然工作
5. ✅ **可定制**: 支持通过className添加自定义样式
6. ✅ **类型安全**: TypeScript完整支持

## 注意事项

1. **优先使用组件**: 新代码推荐使用 `Input`、`Button`、`Select` 组件
2. **variant选择**: 
   - `modern` - 现代深色主题，适合新页面
   - `simple` - 使用全局CSS类，适合保持一致性
3. **保持一致**: 同一页面内尽量使用相同的variant
4. **特殊类型**: checkbox、radio等特殊input仍使用原生标签

## 文件位置

- Input组件: `src/components/Input.tsx`
- Button组件: `src/components/Button.tsx`
- Select组件: `src/components/Select.tsx`
- 全局样式: `src/index.css`
