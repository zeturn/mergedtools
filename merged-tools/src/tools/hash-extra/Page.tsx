import { useEffect, useState } from 'react'
import SparkMD5 from 'spark-md5'
import Input from '../../components/Input'

async function hmacSha256(key: string, data: string) {
  const enc = new TextEncoder()
  const k = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', k, enc.encode(data))
  const bytes = new Uint8Array(sig)
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function Page() {
  const [txt, setTxt] = useState('hello')
  const [md5, setMd5] = useState('')
  useEffect(() => { setMd5(SparkMD5.hash(txt)) }, [txt])

  const [key, setKey] = useState('secret')
  const [hmac, setHmac] = useState('')
  useEffect(() => { hmacSha256(key, txt).then(setHmac) }, [key, txt])

  return (
    <div className="space-y-3">
      <Input  variant="simple" className="" value={txt} onChange={(e) => setTxt(e.target.value)} placeholder="输入文本" />
      <div className="rounded bg-slate-800 p-2 font-mono break-all">MD5: {md5}</div>
      <div className="grid grid-cols-2 gap-3 items-center">
        <Input  variant="simple" className="" value={key} onChange={(e) => setKey(e.target.value)} placeholder="HMAC 密钥" />
        <div className="rounded bg-slate-800 p-2 font-mono break-all">HMAC-SHA256: {hmac}</div>
      </div>
    </div>
  )
}
