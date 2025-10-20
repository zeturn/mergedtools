import { useShortcuts } from '../shortcuts/context'

const rows: { keys: string[]; desc: string }[] = [
  { keys: ['/',], desc: '聚焦全局搜索' },
  { keys: ['g','h'], desc: '前往首页' },
  { keys: ['g','s'], desc: '打开菜单' },
  { keys: ['Ctrl','K'], desc: '快速切换工具' },
  { keys: ['['], desc: '上一工具' },
  { keys: [']'], desc: '下一工具' },
  { keys: ['?'], desc: '显示/隐藏快捷键帮助' },
  { keys: ['Esc'], desc: '关闭弹窗/面板' },
]

export default function ShortcutsHelp() {
  const { helpOpen, setHelpOpen } = useShortcuts()
  if (!helpOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={()=>setHelpOpen(false)} />
      <div className="relative z-10 w-[min(640px,92vw)] rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">快捷键</h3>
          <button className="text-slate-400 hover:text-white" onClick={()=>setHelpOpen(false)}>×</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rows.map((r) => (
            <div key={r.desc} className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 p-3">
              <div className="flex items-center gap-1">
                {r.keys.map((k, i) => (
                  <kbd key={i} className="rounded-md bg-slate-700/70 px-2 py-0.5 text-slate-200 border border-slate-600 text-xs">{k}</kbd>
                ))}
              </div>
              <div className="text-sm text-slate-300">{r.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
