import type { ReactNode } from 'react'
import AdSlot from './AdSlot'

export default function ToolLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
  <div className="min-w-0 min-h-[calc(100vh-10rem)] flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        <footer className="mt-10 pt-6 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} Merged Tools · 稳定、可复现、值得依赖</div>
          <div className="space-x-3">
            <a className="hover:underline" href="/shortcuts">快捷键说明</a>
            <a className="hover:underline" href="/menu">所有工具</a>
            <a className="hover:underline" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </footer>
      </div>
      <div>
        <AdSlot />
      </div>
    </div>
  )
}
