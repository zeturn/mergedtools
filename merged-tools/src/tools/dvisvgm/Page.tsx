import { useMemo, useState } from 'react'

export default function Page(){
  const [input, setInput] = useState('/path/to/input.dvi')
  const [out, setOut] = useState('/path/to/output.svg')
  const [extra, setExtra] = useState('')
  const cmd = useMemo(()=> `dvisvgm -o ${JSON.stringify(out)} ${extra} ${JSON.stringify(input)}`.trim(), [input, out, extra])
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">占位工具：生成 dvisvgm 命令，需在安装 dvisvgm 的环境执行。</p>
      <div className="grid md:grid-cols-3 gap-2">
        <input className="input" value={input} onChange={e=>setInput(e.target.value)} />
        <input className="input" value={out} onChange={e=>setOut(e.target.value)} />
        <input className="input" placeholder="可选参数" value={extra} onChange={e=>setExtra(e.target.value)} />
      </div>
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-all">{cmd}</pre>
    </div>
  )
}
