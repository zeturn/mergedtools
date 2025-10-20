import type { ReactNode } from 'react'

export default function AdSlot({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-lg border-2 border-dashed border-slate-700 bg-slate-800/60 p-5 text-center text-slate-400 shadow-sm ${className}`}
      aria-label="广告区域"
    >
      {children ?? (
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-700/60 border border-slate-600" />
          <span>我们已为您关闭广告</span>
        </div>
      )}
    </div>
  )
}
