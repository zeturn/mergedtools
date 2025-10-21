import { useEffect, useState } from 'react'
import { Textarea } from '../components/Input'

async function sha256(text: string) {
  const enc = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', enc)
  const bytes = new Uint8Array(buf)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export default function HashPage() {
  const [input, setInput] = useState('Hello, world!')
  const [out, setOut] = useState('')
  useEffect(() => {
    sha256(input).then(setOut)
  }, [input])
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(out)
  }
  
  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="border-b border-slate-700/50 pb-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">SHA-256 哈希</h1>
        <p className="text-slate-400 mt-2">计算文本的 SHA-256 哈希值</p>
      </div>

      {/* Input section */}
      <div className="space-y-3">
        <label className="block text-sm text-slate-400">输入文本</label>
        <Textarea 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入要计算哈希的文本..." 
        />
      </div>

      {/* Output section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm text-slate-400">SHA-256 哈希值</label>
          <button
            onClick={copyToClipboard}
            className="text-xs px-3 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors"
          >
            复制
          </button>
        </div>
        <div className="rounded-lg bg-slate-900/50 border border-slate-700 p-4 font-mono text-sm break-all text-emerald-300 min-h-[80px] flex items-center">
          {out || <span className="text-slate-500">哈希值将显示在这里</span>}
        </div>
      </div>

      {/* Info tip */}
      <div className="rounded-lg bg-indigo-500/5 border border-indigo-500/20 p-4">
        <div className="flex gap-3">
          <div className="text-indigo-400 text-lg">💡</div>
          <div className="text-sm text-slate-300">
            <p className="font-medium text-indigo-300">关于 SHA-256</p>
            <p className="text-slate-400 mt-1">SHA-256 是一种加密哈希函数，可以将任意长度的输入转换为固定长度（256位）的哈希值。相同的输入总是产生相同的哈希值。</p>
          </div>
        </div>
      </div>
    </div>
  )
}
