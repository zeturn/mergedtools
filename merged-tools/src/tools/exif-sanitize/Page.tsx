import { useState } from 'react'
import * as piexif from 'piexifjs'

async function fileToDataURL(file: File): Promise<string> {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = rej; r.readAsDataURL(file) })
}

async function stripAllViaCanvas(file: File): Promise<string> {
  const url = URL.createObjectURL(file)
  try {
    const img = new Image(); img.src = url
    await new Promise((res, rej) => { img.onload = () => res(null); img.onerror = rej })
    const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height
    canvas.getContext('2d')!.drawImage(img, 0, 0)
    return canvas.toDataURL('image/jpeg', 0.92)
  } finally { URL.revokeObjectURL(url) }
}

export default function Page() {
  const [file, setFile] = useState<File | null>(null)
  const [artist, setArtist] = useState('')
  const [out, setOut] = useState('')
  const [msg, setMsg] = useState('')

  async function removeGPS() {
    if (!file) return
    try {
      const dataURL = await fileToDataURL(file)
      const exif = piexif.load(dataURL)
      // 删除 GPS IFD
      exif.GPS = {}
      if (artist) {
        // 写入基础 Artist（0x013B）在 0th IFD
        exif['0th'] = exif['0th'] || {}
        exif['0th'][piexif.ImageIFD.Artist] = artist
      }
      const exifStr = piexif.dump(exif)
      const inserted = piexif.insert(exifStr, dataURL)
      setOut(inserted)
      setMsg('已移除 GPS，并写入 Artist（如已设置）')
    } catch (e: any) { setMsg(`处理失败: ${e?.message ?? '未知'}`) }
  }

  async function clearAll() {
    if (!file) return
    const dataURL = await stripAllViaCanvas(file)
    setOut(dataURL); setMsg('已通过 Canvas 清除全部元数据')
  }

  return (
    <div className="space-y-3">
      <input type="file" accept="image/jpeg" onChange={(e)=>{ setFile(e.target.files?.[0] ?? null); setOut(''); setMsg('') }} />
      <div className="text-sm text-slate-400">可选：写入 Artist</div>
      <input className="w-full rounded bg-slate-800 p-2" value={artist} onChange={(e)=>setArtist(e.target.value)} placeholder="作者/艺术家（可选）" />
      <div className="flex gap-3">
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={removeGPS} disabled={!file}>移除 GPS（保留其他 EXIF）</button>
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={clearAll} disabled={!file}>清除全部元数据（Canvas）</button>
      </div>
      {msg && <div className="text-sm text-slate-400">{msg}</div>}
      {out && <div className="space-y-2"><img src={out} className="max-h-80 bg-white rounded" /><a href={out} download="sanitized.jpg" className="inline-block px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500">下载</a></div>}
    </div>
  )
}
