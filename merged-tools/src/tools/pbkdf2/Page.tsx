import { useState } from 'react'

async function derive(alg: 'SHA-256'|'SHA-512', pass: string, salt: ArrayBuffer, iters: number, dkLen: number) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(pass), { name: 'PBKDF2' }, false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: iters, hash: alg }, key, dkLen * 8)
  return new Uint8Array(bits)
}
function toHex(bytes: Uint8Array){ return Array.from(bytes).map(b=>b.toString(16).padStart(2,'0')).join('') }
function toB64(bytes: Uint8Array){ let s=''; for(const b of bytes) s += String.fromCharCode(b); return btoa(s) }

export default function Page(){
  const [alg, setAlg] = useState<'SHA-256'|'SHA-512'>('SHA-256')
  const [pass, setPass] = useState('password')
  const [saltStr, setSaltStr] = useState('salt')
  const [iters, setIters] = useState(100000)
  const [dkLen, setDkLen] = useState(32)
  const [encOut, setEncOut] = useState<'hex'|'base64'>('hex')
  const [out, setOut] = useState('')

  async function run(){
  const salt = new TextEncoder().encode(saltStr).buffer
  const bytes = await derive(alg, pass, salt, iters, dkLen)
    setOut(encOut==='hex'? toHex(bytes) : toB64(bytes))
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <select className="rounded bg-slate-800 p-2" value={alg} onChange={(e)=>setAlg(e.target.value as any)}>
          <option>SHA-256</option>
          <option>SHA-512</option>
        </select>
        <input className="rounded bg-slate-800 p-2" placeholder="Password" value={pass} onChange={(e)=>setPass(e.target.value)} />
        <input className="rounded bg-slate-800 p-2" placeholder="Salt" value={saltStr} onChange={(e)=>setSaltStr(e.target.value)} />
        <input type="number" className="rounded bg-slate-800 p-2 w-28" placeholder="Iterations" value={iters} onChange={(e)=>setIters(Number(e.target.value)||0)} />
        <input type="number" className="rounded bg-slate-800 p-2 w-28" placeholder="Key bytes" value={dkLen} onChange={(e)=>setDkLen(Number(e.target.value)||0)} />
        <select className="rounded bg-slate-800 p-2" value={encOut} onChange={(e)=>setEncOut(e.target.value as any)}>
          <option value="hex">Hex</option>
          <option value="base64">Base64</option>
        </select>
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={run}>派生</button>
      </div>
      <div className="rounded bg-slate-900 p-2 font-mono break-all select-all">{out}</div>
    </div>
  )
}
