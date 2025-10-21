import { useMemo, useState } from 'react'
import Input from '../../components/Input'

export default function Page(){
  const [file, setFile] = useState('/path/to/config.yaml')
  const [selector, setSelector] = useState('.path.to.value')
  const [format, setFormat] = useState<'json'|'yaml'|'toml'>('json')
  const cmd = useMemo(()=> `dasel -f ${JSON.stringify(file)} -r ${format} ${JSON.stringify(selector)}`, [file, selector, format])
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">占位工具：生成 dasel 命令，需在安装 dasel 的环境执行。</p>
      <div className="grid md:grid-cols-3 gap-2">
        <Input  variant="simple" value={file} onChange={e=>setFile(e.target.value)} />
        <select className="input" value={format} onChange={e=>setFormat(e.target.value as any)}>
          <option value="json">json</option>
          <option value="yaml">yaml</option>
          <option value="toml">toml</option>
        </select>
        <Input  variant="simple" value={selector} onChange={e=>setSelector(e.target.value)} />
      </div>
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-all">{cmd}</pre>
    </div>
  )
}
