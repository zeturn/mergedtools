import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { Suspense, useEffect, useMemo } from 'react'
import Home from './pages/Home'
import { tools } from './tools/registry'
import './App.css'
import SidebarMenu from './components/SidebarMenu'
import Menu from './pages/Menu'
import ToolLayout from './components/ToolLayout'
import ShortcutProvider from './shortcuts/ShortcutProvider'
import ShortcutsHelp from './components/ShortcutsHelp'
import QuickSwitcher from './components/QuickSwitcher'
import Shortcuts from './pages/Shortcuts'
import { setMeta } from './utils/seo'
import { useCanonical } from './hooks/useCanonical'

function App() {
  const loc = useLocation()
  const standalone = useMemo(() => loc.pathname === '/' || loc.pathname === '/menu', [loc.pathname])
  useCanonical(loc.pathname)

  // Basic per-route SEO fallbacks
  useEffect(() => {
    if (loc.pathname === '/') {
      setMeta({ title: 'Merged Tools · 在线工具集合', description: '比 AI 更稳定、可复现、值得依赖的在线工具集合。' })
    } else if (loc.pathname === '/menu') {
      setMeta({ title: '工具目录 · Merged Tools', description: '浏览与搜索所有在线实用工具。' })
    } else if (loc.pathname === '/shortcuts') {
      setMeta({ title: '快捷键说明 · Merged Tools', description: '全局快捷键帮助与设计原则。' })
    } else if (loc.pathname.startsWith('/')) {
      const seg = loc.pathname.slice(1)
      const t = tools.find(x => x.meta.id === seg)
      if (t) setMeta({ title: `${t.meta.name} · Merged Tools`, description: t.meta.desc ?? '在线实用工具', keywords: t.meta.keywords, ogImage: t.meta.ogImage })
      else setMeta({ title: 'Merged Tools', description: '在线实用工具集合' })
    }
  }, [loc.pathname])

  return (
    <ShortcutProvider>
      {standalone ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* 独立页面：不显示全局头部与侧栏，由各自页面负责头部/布局 */}
          <main className="min-w-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/shortcuts" element={<Shortcuts />} />
              {tools.map((t) => (
                <Route
                  key={t.meta.id}
                  path={`/${t.meta.id}`}
                  element={
                    <ToolLayout>
                      <Suspense fallback={<div className="text-slate-400">加载中…</div>}><t.Component /></Suspense>
                    </ToolLayout>
                  }
                />
              ))}
            </Routes>
          </main>
        </div>
      ) : (
        <div className="w-full px-0 sm:px-2 lg:px-4 py-6">
          {/* Enhanced header with glassmorphism effect */}
          <header className="mb-8 rounded-2xl border border-slate-700/50 bg-gradient-to-r from-slate-800/40 to-slate-800/20 backdrop-blur-sm px-6 py-5 shadow-xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <Link to="/" className="text-3xl sm:text-4xl font-extrabold tracking-tight block bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-cyan-300 to-emerald-300 hover:from-indigo-200 hover:via-cyan-200 hover:to-emerald-200 transition-all">
                  Merged Tools
                </Link>
                <p className="text-slate-400 mt-2 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  实用工具集合 · 稳定、可复现、值得依赖
                </p>
              </div>
              <nav className="hidden sm:flex gap-2 text-sm">
                <NavLink to="/" className={({isActive})=>`px-4 py-2 rounded-lg transition-all ${isActive? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20':'bg-slate-800/60 text-slate-200 hover:bg-slate-700 border border-slate-700/50'}`}>首页</NavLink>
                <NavLink to="/menu" className={({isActive})=>`px-4 py-2 rounded-lg transition-all ${isActive? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20':'bg-slate-800/60 text-slate-200 hover:bg-slate-700 border border-slate-700/50'}`}>工具目录</NavLink>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-slate-800/60 text-slate-200 hover:bg-slate-700 border border-slate-700/50 transition-all">GitHub</a>
              </nav>
            </div>
          </header>

          <div className="flex gap-4 sm:gap-6">
            <div>
              <SidebarMenu />
            </div>
            <main className="flex-1 min-w-0">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/shortcuts" element={<Shortcuts />} />
                {tools.map((t) => (
                  <Route
                    key={t.meta.id}
                    path={`/${t.meta.id}`}
                    element={
                      <ToolLayout>
                        <Suspense fallback={
                          <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                              <span className="text-slate-400">加载中…</span>
                            </div>
                          </div>
                        }>
                          <t.Component />
                        </Suspense>
                      </ToolLayout>
                    }
                  />
                ))}
              </Routes>
            </main>
          </div>
        </div>
      )}
      {/* Global overlays */}
      <ShortcutsHelp />
      <QuickSwitcher />
    </ShortcutProvider>
  )
}

export default App
