import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { tools } from '../tools/registry'
import { ShortcutCtx } from './context'

function isTypingTarget(el: Element | null): boolean {
  if (!el) return false
  const tag = (el as HTMLElement).tagName?.toLowerCase()
  const editable = (el as HTMLElement).isContentEditable
  return editable || tag === 'input' || tag === 'textarea' || tag === 'select'
}

export default function ShortcutProvider({ children }: { children: React.ReactNode }) {
  const [helpOpen, setHelpOpen] = useState(false)
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const loc = useLocation()
  const navigate = useNavigate()
  const buf = useRef<string[]>([])
  const timer = useRef<number | null>(null)

  const resetBuf = useCallback(() => {
    buf.current = []
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = null
  }, [])

  const gotoPrevNextTool = useCallback((dir: -1 | 1) => {
    const ids = tools.map(t => t.meta.id)
    const path = loc.pathname.slice(1)
    const idx = ids.indexOf(path)
    if (idx === -1) return
    const ni = (idx + dir + ids.length) % ids.length
    navigate(`/${ids[ni]}`)
  }, [loc.pathname, navigate])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as Element | null
      const k = e.key
      const lower = k.toLowerCase()

      // Cmd/Ctrl+K: quick switcher
      if ((e.ctrlKey || e.metaKey) && lower === 'k') {
        e.preventDefault()
        setSwitcherOpen(true)
        return
      }

      // Esc: close modals
      if (lower === 'escape') {
        if (helpOpen) setHelpOpen(false)
        if (switcherOpen) setSwitcherOpen(false)
        return
      }

      // '?' 打开帮助（Shift+/）
      if (!isTypingTarget(target) && lower === '?' || (lower === '/' && e.shiftKey)) {
        e.preventDefault()
        setHelpOpen(v => !v)
        return
      }

      // 全局搜索聚焦：按 '/'
      if (!isTypingTarget(target) && lower === '/') {
        e.preventDefault()
        const el = document.getElementById('global-search') as HTMLInputElement | null
        el?.focus()
        return
      }

      // g h -> Home, g s -> Menu（独立页）
      if (!isTypingTarget(target)) {
        if (!timer.current) timer.current = window.setTimeout(resetBuf, 800)
        buf.current.push(lower)
        const s = buf.current.join(' ')
        if (s === 'g h') { navigate('/'); resetBuf(); return }
        if (s === 'g s') { navigate('/menu'); resetBuf(); return }
      }

      // 工具切换： [ / ]
      if (!isTypingTarget(target) && (lower === '[' || lower === ']')) {
        e.preventDefault()
        gotoPrevNextTool(lower === '[' ? -1 : 1)
        return
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [gotoPrevNextTool, helpOpen, switcherOpen, navigate, resetBuf])

  const value = useMemo(() => ({ helpOpen, setHelpOpen, switcherOpen, setSwitcherOpen }), [helpOpen, switcherOpen])
  return <ShortcutCtx.Provider value={value}>{children}</ShortcutCtx.Provider>
}
