import { useState } from 'react'

function sha256Hex(buf: ArrayBuffer){ return crypto.subtle.digest('SHA-256', buf).then(d=>Array.from(new Uint8Array(d)).map(b=>b.toString(16).padStart(2,'0')).join('')) }

export default function Page(){
  const [file, setFile] = useState<File|null>(null)
  const [info, setInfo] = useState<string>('')
  async function run(){
    if (!file) return
    const buf = await file.arrayBuffer()
    const text = new TextDecoder().decode(buf)
    const m = text.match(/\/ByteRange\s*\[\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*\]/)
    if (!m) { setInfo('未检测到签名 ByteRange'); return }
    const [a,b,c,d] = m.slice(1).map(Number)
    const part1 = buf.slice(a, a+b)
    const part2 = buf.slice(c, c+d)
    const total = new Blob([part1, part2])
    const hex = await sha256Hex(await total.arrayBuffer())
    setInfo(`检测到签名：ByteRange=[${a}, ${b}, ${c}, ${d}]\n不含 /Contents 的拼接 SHA-256: ${hex}\n注意：本工具不校验证书链，仅作结构检查。`)
  }
  return (
    <div className="space-y-3">
      <input type="file" accept="application/pdf" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
      <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50" onClick={run} disabled={!file}>检查</button>
      {info && <pre className="rounded bg-slate-900 p-2 whitespace-pre-wrap">{info}</pre>}
    </div>
  )
}
