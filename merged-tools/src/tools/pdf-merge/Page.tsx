import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'

export default function Page() {
  const [outUrl, setOutUrl] = useState('')
  async function merge(files: FileList | null) {
    if (!files || files.length === 0) return
    const pdfDoc = await PDFDocument.create()
    for (const f of Array.from(files)) {
      const bytes = new Uint8Array(await f.arrayBuffer())
      const src = await PDFDocument.load(bytes)
      const pages = await pdfDoc.copyPages(src, src.getPageIndices())
      pages.forEach((p: any) => pdfDoc.addPage(p))
    }
  const merged = await pdfDoc.save()
  const ab = merged.buffer.slice(merged.byteOffset, merged.byteOffset + merged.byteLength) as ArrayBuffer
  const blob = new Blob([ab], { type: 'application/pdf' })
    setOutUrl(URL.createObjectURL(blob))
  }
  return (
    <div className="space-y-3">
      <input type="file" accept="application/pdf" multiple onChange={(e)=>merge(e.target.files)} />
      {outUrl && <a href={outUrl} download="merged.pdf" className="inline-block px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500">下载合并后的 PDF</a>}
      {outUrl && <iframe src={outUrl} className="w-full h-96 bg-white" />}
    </div>
  )
}
