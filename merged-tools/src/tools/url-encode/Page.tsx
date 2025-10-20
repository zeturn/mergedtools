import { useState } from 'react'

type Mode = 'encodeURIComponent' | 'decodeURIComponent' | 'encodeURI' | 'decodeURI'

export default function Page(){
  const [input, setInput] = useState('https://example.com?q=空 格&x=1/2#锚点')
  const [mode, setMode] = useState<Mode>('encodeURIComponent')
  const [spacePlus, setSpacePlus] = useState(false)
  const [output, setOutput] = useState('')

  function run(){
    try{
      let out = ''
      switch(mode){
        case 'encodeURIComponent': out = encodeURIComponent(input); break
        case 'decodeURIComponent': out = decodeURIComponent(input); break
        case 'encodeURI': out = encodeURI(input); break
        case 'decodeURI': out = decodeURI(input); break
      }
      if (spacePlus && (mode==='encodeURIComponent' || mode==='encodeURI')){
        out = out.replace(/%20/g, '+')
      }
      if (spacePlus && (mode==='decodeURIComponent' || mode==='decodeURI')){
        out = out.replace(/\+/g, '%20')
      }
      setOutput(out)
    }catch(e: unknown){ setOutput(String(e)) }
  }

  return (
    <div className="space-y-3">
      <textarea className="w-full min-h-32 bg-slate-900 rounded p-2" value={input} onChange={(e)=>setInput(e.target.value)} />
      <div className="flex gap-3 items-center flex-wrap">
        <select className="bg-slate-800 rounded p-1" value={mode} onChange={(e)=>setMode(e.target.value as Mode)}>
          <option value="encodeURIComponent">encodeURIComponent</option>
          <option value="decodeURIComponent">decodeURIComponent</option>
          <option value="encodeURI">encodeURI</option>
          <option value="decodeURI">decodeURI</option>
        </select>
        <label className="text-sm text-slate-400 flex items-center gap-2"><input type="checkbox" checked={spacePlus} onChange={(e)=>setSpacePlus(e.target.checked)} />空格使用 +</label>
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={run}>转换</button>
      </div>
      <textarea className="w-full min-h-32 bg-slate-900 rounded p-2" value={output} onChange={(e)=>setOutput(e.target.value)} />
    </div>
  )
}
