# 圆角样式更新 - 快速参考

## 🎯 核心更新

所有表单元素现在都有**统一的圆角**：`border-radius: 0.5rem` (8px)

## 📦 组件清单

| 组件 | 文件位置 | 全局CSS类 | 圆角 |
|------|---------|-----------|------|
| Input | `src/components/Input.tsx` | `.input` | ✅ 8px |
| Textarea | `src/components/Input.tsx` | `.textarea` | ✅ 8px |
| Button | `src/components/Button.tsx` | `.btn` | ✅ 8px |
| Select | `src/components/Select.tsx` | `.select` | ✅ 8px |

## 🎨 样式变体

### Input & Textarea
```tsx
// Modern (默认) - 内联样式
<Input value={v} onChange={e => setV(e.target.value)} />

// Simple - 全局CSS类  
<Input variant="simple" value={v} onChange={e => setV(e.target.value)} />

// 原生HTML + 全局类（向后兼容）
<input className="input" />
```

### Button
```tsx
// Default - 灰色
<Button onClick={handle}>普通</Button>

// Primary - 紫色渐变
<Button variant="primary" onClick={handle}>主要</Button>

// Simple - 全局类
<Button variant="simple">简单</Button>

// 原生HTML + 全局类
<button className="btn">按钮</button>
<button className="btn btn-primary">主要按钮</button>
```

### Select
```tsx
// Modern (默认)
<Select value={v} onChange={e => setV(e.target.value)}>
  <option>选项</option>
</Select>

// Simple - 全局类
<Select variant="simple">
  <option>选项</option>
</Select>

// 原生HTML + 全局类
<select className="select">
  <option>选项</option>
</select>
```

## 🎭 交互效果

### 输入类元素 (Input/Textarea/Select)
- **默认**: 灰色边框
- **焦点**: 紫色边框 + 紫色光晕
- **圆角**: 8px

### 按钮 (Button)
- **默认**: 灰色背景
- **悬停**: 上浮1px + 阴影
- **点击**: 下压效果
- **禁用**: 半透明
- **Primary**: 紫色渐变背景
- **圆角**: 8px

## 📝 快速示例

### 完整表单
```tsx
import { Input, Textarea } from '../../components/Input'
import Button from '../../components/Button'
import Select from '../../components/Select'

function MyForm() {
  return (
    <div className="space-y-4">
      {/* 输入框 - 圆角 */}
      <Input placeholder="姓名" />
      
      {/* 下拉框 - 圆角 */}
      <Select>
        <option>选择类型</option>
      </Select>
      
      {/* 文本域 - 圆角 */}
      <Textarea placeholder="留言" rows={4} />
      
      {/* 按钮组 - 圆角 */}
      <div className="flex gap-2">
        <Button variant="primary">提交</Button>
        <Button>取消</Button>
      </div>
    </div>
  )
}
```

## 🔗 相关文档

- 详细文档: `docs/ROUNDED_COMPONENTS.md`
- 更新总结: `docs/ROUNDED_UPDATE_SUMMARY.md`
- 展示页面: `src/pages/RoundedDemo.tsx`
- 全局样式: `src/index.css`

## ✨ 关键特性

1. ✅ **统一圆角** - 所有元素8px圆角
2. ✅ **深色主题** - 适配项目主题色
3. ✅ **平滑动画** - 所有交互都有过渡效果
4. ✅ **向后兼容** - 全局CSS确保旧代码仍工作
5. ✅ **TypeScript** - 完整类型支持
6. ✅ **易用性** - 简单的API，一致的props

## 🎯 迁移提示

**旧代码（仍然有效）:**
```tsx
<input className="input" />
<button className="btn">点击</button>
```

**新代码（推荐）:**
```tsx
<Input />
<Button>点击</Button>
```

两种方式都有圆角效果！🎉
