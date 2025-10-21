import type { ReactNode } from 'react'
import AdSlot from './AdSlot'

export default function ToolLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
      <div className="min-w-0 min-h-[calc(100vh-10rem)] flex flex-col">
        {/* Main content area with enhanced styling */}
        <div className="flex-1 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/40 to-slate-800/20 backdrop-blur-sm p-6 md:p-8 shadow-xl">
          {children}
        </div>
        
        {/* Enhanced footer */}
        <footer className="mt-8 pt-6 border-t border-slate-700/50 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>© {new Date().getFullYear()} Merged Tools · 稳定、可复现、值得依赖</span>
          </div>
          <div className="flex gap-3">
            <a className="hover:text-slate-200 transition-colors hover:underline" href="/shortcuts">快捷键说明</a>
            <span className="text-slate-600">·</span>
            <a className="hover:text-slate-200 transition-colors hover:underline" href="/menu">所有工具</a>
            <span className="text-slate-600">·</span>
            <a className="hover:text-slate-200 transition-colors hover:underline" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </footer>
      </div>
      
      {/* Sidebar with sticky positioning */}
      <div className="lg:sticky lg:top-6">
        <AdSlot />
      </div>
    </div>
  )
}
