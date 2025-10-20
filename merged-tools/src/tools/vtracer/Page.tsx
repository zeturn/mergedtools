import { useMemo, useState } from 'react'

export default function Page(){
  const [input, setInput] = useState('/path/in.png')
  const [output, setOutput] = useState('/path/out.svg')
  const [args, setArgs] = useState('--mode polygon')
  const cmd = useMemo(()=> `vtracer ${args} ${JSON.stringify(input)} -o ${JSON.stringify(output)}`.trim(), [input, output, args])
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">占位工具：生成 vtracer 命令，需在安装环境执行。</p>
      <div className="grid md:grid-cols-3 gap-2">
        <input className="input" value={input} onChange={e=>setInput(e.target.value)} />
        <input className="input" value={output} onChange={e=>setOutput(e.target.value)} />
        <input className="input" placeholder="参数，如 --mode polygon" value={args} onChange={e=>setArgs(e.target.value)} />
      </div>
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-all">{cmd}</pre>
    </div>
  )
}
