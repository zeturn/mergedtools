export default function Shortcuts() {
  const groups: { title: string; items: { keys: string[]; desc: string; note?: string }[] }[] = [
    {
      title: '导航',
      items: [
        { keys: ['g','h'], desc: '前往首页' },
        { keys: ['g','s'], desc: '打开菜单' },
        { keys: ['['], desc: '上一工具', note: '在工具详情页有效' },
        { keys: [']'], desc: '下一工具', note: '在工具详情页有效' },
      ],
    },
    {
      title: '搜索与切换',
      items: [
        { keys: ['/'], desc: '聚焦全局搜索', note: '自动聚焦带有 global-search 的输入框' },
        { keys: ['Ctrl','K'], desc: '快速切换工具' },
      ],
    },
    {
      title: '帮助与关闭',
      items: [
        { keys: ['?'], desc: '显示/隐藏快捷键帮助' },
        { keys: ['Esc'], desc: '关闭弹窗/面板' },
      ],
    },
  ]

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-cyan-200 to-emerald-200">快捷键说明</h1>
        <p className="text-slate-400 mt-1">这是一套全局可用、统一且不干扰输入的快捷键约定。你可以在任意页面按“?”随时打开帮助。</p>
      </header>

      {groups.map(g => (
        <section key={g.title} className="space-y-3">
          <h2 className="text-xl font-semibold">{g.title}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {g.items.map((r, idx) => (
              <div key={idx} className="rounded-lg border border-slate-700 bg-slate-800/60 p-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {r.keys.map((k, i) => (
                    <kbd key={i} className="rounded-md bg-slate-700/70 px-2 py-0.5 text-slate-200 border border-slate-600 text-xs">{k}</kbd>
                  ))}
                </div>
                <div className="mt-2 text-slate-200">{r.desc}</div>
                {r.note && <div className="text-xs text-slate-400 mt-1">{r.note}</div>}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-xl border border-slate-700 bg-slate-800/60 p-5">
        <h3 className="font-semibold">设计原则</h3>
        <ul className="list-disc list-inside text-slate-300 mt-2 space-y-1">
          <li>不抢输入：在输入框、选择框、可编辑区域内不会触发导航类快捷键。</li>
          <li>可记忆：采用常见组合（如 Ctrl/⌘+K）与序列（g h / g s）。</li>
          <li>可扩展：新工具可零成本接入，或按需在工具页内拓展局部快捷键。</li>
        </ul>
      </section>
    </div>
  )
}
