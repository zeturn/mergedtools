import { useState } from 'react'
import QRCode from 'qrcode'
// @ts-ignore
import jsQR from 'jsqr'

export default function Page(){
  const [listInput, setListInput] = useState('https://example.com\nHello World')
  const [size, setSize] = useState(256)
  const [urls, setUrls] = useState<string[]>([])
  const [decoded, setDecoded] = useState<string[]>([])
  
  async function gen(){
    const items = listInput.split(/\n+/).map(s=>s.trim()).filter(Boolean)
    const outs: string[] = []
    for (const s of items){ outs.push(await QRCode.toDataURL(s, { width: size })) }
    setUrls(outs)
  }

  async function decodeFiles(files: FileList){
    const out: string[] = []
    for (const f of Array.from(files)){
      const img = new Image(); img.src = URL.createObjectURL(f); await new Promise(res=> img.onload=res)
      const canvas = document.createElement('canvas'); canvas.width=img.naturalWidth; canvas.height=img.naturalHeight
      const ctx = canvas.getContext('2d')!; ctx.drawImage(img,0,0)
      const imgData = ctx.getImageData(0,0,canvas.width, canvas.height)
      const r = jsQR(imgData.data, canvas.width, canvas.height)
      out.push(r?.data || '(未识别)')
    }
    setDecoded(out)
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center flex-wrap">
        <textarea className="w-full min-h-24 rounded bg-slate-800 p-2" value={listInput} onChange={(e)=>setListInput(e.target.value)} />
        <div className="flex gap-2 items-center">
          <span className="text-sm text-slate-400">尺寸</span>
          <input type="number" className="w-28 rounded bg-slate-800 p-2" value={size} onChange={(e)=>setSize(Number(e.target.value))} />
          <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={gen}>批量生成</button>
        </div>
      </div>
      {urls.length>0 && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {urls.map((u,i)=> <div key={i} className="p-2 rounded bg-slate-900"><img src={u} className="mx-auto"/><div className="text-xs text-slate-400 break-all mt-1">{i+1}</div></div>)}
        </div>
      )}
      <div className="space-y-2">
        <div className="text-sm text-slate-400">批量解码（选择多张带二维码的图片）</div>
        <input type="file" accept="image/*" multiple onChange={(e)=> e.target.files && decodeFiles(e.target.files)} />
        {decoded.length>0 && <textarea className="w-full min-h-24 rounded bg-slate-900 p-2 font-mono" value={decoded.join('\n')} onChange={(e)=>setDecoded(e.target.value.split(/\n+/))} />}
      </div>
    </div>
  )
}
