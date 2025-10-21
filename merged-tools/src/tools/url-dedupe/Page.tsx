import { useMemo, useState } from 'react'
import { Input, Textarea } from '../../components/Input'

export default function Page() {
  const [input, setInput] = useState('https://example.com?a=1\nhttps://example.com\nhttps://other.com/path')
  const [mode, setMode] = useState<'exact' | 'byDomain'>('exact')
  const [white, setWhite] = useState('')
  const [black, setBlack] = useState('')

  const out = useMemo(() => {
    const lines = input.split(/\r?\n/).map(l=>l.trim()).filter(Boolean)
    const whitelist = new Set(white.split(',').map(s=>s.trim()).filter(Boolean))
    const blacklist = new Set(black.split(',').map(s=>s.trim()).filter(Boolean))
    if (mode === 'exact') {
      const seen = new Set<string>()
      return lines.filter(l => {
        try { const u = new URL(l); if (blacklist.has(u.hostname)) return false; if (whitelist.size && !whitelist.has(u.hostname)) return false } catch {}
        if (seen.has(l)) return false
        seen.add(l)
        return true
      }).join('\n')
    }
    const byDomain = new Map<string,string>()
    for (const l of lines) {
      try { const u = new URL(l); if (blacklist.has(u.hostname)) continue; if (whitelist.size && !whitelist.has(u.hostname)) continue; if (!byDomain.has(u.hostname)) byDomain.set(u.hostname, l) } catch { if (!byDomain.has(l)) byDomain.set(l, l) }
    }
    return Array.from(byDomain.values()).join('\n')
  }, [input, mode, white, black])

  const copy = async () => { await navigator.clipboard.writeText(out); alert('已复制') }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <label className="flex items-center gap-2">模式<select className="select" value={mode} onChange={(e)=>setMode(e.target.value as any)}><option value="exact">按完整 URL 去重</option><option value="byDomain">按域名保留一条</option></select></label>
        <label className="text-sm text-gray-500">白名单域（逗号分隔）<Input  variant="simple" value={white} onChange={(e)=>setWhite(e.target.value)} /></label>
        <label className="text-sm text-gray-500">黑名单域（逗号分隔）<Input  variant="simple" value={black} onChange={(e)=>setBlack(e.target.value)} /></label>
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        <Textarea variant="simple" className="h-48" value={input} onChange={(e)=>setInput(e.target.value)} />
        <Textarea variant="simple" className="h-48" value={out} readOnly />
      </div>
      <button className="btn" onClick={copy}>复制结果</button>
    </div>
  )
}
