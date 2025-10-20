import { useMemo, useState } from 'react'

const DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function parseBigInt(str: string, base: number): bigint {
  const s = str.trim().toUpperCase()
  if (!s) throw new Error('空输入')
  const neg = s.startsWith('-')
  const body = neg ? s.slice(1) : s
  let v = 0n
  const B = BigInt(base)
  for (const ch of body) {
    const d = DIGITS.indexOf(ch)
    if (d < 0 || d >= base) throw new Error(`非法字符: ${ch}`)
    v = v * B + BigInt(d)
  }
  return neg ? -v : v
}

function toBase(n: bigint, base: number): string {
  if (n === 0n) return '0'
  const neg = n < 0n
  let v = neg ? -n : n
  const B = BigInt(base)
  let out = ''
  while (v > 0n) { const r = Number(v % B); out = DIGITS[r] + out; v = v / B }
  return neg ? '-' + out : out
}

export default function Page() {
  const [val, setVal] = useState('FF')
  const [from, setFrom] = useState(16)
  const [to, setTo] = useState(10)
  const out = useMemo(() => {
    try { return toBase(parseBigInt(val, from), to) } catch (e: any) { return `错误: ${e?.message ?? '无'}` }
  }, [val, from, to])
  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-3 gap-3">
        <input className="rounded bg-slate-800 p-2 font-mono" value={val} onChange={(e)=>setVal(e.target.value)} />
        <div className="flex gap-2 items-center">
          <label className="text-sm text-slate-400">从</label>
          <input type="number" min={2} max={36} className="w-24 rounded bg-slate-800 p-2" value={from} onChange={(e)=>setFrom(Number(e.target.value))} />
          <label className="text-sm text-slate-400">到</label>
          <input type="number" min={2} max={36} className="w-24 rounded bg-slate-800 p-2" value={to} onChange={(e)=>setTo(Number(e.target.value))} />
        </div>
      </div>
      <div className="rounded bg-slate-900 p-2 font-mono break-words">{out}</div>
    </div>
  )
}
