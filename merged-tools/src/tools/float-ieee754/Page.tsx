import { useState } from 'react'

function parseInRadix(str: string, radix: number){
  // support integer.fraction form in given radix (2..36)
  const s = str.trim().toLowerCase()
  if (!/^[-+]?[0-9a-z]*\.?[0-9a-z]+$/.test(s)) throw new Error('格式错误')
  const neg = s.startsWith('-')
  const t = s.replace(/^[-+]/,'')
  const [intPart, fracPart=''] = t.split('.')
  let val = 0
  for (const ch of intPart){ val = val*radix + parseInt(ch, radix) }
  let mul = 1
  for (const ch of fracPart){ mul /= radix; val += parseInt(ch, radix)*mul }
  return neg ? -val : val
}

function f32ToHex(n: number){ const b = new ArrayBuffer(4); const dv = new DataView(b); dv.setFloat32(0, n); const u = new Uint8Array(b); return Array.from(u).map(x=>x.toString(16).padStart(2,'0')).join('') }
function f64ToHex(n: number){ const b = new ArrayBuffer(8); const dv = new DataView(b); dv.setFloat64(0, n); const u = new Uint8Array(b); return Array.from(u).map(x=>x.toString(16).padStart(2,'0')).join('') }
function hexToF32(hex: string){ const s = hex.replace(/\s+/g,''); if(s.length!==8) throw new Error('需要 8 个 hex'); const b = new Uint8Array(4); for(let i=0;i<4;i++) b[i]=parseInt(s.slice(i*2,i*2+2),16); const dv=new DataView(b.buffer); return dv.getFloat32(0) }
function hexToF64(hex: string){ const s = hex.replace(/\s+/g,''); if(s.length!==16) throw new Error('需要 16 个 hex'); const b = new Uint8Array(8); for(let i=0;i<8;i++) b[i]=parseInt(s.slice(i*2,i*2+2),16); const dv=new DataView(b.buffer); return dv.getFloat64(0) }

export default function Page(){
  const [input, setInput] = useState('3.1415926')
  const [radix, setRadix] = useState(10)
  const [f32, setF32] = useState('')
  const [f64, setF64] = useState('')
  const [back32, setBack32] = useState('')
  const [back64, setBack64] = useState('')
  const [hexIn32, setHexIn32] = useState('')
  const [hexIn64, setHexIn64] = useState('')

  function run(){
    try{
      const val = parseInRadix(input, radix)
      setF32(f32ToHex(val))
      setF64(f64ToHex(val))
      setBack32(String(new DataView(new Uint8Array(hexIn32? hexIn32.match(/.{1,2}/g)!.map(h=>parseInt(h,16)) : f32.match(/.{1,2}/g)!.map(h=>parseInt(h,16))).buffer).getFloat32(0)))
      setBack64(String(new DataView(new Uint8Array(hexIn64? hexIn64.match(/.{1,2}/g)!.map(h=>parseInt(h,16)) : f64.match(/.{1,2}/g)!.map(h=>parseInt(h,16))).buffer).getFloat64(0)))
    }catch(e:any){ alert(e?.message || '解析失败') }
  }

  function applyHex32(){ try{ setBack32(String(hexToF32(hexIn32))) } catch(e:any){ alert(e?.message||'失败') } }
  function applyHex64(){ try{ setBack64(String(hexToF64(hexIn64))) } catch(e:any){ alert(e?.message||'失败') } }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center flex-wrap">
        <input className="rounded bg-slate-800 p-2" value={input} onChange={(e)=>setInput(e.target.value)} />
        <span className="text-sm text-slate-400">进制</span>
        <input type="number" min={2} max={36} className="w-24 rounded bg-slate-800 p-2" value={radix} onChange={(e)=>setRadix(Number(e.target.value))} />
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={run}>转换</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-slate-400">IEEE754 32-bit (hex)</div>
          <div className="rounded bg-slate-900 p-2 font-mono break-all select-all">{f32}</div>
          <div className="text-sm text-slate-400">反向（8 hex）</div>
          <input className="w-full rounded bg-slate-800 p-2 font-mono" value={hexIn32} onChange={(e)=>setHexIn32(e.target.value)} />
          <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 mt-1" onClick={applyHex32}>→ 数值</button>
          {back32 && <div className="rounded bg-slate-900 p-2 font-mono">{back32}</div>}
        </div>
        <div>
          <div className="text-sm text-slate-400">IEEE754 64-bit (hex)</div>
          <div className="rounded bg-slate-900 p-2 font-mono break-all select-all">{f64}</div>
          <div className="text-sm text-slate-400">反向（16 hex）</div>
          <input className="w-full rounded bg-slate-800 p-2 font-mono" value={hexIn64} onChange={(e)=>setHexIn64(e.target.value)} />
          <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 mt-1" onClick={applyHex64}>→ 数值</button>
          {back64 && <div className="rounded bg-slate-900 p-2 font-mono">{back64}</div>}
        </div>
      </div>
    </div>
  )
}
