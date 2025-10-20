import { useMemo, useState } from 'react'

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
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">编码</h2>
        <textarea className="w-full h-28 rounded bg-slate-800 p-3" value={input} onChange={(e) => setInput(e.target.value)} />
        <div className="rounded bg-slate-800 p-3 font-mono break-all">{encoded}</div>
      </section>
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">解码</h2>
        <textarea className="w-full h-28 rounded bg-slate-800 p-3" value={b64} onChange={(e) => setB64(e.target.value)} />
        <div className="rounded bg-slate-800 p-3 whitespace-pre-wrap">{decoded}</div>
      </section>
    </div>
  )
}
