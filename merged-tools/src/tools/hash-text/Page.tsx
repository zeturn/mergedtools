import { useState } from 'react'
import SparkMD5 from 'spark-md5'

async function sha256(text: string) {
  const enc = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest('SHA-256', enc)
  const bytes = new Uint8Array(hash)
  return Array.from(bytes).map(b=>b.toString(16).padStart(2,'0')).join('')
}

export default function Page() {
  const [t, setT] = useState('hello world')
  const [md5, setMd5] = useState('')
  const [sha, setSha] = useState('')
  async function run() {
    setMd5(SparkMD5.hash(t))
    setSha(await sha256(t))
  }
  return (
    <div className="space-y-3">
      <textarea className="w-full h-40 rounded bg-slate-800 p-3 font-mono" value={t} onChange={(e)=>setT(e.target.value)} />
      <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={run}>计算</button>
      {(md5 || sha) && (
        <div className="space-y-2">
          <div className="text-sm text-slate-400">MD5</div>
          <div className="rounded bg-slate-900 p-2 font-mono break-all select-all">{md5}</div>
          <div className="text-sm text-slate-400">SHA-256</div>
          <div className="rounded bg-slate-900 p-2 font-mono break-all select-all">{sha}</div>
        </div>
      )}
    </div>
  )
}
