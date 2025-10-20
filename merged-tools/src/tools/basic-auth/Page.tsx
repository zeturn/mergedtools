import { useState } from 'react'

export default function Page() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const out = user || pass ? btoa(`${user}:${pass}`) : ''
  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <input className="rounded bg-slate-800 p-2" placeholder="用户名" value={user} onChange={(e)=>setUser(e.target.value)} />
        <input className="rounded bg-slate-800 p-2" placeholder="密码" value={pass} onChange={(e)=>setPass(e.target.value)} />
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={()=>{ navigator.clipboard?.writeText(`Basic ${out}`) }}>复制</button>
      </div>
      <div className="rounded bg-slate-900 p-2 font-mono">{out ? `Basic ${out}` : '输入用户名和密码'}</div>
    </div>
  )
}
