import { useEffect, useMemo, useState } from 'react'
import Input from '../components/Input'

function toDate(input: string) {
  const n = Number(input)
  if (Number.isFinite(n)) {
    // Detect seconds vs milliseconds
    const ms = n < 1e12 ? n * 1000 : n
    return new Date(ms)
  }
  const d = new Date(input)
  return Number.isNaN(d.getTime()) ? null : d
}

export default function TimestampPage() {
  const [raw, setRaw] = useState(() => Math.floor(Date.now() / 1000).toString())
  const d = useMemo(() => toDate(raw), [raw])
  const [isoNow, setIsoNow] = useState('')
  useEffect(() => {
    setIsoNow(new Date().toISOString())
    const timer = setInterval(() => setIsoNow(new Date().toISOString()), 1000)
    return () => clearInterval(timer)
  }, [])

  const useCurrentTime = () => {
    setRaw(Math.floor(Date.now() / 1000).toString())
  }

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="border-b border-slate-700/50 pb-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">时间戳转换</h1>
        <p className="text-slate-400 mt-2">Unix时间戳与日期时间互转</p>
      </div>

      {/* Current time display */}
      <div className="rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 mb-1">当前时间</div>
            <div className="font-mono text-cyan-300">{isoNow}</div>
          </div>
          <button
            onClick={useCurrentTime}
            className="px-4 py-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-sm transition-all"
          >
            使用当前时间
          </button>
        </div>
      </div>

      {/* Input section */}
      <div className="space-y-3">
        <label className="block text-sm text-slate-400">输入时间戳或日期字符串</label>
        <Input  variant="simple" className="" 
          value={raw} 
          onChange={(e) => setRaw(e.target.value)}
          placeholder="例如: 1640995200 或 2022-01-01"
        />
      </div>

      {/* Output section */}
      {d ? (
        <div className="space-y-4">
          <label className="block text-sm text-slate-400">转换结果</label>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg bg-slate-900/50 border border-slate-700 p-4 space-y-2">
              <div className="text-xs text-slate-500 uppercase tracking-wide">ISO 8601</div>
              <div className="font-mono text-sm text-emerald-300 break-all">{d.toISOString()}</div>
            </div>
            <div className="rounded-lg bg-slate-900/50 border border-slate-700 p-4 space-y-2">
              <div className="text-xs text-slate-500 uppercase tracking-wide">本地时间</div>
              <div className="font-mono text-sm text-emerald-300 break-all">{d.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</div>
            </div>
            <div className="rounded-lg bg-slate-900/50 border border-slate-700 p-4 space-y-2">
              <div className="text-xs text-slate-500 uppercase tracking-wide">毫秒时间戳</div>
              <div className="font-mono text-xl text-cyan-300">{d.getTime()}</div>
            </div>
            <div className="rounded-lg bg-slate-900/50 border border-slate-700 p-4 space-y-2">
              <div className="text-xs text-slate-500 uppercase tracking-wide">秒时间戳</div>
              <div className="font-mono text-xl text-cyan-300">{Math.floor(d.getTime() / 1000)}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4">
          <div className="flex gap-3 items-center">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-300">无法解析此时间/时间戳，请检查输入格式</span>
          </div>
        </div>
      )}

      {/* Info tip */}
      <div className="rounded-lg bg-cyan-500/5 border border-cyan-500/20 p-4">
        <div className="flex gap-3">
          <div className="text-cyan-400 text-lg">💡</div>
          <div className="text-sm text-slate-300">
            <p className="font-medium text-cyan-300">支持格式</p>
            <ul className="text-slate-400 mt-1 space-y-1 list-disc list-inside">
              <li>Unix 时间戳（秒）: 1640995200</li>
              <li>Unix 时间戳（毫秒）: 1640995200000</li>
              <li>ISO 8601: 2022-01-01T00:00:00Z</li>
              <li>其他标准日期字符串</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
