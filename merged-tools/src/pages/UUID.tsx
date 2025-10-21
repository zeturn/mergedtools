import { useState } from 'react'

function uuidv4() {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  const hex = Array.from(bytes, toHex).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export default function UUIDPage() {
  const [copied, setCopied] = useState(false)
  const [currentUUID, setCurrentUUID] = useState(() => uuidv4())
  
  const onGenerate = () => {
    setCurrentUUID(uuidv4())
    setCopied(false)
  }
  
  const onCopy = async () => {
    await navigator.clipboard.writeText(currentUUID)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="border-b border-slate-700/50 pb-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-fuchsia-300">UUID 生成器</h1>
        <p className="text-slate-400 mt-2">生成符合 RFC 4122 标准的 UUID v4</p>
      </div>

      {/* UUID display */}
      <div className="space-y-4">
        <label className="block text-sm text-slate-400">生成的 UUID</label>
        <div className="relative">
          <div className="rounded-lg bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border-2 border-violet-500/30 p-6 text-center">
            <div className="font-mono text-2xl md:text-3xl text-violet-300 break-all select-all">
              {currentUUID}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button 
          className="flex-1 px-6 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2" 
          onClick={onGenerate}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          生成新 UUID
        </button>
        <button 
          className={`flex-1 px-6 py-3 rounded-lg font-medium shadow-lg transition-all flex items-center justify-center gap-2 ${
            copied 
              ? 'bg-emerald-600 text-white shadow-emerald-500/20' 
              : 'bg-slate-700 hover:bg-slate-600 text-slate-200 shadow-slate-500/20'
          }`}
          onClick={onCopy}
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              已复制
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              复制到剪贴板
            </>
          )}
        </button>
      </div>

      {/* Info card */}
      <div className="rounded-lg bg-violet-500/5 border border-violet-500/20 p-4">
        <div className="flex gap-3">
          <div className="text-violet-400 text-lg">ℹ️</div>
          <div className="text-sm text-slate-300">
            <p className="font-medium text-violet-300">关于 UUID v4</p>
            <p className="text-slate-400 mt-1">UUID（通用唯一识别码）是一个 128 位的标识符。v4 版本使用随机数生成，碰撞概率极低，适用于分布式系统。</p>
          </div>
        </div>
      </div>
    </div>
  )
}
