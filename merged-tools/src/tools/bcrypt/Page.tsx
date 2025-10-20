import { useEffect, useMemo, useRef, useState } from 'react'

type Req =
  | { id: number; action: 'hash'; password: string; rounds: number }
  | { id: number; action: 'compare'; password: string; hash: string }
type Res =
  | { id: number; ok: true; result: string | boolean }
  | { id: number; ok: false; error: string }

export default function Page(){
  const [pwd, setPwd] = useState('password')
  const [rounds, setRounds] = useState(10)
  const [hash, setHash] = useState('')
  const [toCheck, setToCheck] = useState('')
  const [ok, setOk] = useState<boolean | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const wid = useRef(0)
  const waiter = useRef(new Map<number, (res: Res)=>void>())
  const worker = useMemo(()=>{
    const w = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })
    w.onmessage = (ev: MessageEvent<Res>) => {
      const cb = waiter.current.get(ev.data.id)
      if (cb) { waiter.current.delete(ev.data.id); cb(ev.data) }
    }
    return w
  }, [])

  useEffect(()=>()=>{ worker.terminate() }, [worker])

  function callWorker(req: Omit<Req,'id'>): Promise<Res> {
    return new Promise((resolve)=>{
      const id = ++wid.current
      waiter.current.set(id, resolve)
      worker.postMessage({ id, ...req })
    })
  }

  async function doHash(){
    setBusy(true); setErr(null)
    try {
  const res = await callWorker({ action: 'hash', password: pwd, rounds } as Omit<Req,'id'>)
      if (res.ok && typeof res.result === 'string') setHash(res.result)
      else if (!res.ok) setErr(res.error)
    } finally { setBusy(false) }
  }
  async function doCompare(){
    if (!hash) return; setBusy(true); setErr(null)
    try {
  const res = await callWorker({ action: 'compare', password: (toCheck || pwd), hash } as Omit<Req,'id'>)
      if (res.ok && typeof res.result === 'boolean') setOk(res.result)
      else if (!res.ok) setErr(res.error)
    } finally { setBusy(false) }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3 flex-wrap items-center">
        <input className="rounded bg-slate-800 p-2" value={pwd} onChange={(e)=>setPwd(e.target.value)} placeholder="密码" />
        <label className="text-sm text-slate-400">轮数</label>
        <input type="number" min={4} max={15} className="w-24 rounded bg-slate-800 p-2" value={rounds} onChange={(e)=>setRounds(Number(e.target.value))} />
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50" disabled={busy} onClick={doHash}>{busy?'计算中…':'计算哈希'}</button>
      </div>
  {hash && <div className="rounded bg-slate-900 p-2 font-mono break-all select-all">{hash}</div>}
  {err && <div className="text-red-400 text-sm">{err}</div>}
      <div className="flex gap-3 flex-wrap items-center">
        <input className="rounded bg-slate-800 p-2" value={toCheck} onChange={(e)=>setToCheck(e.target.value)} placeholder="待校验密码（留空则复用上文密码）" />
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50" disabled={!hash || busy} onClick={doCompare}>校验</button>
        {ok !== null && <span className={ok? 'text-green-400' : 'text-red-400'}>{ok? '匹配' : '不匹配'}</span>}
      </div>
    </div>
  )
}
