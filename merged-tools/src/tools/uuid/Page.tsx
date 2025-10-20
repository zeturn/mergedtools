import { useMemo, useState } from 'react'

function uuidv4(): string {
  const a = new Uint8Array(16)
  crypto.getRandomValues(a)
  a[6] = (a[6] & 0x0f) | 0x40
  a[8] = (a[8] & 0x3f) | 0x80
  const hex = Array.from(a, x => x.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`
}

export default function Page() {
  const [count, setCount] = useState(10)
  const [uppercase, setUppercase] = useState(false)
  const [noHyphen, setNoHyphen] = useState(false)

  const uuids = useMemo(() => {
    const list = Array.from({ length: Math.max(1, Math.min(1000, count)) }, () => uuidv4())
    return list.map(v => {
      if (noHyphen) v = v.replace(/-/g, '')
      if (uppercase) v = v.toUpperCase()
      return v
    }).join('\n')
  }, [count, uppercase, noHyphen])

  const copy = async () => {
    await navigator.clipboard.writeText(uuids)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm">数量
          <input type="number" className="ml-2 border rounded px-2 py-1 w-24" value={count} min={1} max={1000} onChange={e=>setCount(Number(e.target.value))} />
        </label>
        <label className="text-sm inline-flex items-center gap-2">
          <input type="checkbox" checked={uppercase} onChange={e=>setUppercase(e.target.checked)} /> 大写
        </label>
        <label className="text-sm inline-flex items-center gap-2">
          <input type="checkbox" checked={noHyphen} onChange={e=>setNoHyphen(e.target.checked)} /> 去短横线
        </label>
        <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={copy}>复制</button>
      </div>
      <textarea className="w-full h-64 border rounded px-2 py-1 font-mono" readOnly value={uuids} />
    </div>
  )
}

