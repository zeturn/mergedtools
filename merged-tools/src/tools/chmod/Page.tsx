import { useEffect, useMemo, useState } from 'react'

type Bits = { r: boolean; w: boolean; x: boolean }
function bitsToOct(b: Bits) { return (Number(b.r) << 2) + (Number(b.w) << 1) + Number(b.x) }
function octToBits(n: number): Bits { return { r: !!(n & 4), w: !!(n & 2), x: !!(n & 1) } }

export default function Page() {
  const [usr, setUsr] = useState<Bits>({ r: true, w: true, x: true })
  const [grp, setGrp] = useState<Bits>({ r: true, w: false, x: true })
  const [oth, setOth] = useState<Bits>({ r: true, w: false, x: true })
  const oct = useMemo(() => `${bitsToOct(usr)}${bitsToOct(grp)}${bitsToOct(oth)}`, [usr, grp, oth])

  const [octIn, setOctIn] = useState(oct)
  useEffect(()=>setOctIn(oct), [oct])

  function applyOct() {
    const s = octIn.trim()
    if (!/^\d{3}$/.test(s)) return
    const a = Number(s[0]), b = Number(s[1]), c = Number(s[2])
    setUsr(octToBits(a)); setGrp(octToBits(b)); setOth(octToBits(c))
  }

  function Toggle({ label, on, set }: { label: string; on: boolean; set: (v: boolean)=>void }) {
    return <label className="flex items-center gap-2"><input type="checkbox" checked={on} onChange={(e)=>set(e.target.checked)} />{label}</label>
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="text-sm text-slate-400">User</div>
          <div className="flex gap-4"><Toggle label="r" on={usr.r} set={(v)=>setUsr({...usr,r:v})} /><Toggle label="w" on={usr.w} set={(v)=>setUsr({...usr,w:v})} /><Toggle label="x" on={usr.x} set={(v)=>setUsr({...usr,x:v})} /></div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-slate-400">Group</div>
          <div className="flex gap-4"><Toggle label="r" on={grp.r} set={(v)=>setGrp({...grp,r:v})} /><Toggle label="w" on={grp.w} set={(v)=>setGrp({...grp,w:v})} /><Toggle label="x" on={grp.x} set={(v)=>setGrp({...grp,x:v})} /></div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-slate-400">Other</div>
          <div className="flex gap-4"><Toggle label="r" on={oth.r} set={(v)=>setOth({...oth,r:v})} /><Toggle label="w" on={oth.w} set={(v)=>setOth({...oth,w:v})} /><Toggle label="x" on={oth.x} set={(v)=>setOth({...oth,x:v})} /></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-sm text-slate-400">八进制</div>
        <div className="flex gap-2 items-center">
          <input className="w-24 rounded bg-slate-800 p-2 font-mono" value={octIn} onChange={(e)=>setOctIn(e.target.value)} maxLength={3} />
          <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={applyOct}>应用</button>
        </div>
        <div className="text-sm text-slate-400">当前</div>
        <div className="rounded bg-slate-900 p-2 font-mono">{oct}</div>
      </div>
    </div>
  )
}
