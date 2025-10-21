import { useMemo, useState } from 'react'
import { Input, Textarea } from '../../components/Input'

export default function Page(){
  const [input, setInput] = useState('a b c')
  const [sep, setSep] = useState(' ')
  const [pre, setPre] = useState('[')
  const [post, setPost] = useState(']')
  const out = useMemo(()=>{
    const arr = (sep? input.split(sep): input.split(/\s+/)).filter(Boolean)
    return arr.map(x=> `${pre}${x}${post}`).join(sep || ' ')
  }, [input, sep, pre, post])
  return (
    <div className="space-y-3">
      <Textarea variant="simple" className="h-36" value={input} onChange={e=>setInput(e.target.value)} />
      <div className="grid md:grid-cols-3 gap-2">
        <Input  variant="simple" placeholder="分隔符(留空=空白)" value={sep} onChange={e=>setSep(e.target.value)} />
        <Input  variant="simple" placeholder="前缀" value={pre} onChange={e=>setPre(e.target.value)} />
        <Input  variant="simple" placeholder="后缀" value={post} onChange={e=>setPost(e.target.value)} />
      </div>
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{out}</pre>
    </div>
  )
}
