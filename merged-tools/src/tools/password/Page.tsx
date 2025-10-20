import { useMemo, useState } from 'react'

const LOWER = 'abcdefghjkmnpqrstuvwxyz' // 去掉 i l o
const UPPER = 'ABCDEFGHJKMNPQRSTUVWXYZ' // 去掉 I L O
const DIGIT = '23456789' // 去掉 0 1
const SYMBOL = '!@#$%^&*()-_=+[]{};:,./?'

function randomPassword(len: number, alphabet: string) {
  const buf = new Uint32Array(len)
  crypto.getRandomValues(buf)
  let out = ''
  for (let i = 0; i < len; i++) out += alphabet[buf[i] % alphabet.length]
  return out
}

export default function Page() {
  const [len, setLen] = useState(16)
  const [useL, setUseL] = useState(true)
  const [useU, setUseU] = useState(true)
  const [useD, setUseD] = useState(true)
  const [useS, setUseS] = useState(false)
  const [pwd, setPwd] = useState('')

  const alphabet = useMemo(() => {
    let a = ''
    if (useL) a += LOWER
    if (useU) a += UPPER
    if (useD) a += DIGIT
    if (useS) a += SYMBOL
    return a || LOWER + UPPER + DIGIT
  }, [useL, useU, useD, useS])

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-sm text-slate-400">长度</label>
        <input type="number" min={4} max={256} value={len} onChange={(e)=>setLen(Number(e.target.value))} className="w-24 rounded bg-slate-800 p-2" />
        <label className="flex items-center gap-2"><input type="checkbox" checked={useL} onChange={(e)=>setUseL(e.target.checked)} />小写</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={useU} onChange={(e)=>setUseU(e.target.checked)} />大写</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={useD} onChange={(e)=>setUseD(e.target.checked)} />数字</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={useS} onChange={(e)=>setUseS(e.target.checked)} />符号</label>
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={()=>setPwd(randomPassword(len, alphabet))}>生成</button>
      </div>
      <div className="rounded bg-slate-900 p-2 font-mono break-all select-all">{pwd || '点击生成'}</div>
    </div>
  )
}
