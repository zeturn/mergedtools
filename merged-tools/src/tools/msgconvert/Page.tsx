import { useMemo, useState } from 'react'

export default function Page(){
  const [input, setInput] = useState('/path/to/mail.msg')
  const [outputDir, setOutputDir] = useState('.')
  const cmd = useMemo(()=> `msgconvert --output-dir ${JSON.stringify(outputDir)} ${JSON.stringify(input)}`, [input, outputDir])
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">占位工具：生成 msgconvert 命令，需在安装 msgconvert 的环境执行。</p>
      <div className="grid md:grid-cols-2 gap-2">
        <input className="input" value={input} onChange={e=>setInput(e.target.value)} />
        <input className="input" value={outputDir} onChange={e=>setOutputDir(e.target.value)} />
      </div>
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-all">{cmd}</pre>
    </div>
  )
}
