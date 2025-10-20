export default function ShortcutHints() {
  const hints = [
    { k: ['G', 'S'], t: '打开菜单 (Get Start)' },
    { k: ['/'], t: '快速搜索工具' },
    { k: ['Ctrl', 'C'], t: '一键复制结果' },
  ]
  return (
    <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-400">
      {hints.map(h => (
        <div key={h.t} className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1">
          <span className="flex items-center gap-1">
            {h.k.map((kk, i) => (
              <kbd key={i} className="rounded-md bg-slate-700/70 px-2 py-0.5 text-slate-200 border border-slate-600">
                {kk}
              </kbd>
            ))}
          </span>
          <span className="hidden sm:inline">{h.t}</span>
        </div>
      ))}
    </div>
  )
}
