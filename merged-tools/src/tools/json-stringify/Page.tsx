import { useMemo, useState } from 'react'

export default function Page(){
  const [json, setJson] = useState('{"hello":"world"}')
  const out = useMemo(()=>{
    try{
      const v = JSON.parse(json)
      return JSON.stringify(v)
    }catch(e:any){
      return e.message || String(e)
    }
  }, [json])
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <textarea className="textarea h-48" value={json} onChange={e=>setJson(e.target.value)} />
      <textarea className="textarea h-48" value={String(out)} readOnly />
    </div>
  )
}
