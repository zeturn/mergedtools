import { useMemo, useState } from 'react'

export default function Page(){
  const [input, setInput] = useState('/path/in.svg')
  const [output, setOutput] = useState('/path/out.png')
  const [args, setArgs] = useState('--export-dpi=300')
  const cmd = useMemo(()=> `inkscape ${JSON.stringify(input)} --export-filename=${JSON.stringify(output)} ${args}`.trim(), [input, output, args])
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">占位工具：生成 inkscape 命令，需在安装环境执行。</p>
      <div className="grid md:grid-cols-3 gap-2">
        <input className="input" value={input} onChange={e=>setInput(e.target.value)} />
        <input className="input" value={output} onChange={e=>setOutput(e.target.value)} />
        <input className="input" placeholder="参数，如 --export-dpi=300" value={args} onChange={e=>setArgs(e.target.value)} />
      </div>
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-all">{cmd}</pre>
    </div>
  )
}
