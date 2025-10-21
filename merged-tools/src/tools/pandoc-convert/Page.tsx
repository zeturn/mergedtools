import { useMemo, useState } from 'react'
import Input from '../../components/Input'

export default function Page(){
  const [input, setInput] = useState('/path/to/input.md')
  const [output, setOutput] = useState('/path/to/output.docx')
  const [extra, setExtra] = useState('')
  const cmd = useMemo(()=> `pandoc ${JSON.stringify(input)} -o ${JSON.stringify(output)} ${extra}`.trim(), [input, output, extra])
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">占位工具：生成 pandoc 命令参数，需在安装 pandoc 的环境执行。</p>
      <div className="grid md:grid-cols-3 gap-2">
        <Input  variant="simple" value={input} onChange={e=>setInput(e.target.value)} />
        <Input  variant="simple" value={output} onChange={e=>setOutput(e.target.value)} />
        <Input  variant="simple" placeholder="可选参数" value={extra} onChange={e=>setExtra(e.target.value)} />
      </div>
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-all">{cmd}</pre>
    </div>
  )
}
