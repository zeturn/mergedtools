import type { ReactNode } from 'react'

export default function AdSlot({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border-2 border-dashed border-slate-700/50 bg-gradient-to-br from-slate-800/40 to-slate-800/20 backdrop-blur-sm p-6 text-center text-slate-400 shadow-lg ${className}`}
      aria-label="广告区域"
    >
      {children ?? (
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-slate-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <div className="space-y-1">
            <span className="block text-sm font-medium text-slate-300">无广告体验</span>
            <span className="block text-xs text-slate-500">感谢您的使用</span>
          </div>
        </div>
      )}
    </div>
  )
}
