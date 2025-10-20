import { useEffect, useState } from 'react'

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
  return (
    <div className="space-y-2">
      <textarea className="w-full h-28 rounded bg-slate-800 p-3" value={input} onChange={(e) => setInput(e.target.value)} />
      <div className="rounded bg-slate-800 p-3 font-mono break-all">{out}</div>
    </div>
  )
}
