import { useState } from 'react'

export default function Page(){
  const [json, setJson] = useState('{"hello":"world"}')
  const [bsonHex, setBsonHex] = useState('')
  const [msgpackHex, setMsgpackHex] = useState('')
  const [out, setOut] = useState('')

  function bytesToHex(a: Uint8Array){ return Array.from(a).map(b=>b.toString(16).padStart(2,'0')).join('') }
  function hexToBytes(s: string){ const t=s.replace(/\s+/g,''); const a=new Uint8Array(t.length/2); for(let i=0;i<a.length;i++) a[i]=parseInt(t.slice(i*2,i*2+2),16); return a }

  async function toBson(){
    try{
      const obj = JSON.parse(json)
      const bson = await import('bson')
      const buff = bson.serialize(obj)
      setBsonHex(bytesToHex(buff))
    }catch(e:any){ alert(e?.message||'失败') }
  }
  async function fromBson(){
    try{
      const bson = await import('bson')
      const obj = bson.deserialize(hexToBytes(bsonHex))
      setOut(JSON.stringify(obj, null, 2))
    }catch(e:any){ alert(e?.message||'失败') }
  }
  async function toMsg(){
    try{
      const obj = JSON.parse(json)
      const { encode } = await import('@msgpack/msgpack')
      const buff = encode(obj)
      setMsgpackHex(bytesToHex(buff))
    }catch(e:any){ alert(e?.message||'失败') }
  }
  async function fromMsg(){
    try{
      const { decode } = await import('@msgpack/msgpack')
      const obj = decode(hexToBytes(msgpackHex))
      setOut(JSON.stringify(obj, null, 2))
    }catch(e:any){ alert(e?.message||'失败') }
  }

  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-4">
        <section className="space-y-2">
          <div className="text-sm text-slate-400">JSON</div>
          <textarea className="w-full min-h-24 rounded bg-slate-800 p-2 font-mono" value={json} onChange={(e)=>setJson(e.target.value)} />
          <div className="flex gap-2 flex-wrap">
            <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={toBson}>→ BSON (hex)</button>
            <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={toMsg}>→ MsgPack (hex)</button>
          </div>
        </section>
        <section className="space-y-2">
          <div className="text-sm text-slate-400">解码输出</div>
          <pre className="w-full min-h-24 rounded bg-slate-900 p-2 font-mono whitespace-pre-wrap break-words">{out}</pre>
        </section>
      </div>
      <section className="space-y-2">
        <div className="text-sm text-slate-400">BSON hex</div>
        <textarea className="w-full min-h-20 rounded bg-slate-800 p-2 font-mono" value={bsonHex} onChange={(e)=>setBsonHex(e.target.value)} />
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={fromBson}>BSON → JSON</button>
      </section>
      <section className="space-y-2">
        <div className="text-sm text-slate-400">MsgPack hex</div>
        <textarea className="w-full min-h-20 rounded bg-slate-800 p-2 font-mono" value={msgpackHex} onChange={(e)=>setMsgpackHex(e.target.value)} />
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={fromMsg}>MsgPack → JSON</button>
      </section>
    </div>
  )
}
