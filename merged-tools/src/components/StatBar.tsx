export default function StatBar() {
  const stats = [
    { label: '工具数量', value: '100+' },
    { label: '离线可用', value: '多数' },
    { label: '开源仓库', value: 'MIT' },
  ]
  return (
    <div className="mt-8 grid grid-cols-3 gap-3 text-center">
      {stats.map(s => (
        <div key={s.label} className="rounded-lg border border-slate-700 bg-slate-800/60 p-3">
          <div className="text-lg font-semibold">{s.value}</div>
          <div className="text-xs text-slate-400">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
