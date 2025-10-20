import { useMemo, useState } from 'react'

function ipToInt(ip: string){ const p = ip.split('.').map(Number); if(p.length!==4||p.some(n=>n<0||n>255||!Number.isInteger(n))) throw new Error('无效 IPv4'); return ((p[0]<<24)>>>0) + (p[1]<<16) + (p[2]<<8) + p[3] }
function intToIp(x: number){ return [x>>>24 & 255, x>>>16 & 255, x>>>8 & 255, x & 255].join('.') }
function maskFromCidr(c: number){ return c===0?0: (~((1<<(32-c))-1)) >>> 0 }
function parseCidr(s: string){ const m = s.trim().match(/^(\d+\.\d+\.\d+\.\d+)\/(\d{1,2})$/); if(!m) throw new Error('CIDR 格式错误'); const a = ipToInt(m[1]); const c = Number(m[2]); if(c<0||c>32) throw new Error('CIDR 超界'); const msk = maskFromCidr(c); return { net: (a & msk)>>>0, cidr: c } }
function formatCidr(net: number, cidr: number){ return `${intToIp(net)}/${cidr}` }
function nextBlock(net: number, cidr: number){ const size = 2**(32-cidr); return (net + size)>>>0 }
function canMerge(aNet:number, bNet:number, cidr:number){ const parentCidr = cidr-1; if(parentCidr<0) return false; const parentMask = maskFromCidr(parentCidr); return (aNet & parentMask) === (bNet & parentMask) && nextBlock(aNet, cidr) === bNet }
function aggregate(cidrs: {net:number,cidr:number}[]){
  // normalize & sort
  cidrs.sort((x,y)=> x.net===y.net ? x.cidr-y.cidr : (x.net - y.net))
  // merge equals
  let changed = true
  while(changed){
    changed = false
    const out: {net:number,cidr:number}[] = []
    for(let i=0;i<cidrs.length;){
      const cur = cidrs[i]
      // try merge with next if same cidr
      if(i+1<cidrs.length && cidrs[i+1].cidr===cur.cidr && canMerge(cur.net, cidrs[i+1].net, cur.cidr)){
        const parent = { net: cur.net & maskFromCidr(cur.cidr-1), cidr: cur.cidr-1 }
        out.push(parent); i+=2; changed = true; continue
      }
      out.push(cur); i++
    }
    cidrs = out.sort((x,y)=> x.net===y.net ? x.cidr-y.cidr : (x.net - y.net))
  }
  return cidrs
}
function splitTo(cidrStr: string, target: number){ const { net, cidr } = parseCidr(cidrStr); if(target<cidr || target>32) throw new Error('目标前缀需大于等于原前缀'); const res: {net:number,cidr:number}[] = []; const size = 2**(32-target); const count = 2**(target-cidr); let cur = net; for(let i=0;i<count;i++){ res.push({ net: cur, cidr: target }); cur = (cur + size)>>>0 } return res }

