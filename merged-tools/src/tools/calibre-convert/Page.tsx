import { useMemo, useState } from 'react'

export default function Page(){
  const [input, setInput] = useState('/path/to/input.epub')
  const [output, setOutput] = useState('/path/to/output.mobi')
  const [extra, setExtra] = useState('')
  const cmd = useMemo(()=> `ebook-convert ${JSON.stringify(input)} ${JSON.stringify(output)} ${extra}`.trim(), [input, output, extra])
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">占位工具：生成 calibre 的 ebook-convert 命令，需在安装 calibre 的环境执行。</p>
      <div className="grid md:grid-cols-3 gap-2">
        <input className="input" value={input} onChange={e=>setInput(e.target.value)} />
        <input className="input" value={output} onChange={e=>setOutput(e.target.value)} />
        <input className="input" placeholder="可选参数" value={extra} onChange={e=>setExtra(e.target.value)} />
      </div>
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-all">{cmd}</pre>
    </div>
  )
}
