# Input 组件文档

## 概述

项目已经统一了所有的输入框组件，提供了可复用的 `Input` 和 `Textarea` 组件。

## 组件位置

`src/components/Input.tsx`

## 使用方法

### 基本导入

```tsx
// 导入 Input（文本输入框）
import Input from '../../components/Input'

// 导入 Textarea（文本域）
import { Textarea } from '../../components/Input'

// 同时导入两者
import { Input, Textarea } from '../../components/Input'
```

### Input 组件

用于单行文本输入。

```tsx
<Input 
  value={value} 
  onChange={(e) => setValue(e.target.value)}
  placeholder="请输入内容"
  variant="modern" // 或 "simple"
/>
```

#### Props

- `variant`: 样式变体
  - `"modern"` (默认): 现代深色主题样式，带渐变边框和焦点效果
  - `"simple"`: 简单样式，使用全局 CSS 类 `.input`
- 其他所有标准的 HTML input 属性都支持

#### 样式说明

**Modern 样式** (默认):
- 深色半透明背景
- 灰色边框，焦点时显示紫色渐变
- 平滑的过渡动画
- 适合现代深色主题页面

**Simple 样式**:
- 使用全局定义的 `.input` 类
- 适合需要自定义样式或保持一致性的场景

### Textarea 组件

用于多行文本输入。

```tsx
<Textarea 
  value={value} 
  onChange={(e) => setValue(e.target.value)}
  placeholder="请输入多行文本"
  rows={6}
  variant="modern" // 或 "simple"
/>
```

#### Props

- `variant`: 样式变体（同 Input）
- `rows`: 行数，默认为 6
- 其他所有标准的 HTML textarea 属性都支持

## 示例

### 示例 1: 简单表单

```tsx
import { useState } from 'react'
import { Input, Textarea } from '../../components/Input'

export default function Page() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  return (
    <div className="space-y-4">
      <Input 
        placeholder="输入名称"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Textarea 
        placeholder="输入描述"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
  )
}
```

### 示例 2: 使用 Simple 变体

```tsx
<Input 
  variant="simple"
  className="w-full"
  value={input}
  onChange={(e) => setInput(e.target.value)}
/>
```

### 示例 3: 特殊类型的 Input

对于特殊类型（如 number, date 等），仍然支持：

```tsx
<Input 
  type="number"
  min={0}
  max={100}
  value={count}
  onChange={(e) => setCount(Number(e.target.value))}
/>

<Input 
  type="date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
/>
```

### 示例 4: 自定义样式

可以通过 `className` 属性添加额外的样式：

```tsx
<Input 
  variant="modern"
  className="font-mono text-sm"
  value={code}
  onChange={(e) => setCode(e.target.value)}
/>

<Textarea 
  variant="simple"
  className="h-32 font-mono"
  value={json}
  onChange={(e) => setJson(e.target.value)}
/>
```

## 迁移指南

项目已经自动迁移了所有输入框。如果你需要创建新的输入框：

### 旧方式
```tsx
<input className="input" value={value} onChange={handleChange} />
<textarea className="textarea h-48" value={text} onChange={handleChange} />
```

### 新方式
```tsx
<Input variant="simple" value={value} onChange={handleChange} />
<Textarea variant="simple" className="h-48" value={text} onChange={handleChange} />
```

## 注意事项

1. **特殊类型的 input** (checkbox, radio, file, color 等) 仍然使用原生的 `<input>` 标签
2. **className 优先级**: 传入的 `className` 会与基础样式合并
3. **variant 选择**: 
   - 在现代风格的页面中使用 `variant="modern"`
   - 在需要保持原有样式的页面中使用 `variant="simple"`

## 统计信息

- 已迁移文件: 161 个
- 输入框替换: 161 个
- 文本域替换: 82 个

## 相关文件

- 组件实现: `src/components/Input.tsx`
- 迁移脚本: `scripts/migrate-to-input-component.mjs`
