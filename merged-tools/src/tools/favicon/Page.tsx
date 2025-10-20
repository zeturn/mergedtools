import { useEffect, useState } from 'react'

const DEFAULT_SIZES = [16, 32, 48, 64, 128]

type Mode = 'image' | 'text'

export default function Page(){
  const [mode, setMode] = useState<Mode>('image')
  const [img, setImg] = useState<HTMLImageElement|null>(null)
  const [text, setText] = useState('A')
  const [bg, setBg] = useState('#00000000')
  const [fg, setFg] = useState('#ffffff')
  const [font, setFont] = useState('bold 80% system-ui, sans-serif')
  const [sizes, setSizes] = useState<number[]>(DEFAULT_SIZES)
  const [icoUrl, setIcoUrl] = useState('')

  function onFile(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0]; if(!f) return
    const url = URL.createObjectURL(f)
    const image = new Image(); image.src = url
    image.onload = ()=> setImg(image)
  }

  function toggleSize(s: number){
    setSizes(prev=> prev.includes(s)? prev.filter(x=>x!==s): [...prev, s].sort((a,b)=>a-b))
  }

  useEffect(()=>{
    // 生成预览时再按需渲染；此处不存储中间结果以减小内存占用。
  }, [mode, img, text, bg, fg, font, sizes])

  async function build(){
    const pngs: Uint8Array[] = []
    for (const s of sizes){
      const data = await renderPng(s)
      if (data) pngs.push(new Uint8Array(data))
    }
    if (pngs.length===0) return
    const ico = buildIco(pngs)
    const blob = new Blob([ico], { type: 'image/x-icon' })
    setIcoUrl(URL.createObjectURL(blob))
  }

  async function renderPng(size: number){
    const c = document.createElement('canvas'); c.width=size; c.height=size
    const ctx = c.getContext('2d')!
    if (bg){ ctx.fillStyle = cssColor(bg); ctx.fillRect(0,0,size,size) }
    if (mode==='image' && img){
      // contain fit
      const ratio = Math.min(size/img.naturalWidth, size/img.naturalHeight)
      const w = Math.round(img.naturalWidth*ratio)
      const h = Math.round(img.naturalHeight*ratio)
      const x = Math.round((size - w)/2)
      const y = Math.round((size - h)/2)
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, x, y, w, h)
    } else if (mode==='text'){
      ctx.fillStyle = cssColor(fg)
      // dynamic font size based on canvas size
      const pct = /([0-9]+)%/.exec(font)?.[1]
      const scale = pct? (Number(pct)/100) : 0.8
      ctx.font = font.replace(/[0-9]+%/, Math.round(size*scale)+'px')
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(text, size/2, size/2)
    }
    return await new Promise<ArrayBuffer|undefined>(res=> c.toBlob(b=> b?.arrayBuffer().then(res), 'image/png'))
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3 items-center flex-wrap">
        <label className="text-sm text-slate-400">来源
          <select className="ml-2 bg-slate-800 rounded p-1" value={mode} onChange={(e)=>setMode(e.target.value as Mode)}>
            <option value="image">PNG 图像</option>
            <option value="text">文本</option>
          </select>
        </label>
        {mode==='image' ? (
          <input type="file" accept="image/*" onChange={onFile} />
        ):(
          <>
            <input className="bg-slate-800 rounded p-2" placeholder="文本" value={text} onChange={(e)=>setText(e.target.value)} />
            <input className="bg-slate-800 rounded p-2 w-52" placeholder="字体（含百分比占比）" value={font} onChange={(e)=>setFont(e.target.value)} />
            <label className="text-sm text-slate-400">文字颜色<input type="color" className="ml-2" value={fg} onChange={(e)=>setFg(e.target.value)} /></label>
          </>
        )}
        <label className="text-sm text-slate-400">背景<input type="text" className="ml-2 bg-slate-800 rounded p-2 w-36" value={bg} onChange={(e)=>setBg(e.target.value)} placeholder="#RRGGBBAA 或透明" /></label>
      </div>
      <div className="flex gap-2 flex-wrap items-center">
        {DEFAULT_SIZES.map(s=> (
          <label key={s} className="flex items-center gap-1 text-sm"><input type="checkbox" checked={sizes.includes(s)} onChange={()=>toggleSize(s)} />{s}x{s}</label>
        ))}
      </div>
      <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={build} disabled={mode==='image' && !img}>生成 ICO</button>
      {icoUrl && (
        <div className="flex items-center gap-3">
          <a href={icoUrl} download="favicon.ico" className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600">下载 favicon.ico</a>
          <span className="text-sm text-slate-400">预览：{sizes.map(s=> <img key={s} src={icoUrl} alt="ico" width={s} height={s} className="inline-block rounded bg-slate-900 mr-2" />)}</span>
        </div>
      )}
      <p className="text-xs text-slate-400">说明：.ico 内部使用 PNG 数据，现代浏览器与操作系统均支持。</p>
    </div>
  )
}

function cssColor(s: string){
  if (!s || s==='#00000000') return 'rgba(0,0,0,0)'
  if (/^#([0-9a-f]{8})$/i.test(s)){
    const r = parseInt(s.slice(1,3),16), g = parseInt(s.slice(3,5),16), b = parseInt(s.slice(5,7),16), a = parseInt(s.slice(7,9),16)/255
    return `rgba(${r},${g},${b},${a})`
  }
  return s
}

function buildIco(pngs: Uint8Array[]): ArrayBuffer{
  // ICO header
  const n = pngs.length
  const headerSize = 6 + 16*n
  let offset = headerSize
  const total = headerSize + pngs.reduce((a,b)=>a+b.length,0)
  const out = new ArrayBuffer(total)
  const view = new DataView(out)
  // ICONDIR
  view.setUint16(0, 0, true) // reserved
  view.setUint16(2, 1, true) // type (icon)
  view.setUint16(4, n, true) // count
  let dirPos = 6
  for (let i=0;i<n;i++){
    const png = pngs[i]
    const size = estimatePngSize(png) // fallback to width in entry; if can't, use 0 (256)
    const width = size||0
    const height = size||0
    outCopy(new Uint8Array(out), offset, png)
    // ICONDIRENTRY
    view.setUint8(dirPos+0, width===256?0:width)
    view.setUint8(dirPos+1, height===256?0:height)
    view.setUint8(dirPos+2, 0) // color count
    view.setUint8(dirPos+3, 0) // reserved
    view.setUint16(dirPos+4, 1, true) // planes
    view.setUint16(dirPos+6, 32, true) // bitcount
    view.setUint32(dirPos+8, png.length, true) // bytes in res
    view.setUint32(dirPos+12, offset, true) // image offset
    dirPos += 16
    offset += png.length
  }
  return out
}

function outCopy(dst: Uint8Array, offset: number, src: Uint8Array){
  dst.set(src, offset)
}

function estimatePngSize(png: Uint8Array): number{
  // Read IHDR width/height (bytes 16..23)
  if (png.length>24 && png[12]===0x49 && png[13]===0x48 && png[14]===0x44 && png[15]===0x52){
    const dv = new DataView(png.buffer, png.byteOffset, png.byteLength)
    const w = dv.getUint32(16, false)
    // const h = dv.getUint32(20, false)
    return w
  }
  return 0
}
