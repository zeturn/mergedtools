import { useMemo, useState } from 'react'
import { Textarea } from '../../components/Input'

export default function Page(){
  const [text, setText] = useState('{"a":1}')
  const [pretty, setPretty] = useState(true)
  const out = useMemo(()=>{
    try{
      const v = JSON.parse(text)
      return pretty ? JSON.stringify(v, null, 2) : '合法 JSON'
    }catch(e:any){
      return '无效 JSON: ' + (e.message || String(e))
    }
  }, [text, pretty])
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2"><input type="checkbox" checked={pretty} onChange={e=>setPretty(e.target.checked)} /> 美化输出</label>
      <div className="grid md:grid-cols-2 gap-6">
        <Textarea variant="simple" className="h-48" value={text} onChange={e=>setText(e.target.value)} />
        <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{out}</pre>
      </div>
    </div>
  )
}
