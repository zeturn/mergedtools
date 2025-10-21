import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'

// 按钮变体类型
type ButtonVariant = 'default' | 'primary' | 'simple'

// 按钮属性
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

// 样式映射
const variantStyles = {
  default: 'inline-block px-4 py-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-lg font-medium text-center cursor-pointer transition-all outline-none hover:bg-slate-600 hover:border-slate-500 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
  primary: 'inline-block px-4 py-2 bg-gradient-to-br from-indigo-500 to-violet-500 text-white border border-indigo-500 rounded-lg font-medium text-center cursor-pointer transition-all outline-none hover:from-indigo-600 hover:to-violet-600 hover:border-indigo-600 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
  simple: 'btn'
}

/**
 * 统一的按钮组件
 * 
 * @example
 * ```tsx
 * <Button onClick={handleClick} variant="primary">
 *   提交
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const baseClassName = variantStyles[variant]
    const finalClassName = className ? `${baseClassName} ${className}` : baseClassName
    
    return (
      <button ref={ref} className={finalClassName} {...props}>
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
