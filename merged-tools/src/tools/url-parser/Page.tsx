import { useMemo, useState } from 'react'
import Input from '../../components/Input'

export default function Page() {
  const [u, setU] = useState('https://user:pass@example.com:8080/path/name?foo=bar&foo=baz#hash')
  const parsed = useMemo(() => {
    try {
      const url = new URL(u)
      const params: Record<string, string[]> = {}
      url.searchParams.forEach((v, k) => { (params[k] ||= []).push(v) })
      return {
        ok: true,
        url,
        params,
      } as const
    } catch (e: any) {
      return { ok: false, err: e?.message ?? '无效 URL' } as const
    }
  }, [u])

  return (
    <div className="space-y-4">
      <Input  variant="simple" className="" value={u} onChange={(e)=>setU(e.target.value)} placeholder="输入 URL" />
      {!parsed.ok ? (
        <div className="text-red-400">{parsed.err}</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <section className="space-y-1">
            <h3 className="text-xl font-semibold">基本</h3>
            <div className="text-sm text-slate-400">origin</div>
            <div className="rounded bg-slate-800 p-2 font-mono">{parsed.url.origin}</div>
            <div className="text-sm text-slate-400">protocol</div>
            <div className="rounded bg-slate-800 p-2 font-mono">{parsed.url.protocol}</div>
            <div className="text-sm text-slate-400">username</div>
            <div className="rounded bg-slate-800 p-2 font-mono">{parsed.url.username}</div>
            <div className="text-sm text-slate-400">password</div>
            <div className="rounded bg-slate-800 p-2 font-mono">{parsed.url.password}</div>
            <div className="text-sm text-slate-400">host</div>
            <div className="rounded bg-slate-800 p-2 font-mono">{parsed.url.host}</div>
            <div className="text-sm text-slate-400">hostname</div>
            <div className="rounded bg-slate-800 p-2 font-mono">{parsed.url.hostname}</div>
            <div className="text-sm text-slate-400">port</div>
            <div className="rounded bg-slate-800 p-2 font-mono">{parsed.url.port || '(默认)'} </div>
            <div className="text-sm text-slate-400">pathname</div>
            <div className="rounded bg-slate-800 p-2 font-mono">{parsed.url.pathname}</div>
            <div className="text-sm text-slate-400">search</div>
            <div className="rounded bg-slate-800 p-2 font-mono">{parsed.url.search}</div>
            <div className="text-sm text-slate-400">hash</div>
            <div className="rounded bg-slate-800 p-2 font-mono">{parsed.url.hash}</div>
          </section>
          <section className="space-y-2">
            <h3 className="text-xl font-semibold">查询参数</h3>
            {Object.keys(parsed.params).length === 0 ? (
              <div className="text-slate-400">无</div>
            ) : (
              <div className="rounded bg-slate-800 p-2 font-mono text-sm space-y-1">
                {Object.entries(parsed.params).map(([k, vs]) => (
                  <div key={k}><span className="text-slate-400">{k}</span> = <span>{vs.join(', ')}</span></div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
