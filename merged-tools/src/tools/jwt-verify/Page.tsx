import { useMemo, useState } from 'react'

type Alg = 'HS256' | 'RS256'

export default function Page(){
  const [token, setToken] = useState('')
  const [alg, setAlg] = useState<Alg>('HS256')
  const [secret, setSecret] = useState('')
  const [publicPem, setPublicPem] = useState('')
  const [result, setResult] = useState<string>('')

  const parsed = useMemo(()=>{
    try{
      const [h,p,s] = token.split('.')
      if(!h||!p||!s) return null
      const header = JSON.parse(new TextDecoder().decode(b64urlToBytes(h)))
      const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(p)))
      return { h, p, s, header, payload }
    }catch{ return null }
  }, [token])

  async function verify(){
    if (!parsed) { setResult('Token 无效'); return }
    try{
      const data = new TextEncoder().encode(parsed.h + '.' + parsed.p)
      const sig = b64urlToBytes(parsed.s)
      if (alg==='HS256'){
        const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
        const ok = await crypto.subtle.verify('HMAC', key, sig, data)
        setResult(ok? '签名有效 (HS256)':'签名无效')
      } else {
        const key = await importRsaPublicKey(publicPem)
        const ok = await crypto.subtle.verify({ name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, key, sig, data)
        setResult(ok? '签名有效 (RS256)':'签名无效')
      }
    }catch(e: unknown){
      const msg = e instanceof Error ? e.message : String(e)
      setResult('校验失败: ' + msg)
    }
  }

  return (
    <div className="space-y-3">
      <textarea className="w-full min-h-28 rounded bg-slate-900 p-2 font-mono" placeholder="粘贴 JWT: header.payload.signature" value={token} onChange={(e)=>setToken(e.target.value.trim())} />
      <div className="flex gap-3 items-start flex-wrap">
        <label className="text-sm text-slate-400">算法
          <select className="ml-2 bg-slate-800 rounded p-1" value={alg} onChange={(e)=>setAlg(e.target.value as Alg)}>
            <option value="HS256">HS256</option>
            <option value="RS256">RS256</option>
          </select>
        </label>
        {alg==='HS256'? (
          <input className="bg-slate-800 rounded p-2 min-w-64" placeholder="共享密钥" value={secret} onChange={(e)=>setSecret(e.target.value)} />
        ):(
          <textarea className="bg-slate-800 rounded p-2 min-w-64 min-h-28 font-mono" placeholder={`PEM 公钥 (BEGIN PUBLIC KEY)`} value={publicPem} onChange={(e)=>setPublicPem(e.target.value)} />
        )}
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={verify} disabled={!parsed}>验签</button>
      </div>
      {parsed && (
        <div className="grid md:grid-cols-2 gap-3">
          <pre className="bg-slate-900 p-3 rounded overflow-auto text-xs"><code>{JSON.stringify(parsed.header, null, 2)}</code></pre>
          <pre className="bg-slate-900 p-3 rounded overflow-auto text-xs"><code>{JSON.stringify(parsed.payload, null, 2)}</code></pre>
        </div>
      )}
      {result && <div className="p-2 rounded bg-slate-800">{result}</div>}
      <p className="text-xs text-slate-400">说明：本工具仅用于演示本地验签流程，不会联网，请勿粘贴敏感密钥或 Token。</p>
    </div>
  )
}

function b64urlToBytes(s: string){
  s = s.replace(/-/g,'+').replace(/_/g,'/')
  const pad = s.length%4? '='.repeat(4 - s.length%4): ''
  const bin = atob(s+pad)
  const arr = new Uint8Array(bin.length)
  for (let i=0;i<bin.length;i++) arr[i] = bin.charCodeAt(i)
  return arr
}

async function importRsaPublicKey(pem: string){
  const b64 = pem.replace(/-----BEGIN PUBLIC KEY-----/g,'').replace(/-----END PUBLIC KEY-----/g,'').replace(/\s+/g,'')
  const der = b64urlToBytes(b64)
  return crypto.subtle.importKey(
    'spki',
    der.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify']
  )
}
