import { useMemo, useState } from 'react'
import Input from '../../components/Input'

export default function Page(){
  const [input, setInput] = useState('/path/in.pbm')
  const [output, setOutput] = useState('/path/out.svg')
  const [args, setArgs] = useState('-s -t 2')
  const cmd = useMemo(()=> `potrace ${args} -o ${JSON.stringify(output)} ${JSON.stringify(input)}`.trim(), [input, output, args])
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">占位工具：生成 potrace 命令，需在安装环境执行。</p>
      <div className="grid md:grid-cols-3 gap-2">
        <Input  variant="simple" value={input} onChange={e=>setInput(e.target.value)} />
        <Input  variant="simple" value={output} onChange={e=>setOutput(e.target.value)} />
        <Input  variant="simple" placeholder="参数，如 -s -t 2" value={args} onChange={e=>setArgs(e.target.value)} />
      </div>
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-all">{cmd}</pre>
    </div>
  )
}
