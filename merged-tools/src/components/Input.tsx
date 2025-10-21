import { forwardRef } from 'react'
import type { TextareaHTMLAttributes, InputHTMLAttributes } from 'react'

// 输入框变体类型
type InputVariant = 'modern' | 'simple'

// 文本输入框属性
interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant
}

// 文本域属性
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: InputVariant
}

// 样式映射
const variantStyles = {
  modern: {
    input: 'w-full rounded-lg bg-slate-900/50 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 p-3 transition-all outline-none',
    textarea: 'w-full rounded-lg bg-slate-900/50 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 p-4 transition-all outline-none resize-none'
  },
  simple: {
    input: 'input',
    textarea: 'textarea'
  }
}

/**
 * 统一的文本输入框组件
 * 
 * @example
 * ```tsx
 * <Input 
 *   value={value} 
 *   onChange={(e) => setValue(e.target.value)}
 *   placeholder="请输入内容"
 *   variant="modern"
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, TextInputProps>(
  ({ variant = 'modern', className, ...props }, ref) => {
    const baseClassName = variantStyles[variant].input
    const finalClassName = className ? `${baseClassName} ${className}` : baseClassName
    
    return <input ref={ref} className={finalClassName} {...props} />
  }
)

Input.displayName = 'Input'

/**
 * 统一的文本域组件
 * 
 * @example
 * ```tsx
 * <Textarea 
 *   value={value} 
 *   onChange={(e) => setValue(e.target.value)}
 *   placeholder="请输入多行文本"
 *   rows={6}
 *   variant="modern"
 * />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ variant = 'modern', className, rows = 6, ...props }, ref) => {
    const baseClassName = variantStyles[variant].textarea
    const finalClassName = className ? `${baseClassName} ${className}` : baseClassName
    
    return <textarea ref={ref} className={finalClassName} rows={rows} {...props} />
  }
)

Textarea.displayName = 'Textarea'

// 默认导出Input，同时导出Textarea
export default Input
