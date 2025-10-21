import { useMemo, useState } from 'react'
import Input from '../../components/Input'

export default function Page(){
  const [input, setInput] = useState('/path/in.jpg')
  const [output, setOutput] = useState('/path/out.webp')
  const [args, setArgs] = useState('shrink 2')
  const cmd = useMemo(()=> `vips ${args} ${JSON.stringify(input)} ${JSON.stringify(output)}`.trim(), [input, output, args])
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">占位工具：生成 vips 命令，需在安装环境执行。</p>
      <div className="grid md:grid-cols-3 gap-2">
        <Input  variant="simple" value={input} onChange={e=>setInput(e.target.value)} />
        <Input  variant="simple" value={output} onChange={e=>setOutput(e.target.value)} />
        <Input  variant="simple" placeholder="参数，如 shrink 2" value={args} onChange={e=>setArgs(e.target.value)} />
      </div>
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-all">{cmd}</pre>
    </div>
  )
}
