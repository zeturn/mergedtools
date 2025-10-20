import { useState } from 'react'
import * as exifr from 'exifr'

type Item = { name: string; url: string; type: string; exif?: any }

export default function Page(){
  const [items, setItems] = useState<Item[]>([])

  function onFiles(e: React.ChangeEvent<HTMLInputElement>){
    const files = e.target.files; if(!files) return
    const list: Item[] = []
    for (const f of Array.from(files)){
      list.push({ name: f.name, url: URL.createObjectURL(f), type: f.type })
    }
    setItems(list)
    // load exif async
    list.forEach(async (it)=>{
      try{ it.exif = await exifr.parse(it.url) }catch{}
      setItems(cur=> cur.map(x=> x.url===it.url? { ...x }: x))
    })
  }

  async function downloadStripped(it: Item){
    const blob = await strip(it)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = it.name.replace(/\.(jpe?g|png|webp)$/i, '') + '-clean.png'; a.click(); URL.revokeObjectURL(url)
  }

  async function downloadAll(){
    for (const it of items){ await downloadStripped(it) }
  }

  return (
    <div className="space-y-3">
      <input type="file" accept="image/*" multiple onChange={onFiles} />
      {items.length>0 && <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={downloadAll}>全部下载（已剥离）</button>}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map(it=> (
          <div key={it.url} className="bg-slate-900 rounded p-3 space-y-2">
            <div className="text-xs text-slate-400">{it.name}</div>
            <img src={it.url} className="max-w-full rounded" />
            <details className="bg-slate-800 rounded p-2">
              <summary className="cursor-pointer">EXIF 预览</summary>
              <pre className="text-xs overflow-auto"><code>{JSON.stringify(it.exif||{}, null, 2)}</code></pre>
            </details>
            <div>
              <button className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={()=>downloadStripped(it)}>下载（已剥离）</button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400">说明：JPEG 通过移除 EXIF 或重编码去除；PNG/WEBP 将转码为 PNG 以去除元数据。</p>
    </div>
  )
}

async function strip(it: Item): Promise<Blob>{
  // Prefer canvas re-encode (works for most types, strips metadata)
  const img = await loadImage(it.url)
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight
  const ctx = c.getContext('2d')!; ctx.drawImage(img, 0, 0)
  return await new Promise<Blob>((res)=> c.toBlob(b=> res(b!), 'image/png'))
}

function loadImage(url: string){
  return new Promise<HTMLImageElement>((res, rej)=>{ const im = new Image(); im.onload=()=>res(im); im.onerror=rej; im.src=url })
}
