# Input 组件使用示例

## 快速开始

### 1. 基本的文本输入框

```tsx
import { useState } from 'react'
import Input from '../../components/Input'

export default function BasicInputExample() {
  const [text, setText] = useState('')

  return (
    <div>
      <Input 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="输入一些文本..."
      />
    </div>
  )
}
```

### 2. 多行文本输入 (Textarea)

```tsx
import { useState } from 'react'
import { Textarea } from '../../components/Input'

export default function TextareaExample() {
  const [content, setContent] = useState('')

  return (
    <div>
      <Textarea 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="输入多行文本..."
        rows={8}
      />
    </div>
  )
}
```

### 3. 完整表单示例

```tsx
import { useState } from 'react'
import { Input, Textarea } from '../../components/Input'

export default function FormExample() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')

  const handleSubmit = () => {
    console.log({ title, description, tags })
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold">创建新项目</h2>
      
      {/* 标题 - 使用modern样式 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">项目标题</label>
        <Input 
          variant="modern"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入项目标题..."
        />
      </div>

      {/* 描述 - 使用modern样式 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">项目描述</label>
        <Textarea 
          variant="modern"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="输入详细描述..."
          rows={6}
        />
      </div>

      {/* 标签 - 使用simple样式 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">标签（逗号分隔）</label>
        <Input 
          variant="simple"
          className="w-full"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="react, typescript, vite"
        />
      </div>

      <button 
        onClick={handleSubmit}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        创建项目
      </button>
    </div>
  )
}
```

### 4. 工具页面示例

```tsx
import { useState, useMemo } from 'react'
import { Textarea } from '../../components/Input'

export default function ToolPage() {
  const [input, setInput] = useState('')
  
  const output = useMemo(() => {
    // 处理输入
    return input.toUpperCase()
  }, [input])

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-slate-400 mb-2">输入文本</label>
        <Textarea 
          variant="modern"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="在这里输入文本..."
        />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-2">输出结果</label>
        <Textarea 
          variant="modern"
          className="font-mono"
          value={output}
          readOnly
        />
      </div>
    </div>
  )
}
```

### 5. 与现有className配合

```tsx
import { Input, Textarea } from '../../components/Input'

export default function StyledExample() {
  return (
    <div className="space-y-4">
      {/* Input with custom width */}
      <Input 
        variant="simple"
        className="w-64"
        placeholder="固定宽度"
      />

      {/* Textarea with custom height and font */}
      <Textarea 
        variant="modern"
        className="h-32 font-mono text-sm"
        placeholder="自定义高度和字体"
      />

      {/* Input with grid layout */}
      <div className="grid grid-cols-2 gap-4">
        <Input variant="simple" placeholder="字段1" />
        <Input variant="simple" placeholder="字段2" />
      </div>
    </div>
  )
}
```

### 6. 特殊类型的输入

```tsx
import Input from '../../components/Input'

export default function SpecialTypesExample() {
  return (
    <div className="space-y-4">
      {/* 数字输入 */}
      <Input 
        type="number"
        variant="simple"
        min={0}
        max={100}
        placeholder="输入数字 (0-100)"
      />

      {/* 日期输入 */}
      <Input 
        type="date"
        variant="simple"
      />

      {/* Email输入 */}
      <Input 
        type="email"
        variant="modern"
        placeholder="输入邮箱地址"
      />

      {/* URL输入 */}
      <Input 
        type="url"
        variant="modern"
        placeholder="输入网址"
      />
    </div>
  )
}
```

### 7. 只读和禁用状态

```tsx
import { Input, Textarea } from '../../components/Input'

export default function StateExample() {
  return (
    <div className="space-y-4">
      {/* 只读 */}
      <Input 
        variant="modern"
        value="这是只读文本"
        readOnly
      />

      {/* 禁用 */}
      <Input 
        variant="modern"
        value="这是禁用输入"
        disabled
      />

      {/* 只读的Textarea */}
      <Textarea 
        variant="modern"
        value="这是只读的多行文本\n第二行\n第三行"
        readOnly
      />
    </div>
  )
}
```

## 样式对比

### Modern样式
- ✨ 现代深色主题
- ✨ 渐变边框效果
- ✨ 平滑过渡动画
- ✨ 焦点状态突出
- 🎯 适合: Base64、Hash、UUID等现代风格页面

### Simple样式
- 📦 使用全局CSS类
- 📦 保持原有样式
- 📦 易于自定义
- 🎯 适合: 工具页面、表单页面

## 最佳实践

1. **选择合适的variant**
   - 新页面使用 `modern`
   - 保持原样式使用 `simple`

2. **合理使用placeholder**
   ```tsx
   <Input placeholder="清晰的提示文字..." />
   ```

3. **配合label使用**
   ```tsx
   <label className="block text-sm mb-2">
     字段名称
     <Input className="mt-1" />
   </label>
   ```

4. **处理表单验证**
   ```tsx
   <Input 
     required
     pattern="[A-Za-z]+"
     title="只能输入字母"
   />
   ```

5. **性能优化**
   ```tsx
   const handleChange = useCallback((e) => {
     setValue(e.target.value)
   }, [])
   
   <Input onChange={handleChange} />
   ```

## 迁移清单

- [x] 创建Input组件
- [x] 批量迁移所有工具页面
- [x] 批量迁移所有主页面
- [x] 更新SearchBar组件
- [x] 清理未使用导入
- [x] 验证编译通过
- [x] 编写文档和示例
