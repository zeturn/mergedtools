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
          <header className="mb-6 flex items-end justify-between gap-4 px-2 sm:px-0">
            <div>
              <Link to="/" className="text-3xl sm:text-4xl font-extrabold tracking-tight block">Merged Tools</Link>
              <p className="text-slate-400 mt-1">实用工具集合 · 稳定、可复现、值得依赖</p>
            </div>
            <nav className="hidden sm:flex gap-3 text-sm">
              <NavLink to="/" className={({isActive})=>`px-3 py-1 rounded ${isActive? 'bg-slate-700 text-white':'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}>首页</NavLink>
              <NavLink to="/menu" className={({isActive})=>`px-3 py-1 rounded ${isActive? 'bg-slate-700 text-white':'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}>工具目录</NavLink>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="px-3 py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700">GitHub</a>
            </nav>
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
                        <Suspense fallback={<div className="text-slate-400">加载中…</div>}><t.Component /></Suspense>
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
