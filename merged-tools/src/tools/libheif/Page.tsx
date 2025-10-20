import { useMemo, useState } from 'react'

export default function Page(){
  const [input, setInput] = useState('/path/in.heic')
  const [output, setOutput] = useState('/path/out.jpg')
  const [args, setArgs] = useState('-q 90')
  const cmd = useMemo(()=> `heif-convert ${JSON.stringify(input)} ${JSON.stringify(output)} ${args}`.trim(), [input, output, args])
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">占位工具：生成 libheif 的 heif-convert 命令，需在安装环境执行。</p>
      <div className="grid md:grid-cols-3 gap-2">
        <input className="input" value={input} onChange={e=>setInput(e.target.value)} />
        <input className="input" value={output} onChange={e=>setOutput(e.target.value)} />
        <input className="input" placeholder="参数，如 -q 90" value={args} onChange={e=>setArgs(e.target.value)} />
      </div>
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-all">{cmd}</pre>
    </div>
  )
}
