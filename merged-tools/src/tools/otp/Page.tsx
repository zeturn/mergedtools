import { useEffect, useMemo, useState } from 'react'
import { decode as base32decode } from 'hi-base32'

async function hmac(keyBytes: Uint8Array, msg: Uint8Array, algo: 'SHA-1'|'SHA-256'|'SHA-512') {
  const k = await crypto.subtle.importKey('raw', keyBytes.buffer as ArrayBuffer, { name: 'HMAC', hash: algo }, false, ['sign'])
  return new Uint8Array(await crypto.subtle.sign('HMAC', k, msg.buffer as ArrayBuffer))
}
function truncateHotp(hmac: Uint8Array, digits: number) {
  const offset = hmac[hmac.length - 1] & 0x0f
  const p = (hmac[offset] & 0x7f) << 24 | (hmac[offset+1] & 0xff) << 16 | (hmac[offset+2] & 0xff) << 8 | (hmac[offset+3] & 0xff)
  const mod = 10 ** digits
  return String(p % mod).padStart(digits, '0')
}
function counterToBytes(counter: number | bigint) {
  const buf = new ArrayBuffer(8); const dv = new DataView(buf)
  let c = BigInt(counter)
  for (let i=7;i>=0;i--) { dv.setUint8(i, Number(c & 0xffn)); c >>= 8n }
  return new Uint8Array(buf)
}

function cleanSecret(s: string) { return s.replace(/\s+/g,'').toUpperCase() }

export default function Page(){
  const [secret, setSecret] = useState('JBSWY3DPEHPK3PXP') // 'Hello!' x2 示例
  const [digits, setDigits] = useState(6)
  const [period, setPeriod] = useState(30)
  const [algo, setAlgo] = useState<'SHA-1'|'SHA-256'|'SHA-512'>('SHA-1')
  const [offset, setOffset] = useState(0) // seconds
  const [hotpCounter, setHotpCounter] = useState(0)
  const key = useMemo(()=> {
    try { const raw = base32decode.asBytes(cleanSecret(secret)); return new Uint8Array(raw) } catch { return null }
  }, [secret])

  const [now, setNow] = useState(Date.now())
  useEffect(()=>{ const t = setInterval(()=>setNow(Date.now()), 500); return ()=>clearInterval(t) }, [])

  const totp = useMemo(async () => {
    if (!key) return '无效密钥'
    const step = Math.floor((now/1000 + offset) / period)
    const mac = await hmac(key, counterToBytes(step), algo)
    return truncateHotp(mac, digits)
  }, [key, now, period, digits, algo, offset])

  const [totpCode, setTotpCode] = useState('')
  useEffect(()=>{ (async ()=> setTotpCode(await totp))() }, [totp])

  async function genHotp() {
    if (!key) return
    const mac = await hmac(key, counterToBytes(hotpCounter), algo)
    const code = truncateHotp(mac, digits)
    alert(code)
  }

  const remain = period - Math.floor((now/1000) % period)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-sm text-slate-400">Base32 密钥</div>
        <input className="w-full rounded bg-slate-800 p-2 font-mono" value={secret} onChange={(e)=>setSecret(e.target.value)} />
      </div>
      <div className="flex gap-3 flex-wrap items-center">
        <label className="text-sm text-slate-400">位数</label>
        <input type="number" min={6} max={8} className="w-20 rounded bg-slate-800 p-2" value={digits} onChange={(e)=>setDigits(Number(e.target.value))} />
        <label className="text-sm text-slate-400">周期(s)</label>
        <input type="number" min={15} max={120} className="w-24 rounded bg-slate-800 p-2" value={period} onChange={(e)=>setPeriod(Number(e.target.value))} />
        <label className="text-sm text-slate-400">算法</label>
        <select className="rounded bg-slate-800 p-2" value={algo} onChange={(e)=>setAlgo(e.target.value as any)}>
          <option value="SHA-1">SHA-1</option>
          <option value="SHA-256">SHA-256</option>
          <option value="SHA-512">SHA-512</option>
        </select>
        <label className="text-sm text-slate-400">时间偏移(s)</label>
        <input type="number" className="w-28 rounded bg-slate-800 p-2" value={offset} onChange={(e)=>setOffset(Number(e.target.value))} />
      </div>
      <section className="space-y-2">
        <h3 className="text-xl font-semibold">TOTP</h3>
        <div className="rounded bg-slate-900 p-2 font-mono text-2xl tracking-widest">{totpCode || '无效密钥'}</div>
        <div className="text-sm text-slate-400">刷新倒计时：{remain}s</div>
      </section>
      <section className="space-y-2">
        <h3 className="text-xl font-semibold">HOTP</h3>
        <div className="flex gap-2 items-center">
          <label className="text-sm text-slate-400">计数器</label>
          <input type="number" className="w-36 rounded bg-slate-800 p-2" value={hotpCounter} onChange={(e)=>setHotpCounter(Number(e.target.value))} />
          <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={genHotp}>生成</button>
        </div>
      </section>
    </div>
  )
}
