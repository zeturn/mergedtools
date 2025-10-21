import { useState } from 'react'
import { Input, Textarea } from '../components/Input'
import Button from '../components/Button'
import Select from '../components/Select'

/**
 * 圆角组件展示页面
 * 展示所有统一的圆角表单元素
 */
export default function RoundedComponentsDemo() {
  const [inputValue, setInputValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')
  const [selectValue, setSelectValue] = useState('option1')

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* 标题 */}
      <div className="border-b border-slate-700/50 pb-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-cyan-300">
          圆角组件展示
        </h1>
        <p className="text-slate-400 mt-2">所有表单元素都使用统一的圆角样式 (border-radius: 0.5rem)</p>
      </div>

      {/* Input组件 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-cyan-500 rounded-full" />
          输入框 (Input)
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Modern 变体 (默认)</label>
            <Input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="现代风格圆角输入框..."
            />
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-2">Simple 变体</label>
            <Input 
              variant="simple"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="简单风格圆角输入框..."
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Email 类型</label>
            <Input 
              type="email"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-2">Number 类型</label>
            <Input 
              type="number"
              placeholder="输入数字..."
              min={0}
              max={100}
            />
          </div>
        </div>
      </section>

      {/* Textarea组件 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-full" />
          文本域 (Textarea)
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Modern 变体</label>
            <Textarea 
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
              placeholder="现代风格圆角文本域..."
              rows={4}
            />
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-2">Simple 变体</label>
            <Textarea 
              variant="simple"
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
              placeholder="简单风格圆角文本域..."
              rows={4}
            />
          </div>
        </div>
      </section>

      {/* Select组件 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
          下拉框 (Select)
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Modern 变体</label>
            <Select 
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
            >
              <option value="option1">选项 1 - 现代风格</option>
              <option value="option2">选项 2 - 圆角边框</option>
              <option value="option3">选项 3 - 自定义箭头</option>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-2">Simple 变体</label>
            <Select 
              variant="simple"
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
            >
              <option value="option1">选项 1 - 简单风格</option>
              <option value="option2">选项 2 - 圆角边框</option>
              <option value="option3">选项 3 - 全局样式</option>
            </Select>
          </div>
        </div>
      </section>

      {/* Button组件 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-rose-500 to-orange-500 rounded-full" />
          按钮 (Button)
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Default 变体</label>
            <div className="flex flex-wrap gap-3">
              <Button>普通按钮</Button>
              <Button disabled>禁用按钮</Button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Primary 变体 (紫色渐变)</label>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">主要按钮</Button>
              <Button variant="primary" disabled>禁用主要按钮</Button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Simple 变体</label>
            <div className="flex flex-wrap gap-3">
              <Button variant="simple">简单按钮</Button>
              <Button variant="simple" className="btn-primary">简单主要按钮</Button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">不同尺寸</label>
            <div className="flex flex-wrap items-center gap-3">
              <Button className="px-2 py-1 text-sm">小按钮</Button>
              <Button>中等按钮</Button>
              <Button className="px-6 py-3 text-lg">大按钮</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 组合示例 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
          完整表单示例
        </h2>
        
        <div className="rounded-lg bg-slate-900/50 border border-slate-700 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">姓名</label>
            <Input placeholder="请输入姓名" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">邮箱</label>
            <Input type="email" placeholder="your@email.com" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">类型</label>
            <Select>
              <option>选择类型...</option>
              <option>个人</option>
              <option>企业</option>
              <option>其他</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">留言</label>
            <Textarea placeholder="请输入您的留言..." rows={4} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="primary">提交</Button>
            <Button>重置</Button>
          </div>
        </div>
      </section>

      {/* 传统全局类名示例 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-red-500 rounded-full" />
          传统全局类名 (向后兼容)
        </h2>
        
        <div className="rounded-lg bg-slate-900/50 border border-slate-700 p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">使用 .input 类</label>
            <input className="input" placeholder="全局CSS类样式" />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">使用 .textarea 类</label>
            <textarea className="textarea" rows={3} placeholder="全局CSS类样式" />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">使用 .select 类</label>
            <select className="select">
              <option>选项 1</option>
              <option>选项 2</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">使用 .btn 类</label>
            <div className="flex gap-2">
              <button className="btn">普通按钮</button>
              <button className="btn btn-primary">主要按钮</button>
            </div>
          </div>
        </div>
      </section>

      {/* 信息提示 */}
      <div className="rounded-lg bg-indigo-500/5 border border-indigo-500/20 p-4">
        <div className="flex gap-3">
          <div className="text-indigo-400 text-lg">💡</div>
          <div className="text-sm text-slate-300">
            <p className="font-medium text-indigo-300 mb-1">样式说明</p>
            <ul className="text-slate-400 space-y-1 list-disc list-inside">
              <li>所有组件都使用 <code className="text-indigo-300">border-radius: 0.5rem</code> (8px圆角)</li>
              <li>支持两种变体: <code className="text-indigo-300">modern</code> (默认内联样式) 和 <code className="text-indigo-300">simple</code> (全局CSS类)</li>
              <li>悬停和焦点状态都有平滑的过渡动画</li>
              <li>按钮支持悬停上浮效果和点击下压反馈</li>
              <li>全局CSS类确保旧代码向后兼容</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
