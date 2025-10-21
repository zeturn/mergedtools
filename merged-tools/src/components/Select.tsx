import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'

// 下拉框变体类型
type SelectVariant = 'modern' | 'simple'

// 下拉框属性
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  variant?: SelectVariant
}

// 样式映射
const variantStyles = {
  modern: 'w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 transition-all outline-none appearance-none bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23e2e8f0\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")] bg-[length:1.5em_1.5em] bg-[position:right_0.5rem_center] bg-no-repeat pr-10 focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]',
  simple: 'select'
}

/**
 * 统一的下拉框组件
 * 
 * @example
 * ```tsx
 * <Select value={value} onChange={(e) => setValue(e.target.value)}>
 *   <option value="1">选项1</option>
 *   <option value="2">选项2</option>
 * </Select>
 * ```
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ variant = 'modern', className, children, ...props }, ref) => {
    const baseClassName = variantStyles[variant]
    const finalClassName = className ? `${baseClassName} ${className}` : baseClassName
    
    return (
      <select ref={ref} className={finalClassName} {...props}>
        {children}
      </select>
    )
  }
)

Select.displayName = 'Select'

export default Select
