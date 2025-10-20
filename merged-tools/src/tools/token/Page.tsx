import { useState } from 'react'

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes).map(b=>b.toString(16).padStart(2,'0')).join('')
}
function bytesToBase64(bytes: Uint8Array) {
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin)
}
function base64Url(b64: string) { return b64.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'') }

export default function Page() {
  const [len, setLen] = useState(32)
  const [enc, setEnc] = useState<'hex'|'b64'|'b64url'>('hex')
  const [out, setOut] = useState('')
  function gen() {
    const bytes = new Uint8Array(len)
    crypto.getRandomValues(bytes)
    let s = ''
    if (enc === 'hex') s = bytesToHex(bytes)
    else if (enc === 'b64') s = bytesToBase64(bytes)
    else s = base64Url(bytesToBase64(bytes))
    setOut(s)
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-sm text-slate-400">字节长度</label>
        <input type="number" min={8} max={4096} value={len} onChange={(e)=>setLen(Number(e.target.value))} className="w-28 rounded bg-slate-800 p-2" />
        <select className="rounded bg-slate-800 p-2" value={enc} onChange={(e)=>setEnc(e.target.value as any)}>
          <option value="hex">Hex</option>
          <option value="b64">Base64</option>
          <option value="b64url">Base64 URL-safe</option>
        </select>
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={gen}>生成</button>
      </div>
      <div className="rounded bg-slate-900 p-2 font-mono break-all select-all">{out || '点击生成'}</div>
    </div>
  )
}
