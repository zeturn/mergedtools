import { useMemo, useState } from 'react'

export default function Page(){
  const [input, setInput] = useState('/path/to/input.docx')
  const [format, setFormat] = useState('pdf')
  const cmd = useMemo(()=> `libreoffice --headless --convert-to ${format} ${JSON.stringify(input)}`, [input, format])
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">占位工具：本页仅生成命令，需在安装了 LibreOffice 的环境中执行。</p>
      <div className="grid md:grid-cols-2 gap-2">
        <input className="input" value={input} onChange={e=>setInput(e.target.value)} />
        <input className="input" value={format} onChange={e=>setFormat(e.target.value)} />
      </div>
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-all">{cmd}</pre>
    </div>
  )
}
