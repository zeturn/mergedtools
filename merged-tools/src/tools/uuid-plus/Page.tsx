import { useState } from 'react'
import { v1 as uuidv1, v4 as uuidv4, v5 as uuidv5 } from 'uuid'

export default function Page() {
  const [ns, setNs] = useState('6ba7b811-9dad-11d1-80b4-00c04fd430c8')
  const [name, setName] = useState('example')
  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-3 gap-3">
        <div className="rounded bg-slate-800 p-2 font-mono">v1: {uuidv1()}</div>
        <div className="rounded bg-slate-800 p-2 font-mono">v4: {uuidv4()}</div>
        <div className="rounded bg-slate-800 p-2 font-mono">v5: {uuidv5(name, ns)}</div>
      </div>
      <div className="grid md:grid-cols-2 gap-3 items-center">
        <input className="rounded bg-slate-800 p-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="v5 name" />
        <input className="rounded bg-slate-800 p-2" value={ns} onChange={(e) => setNs(e.target.value)} placeholder="v5 namespace UUID" />
      </div>
    </div>
  )
}
