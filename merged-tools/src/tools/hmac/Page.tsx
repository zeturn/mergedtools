import { useState } from 'react'
import Input from '../../components/Input'

async function hmac(alg: 'SHA-1'|'SHA-256'|'SHA-384'|'SHA-512', key: string, msg: string): Promise<ArrayBuffer> {
  const enc = new TextEncoder()
  const k = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash: { name: alg } }, false, ['sign'])
  return crypto.subtle.sign('HMAC', k, enc.encode(msg))
}
function toHex(buf: ArrayBuffer) { return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('') }
function toB64(buf: ArrayBuffer) { const bytes = new Uint8Array(buf); let bin=''; for (let i=0;i<bytes.length;i++) bin += String.fromCharCode(bytes[i]); return btoa(bin) }
function toB32(buf: ArrayBuffer) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  const bytes = new Uint8Array(buf)
  let bits = 0, value = 0, out = ''
  for (const b of bytes) {
    value = (value << 8) | b
    bits += 8
    while (bits >= 5) { out += alphabet[(value >>> (bits - 5)) & 31]; bits -= 5 }
  }
  if (bits > 0) out += alphabet[(value << (5 - bits)) & 31]
  return out
}
function toB58(buf: ArrayBuffer){
  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  const bytes = new Uint8Array(buf)
  let digits = [0]
  for (const byte of bytes){
    let carry = byte
    for (let i=0;i<digits.length;i++){
      const v = digits[i]*256 + carry
      digits[i] = v % 58
      carry = Math.floor(v / 58)
    }
    while (carry){ digits.push(carry % 58); carry = Math.floor(carry/58) }
  }
  for (let i=0;i<bytes.length && bytes[i]===0;i++) digits.push(0)
  return digits.reverse().map(d=>ALPHABET[d]).join('')
}

export default function Page() {
  const [alg, setAlg] = useState<'SHA-1'|'SHA-256'|'SHA-384'|'SHA-512'>('SHA-256')
  const [key, setKey] = useState('secret')
  const [msg, setMsg] = useState('hello')
  const [enc, setEnc] = useState<'hex'|'base64'|'base32'|'base58'>('hex')
  const [out, setOut] = useState('')
  async function run(){
    const sig = await hmac(alg, key, msg)
    setOut(enc==='hex'?toHex(sig): enc==='base64'?toB64(sig): enc==='base32'?toB32(sig): toB58(sig))
  }
  return (
    <div className="space-y-3">
      <div className="flex gap-3 flex-wrap items-center">
        <select className="rounded bg-slate-800 p-2" value={alg} onChange={(e)=>setAlg(e.target.value as any)}>
          <option>SHA-1</option>
          <option>SHA-256</option>
          <option>SHA-384</option>
          <option>SHA-512</option>
        </select>
        <Input  variant="simple" className="" placeholder="Key" value={key} onChange={(e)=>setKey(e.target.value)} />
        <Input  variant="simple" className="" placeholder="Message" value={msg} onChange={(e)=>setMsg(e.target.value)} />
        <select className="rounded bg-slate-800 p-2" value={enc} onChange={(e)=>setEnc(e.target.value as any)}>
          <option value="hex">Hex</option>
          <option value="base64">Base64</option>
          <option value="base32">Base32</option>
          <option value="base58">Base58</option>
        </select>
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={run}>计算</button>
      </div>
      <div className="rounded bg-slate-900 p-2 font-mono break-all select-all">{out}</div>
    </div>
  )
}
