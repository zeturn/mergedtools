import { useMemo, useState } from 'react'
import { Textarea } from '../components/Input'

function base64Encode(text: string) {
  try {
    return btoa(unescape(encodeURIComponent(text)))
  } catch {
    return ''
  }
}

function base64Decode(b64: string) {
  try {
    return decodeURIComponent(escape(atob(b64)))
  } catch {
    return ''
  }
}

export default function Base64Page() {
  const [input, setInput] = useState('Hello, world!')
  const encoded = useMemo(() => base64Encode(input), [input])
  const [b64, setB64] = useState('')
  const decoded = useMemo(() => base64Decode(b64), [b64])

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="border-b border-slate-700/50 pb-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-cyan-300">Base64 编码/解码</h1>
        <p className="text-slate-400 mt-2">在线进行 Base64 编码和解码操作</p>
      </div>

      {/* Encode section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-cyan-500 rounded-full" />
          <h2 className="text-xl font-semibold text-slate-100">编码</h2>
        </div>
        <div className="space-y-3">
          <label className="block text-sm text-slate-400">输入文本</label>
          <Textarea 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="请输入要编码的文本..." 
          />
          <label className="block text-sm text-slate-400">Base64 结果</label>
          <div className="rounded-lg bg-slate-900/50 border border-slate-700 p-4 font-mono text-sm break-all text-emerald-300 min-h-[80px]">
            {encoded || <span className="text-slate-500">编码结果将显示在这里</span>}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700/50" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-slate-800/80 px-4 text-slate-500 text-sm">⇅</span>
        </div>
      </div>

      {/* Decode section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-emerald-500 rounded-full" />
          <h2 className="text-xl font-semibold text-slate-100">解码</h2>
        </div>
        <div className="space-y-3">
          <label className="block text-sm text-slate-400">Base64 输入</label>
          <Textarea 
            className="font-mono text-sm"
            value={b64} 
            onChange={(e) => setB64(e.target.value)}
            placeholder="请输入要解码的 Base64 字符串..." 
          />
          <label className="block text-sm text-slate-400">解码结果</label>
          <div className="rounded-lg bg-slate-900/50 border border-slate-700 p-4 whitespace-pre-wrap text-emerald-300 min-h-[80px]">
            {decoded || <span className="text-slate-500">解码结果将显示在这里</span>}
          </div>
        </div>
      </section>
    </div>
  )
}
