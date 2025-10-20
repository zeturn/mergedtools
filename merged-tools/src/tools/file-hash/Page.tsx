import { useState } from 'react'
import SparkMD5 from 'spark-md5'

async function sha256(file: File): Promise<string> {
  const buf = await file.arrayBuffer()
  const hash = await crypto.subtle.digest('SHA-256', buf)
  const bytes = new Uint8Array(hash)
  return Array.from(bytes).map(b=>b.toString(16).padStart(2,'0')).join('')
}

async function md5(file: File): Promise<string> {
  const chunkSize = 2 * 1024 * 1024
  const spark = new (SparkMD5 as any).ArrayBuffer()
  let offset = 0
  while (offset < file.size) {
    const slice = file.slice(offset, Math.min(offset + chunkSize, file.size))
    const buf = await slice.arrayBuffer()
    spark.append(buf)
    offset += chunkSize
  }
  return spark.end()
}

export default function Page() {
  const [file, setFile] = useState<File | null>(null)
  const [m, setM] = useState('')
  const [s, setS] = useState('')
  const [busy, setBusy] = useState(false)

  async function run() {
    if (!file) return
    setBusy(true); setM(''); setS('')
    try {
      const [md5v, sha] = await Promise.all([md5(file), sha256(file)])
      setM(md5v); setS(sha)
    } finally { setBusy(false) }
  }

  return (
    <div className="space-y-3">
      <input type="file" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
      <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50" onClick={run} disabled={!file || busy}>{busy ? '计算中…' : '计算哈希'}</button>
      {(m || s) && (
        <div className="space-y-2">
          <div className="text-sm text-slate-400">MD5</div>
          <div className="rounded bg-slate-900 p-2 font-mono break-all select-all">{m}</div>
          <div className="text-sm text-slate-400">SHA-256</div>
          <div className="rounded bg-slate-900 p-2 font-mono break-all select-all">{s}</div>
        </div>
      )}
    </div>
  )
}
