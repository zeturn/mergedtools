import { useState } from 'react'
import Input from '../../components/Input'

export default function Page(){
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  function decode(){
    try{
      const u = new URL(input)
      const urlParam = u.searchParams.get('url') || u.searchParams.get('urlEncoded') || ''
      const out = urlParam ? decodeURIComponent(urlParam) : ''
      setOutput(out || '未找到原始 url 参数')
    }catch(e: unknown){ setOutput('无效链接或无法解析: ' + String(e)) }
  }

  return (
    <div className="space-y-3">
      <Input  variant="simple" className="" placeholder="粘贴 safelink URL" value={input} onChange={(e)=>setInput(e.target.value)} />
      <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={decode}>解码</button>
      <textarea className="w-full min-h-24 bg-slate-900 rounded p-2" value={output} onChange={(e)=>setOutput(e.target.value)} />
    </div>
  )
}
