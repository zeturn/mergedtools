import { useMemo, useState } from 'react'
import { customAlphabet, nanoid as nanoidDefault } from 'nanoid'

const PRESETS: Record<string, string> = {
  url: 'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW', // nanoid url-friendly
  hex: '0123456789abcdef',
  base62: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
}

export default function Page() {
  const [len, setLen] = useState(21)
  const [preset, setPreset] = useState<'url'|'hex'|'base62'>('url')
  const [custom, setCustom] = useState('')
  const alphabet = useMemo(() => custom || PRESETS[preset], [preset, custom])
  const nano = useMemo(() => (alphabet ? customAlphabet(alphabet, len) : null), [alphabet, len])
  const [out, setOut] = useState('')
  function gen() { setOut(nano ? nano() : nanoidDefault(len)) }
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-sm text-slate-400">长度</label>
        <input type="number" min={4} max={256} className="w-24 rounded bg-slate-800 p-2" value={len} onChange={(e)=>setLen(Number(e.target.value))} />
        <select className="rounded bg-slate-800 p-2" value={preset} onChange={(e)=>setPreset(e.target.value as any)}>
          <option value="url">URL</option>
          <option value="hex">Hex</option>
          <option value="base62">Base62</option>
        </select>
        <input className="rounded bg-slate-800 p-2 min-w-[200px]" placeholder="自定义字符集（可选）" value={custom} onChange={(e)=>setCustom(e.target.value)} />
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={gen}>生成</button>
      </div>
      <div className="rounded bg-slate-900 p-2 font-mono select-all break-all">{out || '点击生成'}</div>
    </div>
  )
}
