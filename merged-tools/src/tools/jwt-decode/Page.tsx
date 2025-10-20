import { useMemo, useState } from 'react'

function b64urlToStr(s: string){
  s = s.replace(/-/g,'+').replace(/_/g,'/')
  const pad = s.length % 4 === 2 ? '==' : s.length % 4 === 3 ? '=' : ''
  return atob(s + pad)
}
function tryJson(s: string){ try{ return JSON.stringify(JSON.parse(s), null, 2) }catch{ return s } }
function ts(t: number){ return new Date(t*1000).toISOString() }

export default function Page(){
  const [token, setToken] = useState('')
  const parts = useMemo(()=> token.split('.'), [token])
  const header = useMemo(()=>{ if(parts.length<2) return ''; try{ return tryJson(b64urlToStr(parts[0])) }catch(e:any){ return '解析失败: '+(e?.message||'') } }, [parts])
  const payload = useMemo(()=>{ if(parts.length<2) return ''; try{ return tryJson(b64urlToStr(parts[1])) }catch(e:any){ return '解析失败: '+(e?.message||'') } }, [parts])
  const claims = useMemo(()=>{ try { const obj = JSON.parse(payload || '{}'); const out: string[] = [] as any; if(obj.exp) out.push(`exp: ${obj.exp} (${ts(obj.exp)})`); if(obj.iat) out.push(`iat: ${obj.iat} (${ts(obj.iat)})`); if(obj.nbf) out.push(`nbf: ${obj.nbf} (${ts(obj.nbf)})`); return out.join('\n') } catch { return '' } }, [payload])
  return (
    <div className="space-y-3">
      <textarea className="w-full min-h-24 rounded bg-slate-800 p-2" placeholder="粘贴 JWT" value={token} onChange={(e)=>setToken(e.target.value)} />
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-slate-400">Header</div>
          <pre className="rounded bg-slate-900 p-2 font-mono whitespace-pre-wrap break-words">{header}</pre>
        </div>
        <div>
          <div className="text-sm text-slate-400">Payload</div>
          <pre className="rounded bg-slate-900 p-2 font-mono whitespace-pre-wrap break-words">{payload}</pre>
          {claims && <pre className="rounded bg-slate-900 p-2 font-mono whitespace-pre-wrap break-words mt-2">{claims}</pre>}
        </div>
      </div>
    </div>
  )
}