export default function Page(){
  const [ip, setIp] = useState('192.168.1.10')
  const [cidr, setCidr] = useState(24)
  const info = useMemo(()=>{
    try{
      const a = ipToInt(ip)
      const m = maskFromCidr(cidr)
      const net = (a & m) >>> 0
      const bcast = (net | (~m >>> 0)) >>> 0
      const hosts = cidr>=31 ? 2**(32-cidr) : Math.max(0, 2**(32-cidr) - 2)
      const first = cidr>=31 ? net : (net + 1) >>> 0
      const last = cidr>=31 ? bcast : (bcast - 1) >>> 0
      return { ok: true as const, net, bcast, first, last, hosts, m }
    }catch(e:any){ return { ok:false as const, err: e?.message || '错误' } }
  }, [ip, cidr])

  const [n, setN] = useState(0)
  const exp = useMemo(()=>{
    if (!('ok' in info) || !info.ok) return [] as string[]
    const limit = Math.min(info.hosts, 512)
    const out: string[] = []
    let cur = info.first
    for (let i=0;i<Math.min(n, limit);i++){ out.push(intToIp(cur)); cur = (cur+1)>>>0 }
    return out
  }, [info, n])

  // split & aggregate UI state
  const [srcCidr, setSrcCidr] = useState('192.168.0.0/24')
  const [targetCidr, setTargetCidr] = useState(26)
  const [splitOut, setSplitOut] = useState<string>('')
  function doSplit(){
    try{ const res = splitTo(srcCidr, targetCidr).map(x=>formatCidr(x.net, x.cidr)).join('\n'); setSplitOut(res) }
    catch(e:any){ setSplitOut('错误：'+(e?.message||'')) }
  }
  const [listInput, setListInput] = useState('192.168.0.0/25\n192.168.0.128/25')
  const [aggOut, setAggOut] = useState('')
  function doAgg(){
    try{
      const items = listInput.split(/\n+/).map(s=>s.trim()).filter(Boolean).map(parseCidr)
      const res = aggregate(items).map(x=>formatCidr(x.net, x.cidr)).join('\n')
      setAggOut(res)
    }catch(e:any){ setAggOut('错误：'+(e?.message||'')) }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center flex-wrap">
        <input className="rounded bg-slate-800 p-2" value={ip} onChange={(e)=>setIp(e.target.value)} />
        <label className="text-sm text-slate-400">/CIDR</label>
        <input type="number" min={0} max={32} className="w-24 rounded bg-slate-800 p-2" value={cidr} onChange={(e)=>setCidr(Number(e.target.value))} />
      </div>
      {'ok' in info && info.ok ? (
        <div className="grid md:grid-cols-2 gap-6">
          <section className="space-y-1">
            <div className="text-sm text-slate-400">网络地址</div>
            <div className="rounded bg-slate-900 p-2 font-mono">{intToIp(info.net)}</div>
            <div className="text-sm text-slate-400">广播地址</div>
            <div className="rounded bg-slate-900 p-2 font-mono">{intToIp(info.bcast)}</div>
            <div className="text-sm text-slate-400">首/末主机</div>
            <div className="rounded bg-slate-900 p-2 font-mono">{intToIp(info.first)} — {intToIp(info.last)}</div>
            <div className="text-sm text-slate-400">可用主机数</div>
            <div className="rounded bg-slate-900 p-2 font-mono">{info.hosts}</div>
            <div className="text-sm text-slate-400">子网掩码</div>
            <div className="rounded bg-slate-900 p-2 font-mono">{intToIp(info.m)}</div>
          </section>
          <section className="space-y-2">
            <div className="text-sm text-slate-400">列出前 N 个主机（最多 512）</div>
            <input type="number" min={0} max={512} className="w-32 rounded bg-slate-800 p-2" value={n} onChange={(e)=>setN(Number(e.target.value))} />
            <div className="rounded bg-slate-900 p-2 font-mono max-h-64 overflow-auto space-y-1">
              {exp.map(x=> <div key={x}>{x}</div>)}
            </div>
          </section>
          <section className="space-y-2">
            <h4 className="font-semibold">CIDR 拆分</h4>
            <div className="flex gap-2 items-center flex-wrap">
              <input className="rounded bg-slate-800 p-2" value={srcCidr} onChange={(e)=>setSrcCidr(e.target.value)} />
              <span className="text-sm text-slate-400">目标前缀</span>
              <input type="number" min={0} max={32} className="w-24 rounded bg-slate-800 p-2" value={targetCidr} onChange={(e)=>setTargetCidr(Number(e.target.value))} />
              <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={doSplit}>拆分</button>
            </div>
            <textarea className="w-full min-h-24 rounded bg-slate-900 p-2 font-mono" value={splitOut} onChange={(e)=>setSplitOut(e.target.value)} />
          </section>
        </div>
      ) : <div className="text-red-400">{('ok' in info && !info.ok) ? info.err : ''}</div>}
      <section className="space-y-2">
        <h4 className="font-semibold">CIDR 列表聚合</h4>
        <textarea className="w-full min-h-24 rounded bg-slate-800 p-2 font-mono" value={listInput} onChange={(e)=>setListInput(e.target.value)} />
        <div>
          <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={doAgg}>聚合</button>
        </div>
        <textarea className="w-full min-h-24 rounded bg-slate-900 p-2 font-mono" value={aggOut} onChange={(e)=>setAggOut(e.target.value)} />
      </section>
    </div>
  )
}
