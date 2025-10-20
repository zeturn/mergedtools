import { useState } from 'react'

async function aesEncrypt(plain: string, keyRaw: string) {
  const enc = new TextEncoder()
  const keyData = await crypto.subtle.digest('SHA-256', enc.encode(keyRaw))
  const key = await crypto.subtle.importKey('raw', keyData, 'AES-GCM', false, ['encrypt'])
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plain))
  const out = new Uint8Array(iv.length + new Uint8Array(cipher).length)
  out.set(iv, 0)
  out.set(new Uint8Array(cipher), iv.length)
  return btoa(String.fromCharCode(...out))
}

async function aesDecrypt(b64: string, keyRaw: string) {
  const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
  const iv = bin.slice(0, 12)
  const data = bin.slice(12)
  const enc = new TextEncoder()
  const keyData = await crypto.subtle.digest('SHA-256', enc.encode(keyRaw))
  const key = await crypto.subtle.importKey('raw', keyData, 'AES-GCM', false, ['decrypt'])
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
  return new TextDecoder().decode(plain)
}

export default function Page() {
  const [plain, setPlain] = useState('hello')
  const [pass, setPass] = useState('password')
  const [cipher, setCipher] = useState('')
  const [rsaPub, setRsaPub] = useState<CryptoKey | null>(null)
  const [rsaPri, setRsaPri] = useState<CryptoKey | null>(null)
  const [rsaText, setRsaText] = useState('secret')
  const [rsaOut, setRsaOut] = useState('')

  async function genRsa() {
    const { publicKey, privateKey } = await crypto.subtle.generateKey(
      { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1,0,1]), hash: 'SHA-256' }, true, ['encrypt','decrypt']
    )
    setRsaPub(publicKey); setRsaPri(privateKey)
  }

  return (
    <div className="space-y-6">
      <div className="text-amber-400 text-sm">安全提示：示例仅用于学习演示。请注意密钥管理、随机数质量、认证与密文格式等生产级要求。</div>

      <section className="space-y-2">
        <h3 className="text-xl font-semibold">AES-GCM</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <input className="rounded bg-slate-800 p-2" value={plain} onChange={(e)=>setPlain(e.target.value)} placeholder="明文" />
          <input className="rounded bg-slate-800 p-2" value={pass} onChange={(e)=>setPass(e.target.value)} placeholder="口令" />
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={async ()=> setCipher(await aesEncrypt(plain, pass))}>加密</button>
          <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={async ()=> { try { const p = await aesDecrypt(cipher, pass); setPlain(p) } catch { /* ignore */ } }}>解密到明文框</button>
        </div>
        <pre className="rounded bg-slate-800 p-3 font-mono break-all whitespace-pre-wrap">{cipher}</pre>
      </section>

      <section className="space-y-2">
        <h3 className="text-xl font-semibold">RSA-OAEP</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={genRsa}>生成密钥对</button>
          <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={async ()=>{
            if (!rsaPub) return
            const enc = new TextEncoder()
            const data = enc.encode(rsaText)
            const buf = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, rsaPub, data)
            setRsaOut(btoa(String.fromCharCode(...new Uint8Array(buf))))
          }}>加密</button>
          <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={async ()=>{
            if (!rsaPri) return
            const bin = Uint8Array.from(atob(rsaOut), c=>c.charCodeAt(0))
            const buf = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, rsaPri, bin)
            setRsaText(new TextDecoder().decode(buf))
          }}>解密到文本框</button>
        </div>
        <input className="rounded bg-slate-800 p-2 w-full" value={rsaText} onChange={(e)=>setRsaText(e.target.value)} placeholder="要加密/解密的文本" />
        <pre className="rounded bg-slate-800 p-3 font-mono break-all whitespace-pre-wrap">{rsaOut}</pre>
      </section>
    </div>
  )
}
