import { useMemo, useRef, useState } from 'react'

export default function Page() {
  const [fn, setFn] = useState('Ada Lovelace')
  const [org, setOrg] = useState('Analytical Engine')
  const [title, setTitle] = useState('Chief Programmer')
  const [tel, setTel] = useState('+1-555-1234')
  const [email, setEmail] = useState('ada@example.com')
  const [url, setUrl] = useState('https://example.com')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const vcard = useMemo(() => {
    const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,')
    return [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${esc(fn)}`,
      org ? `ORG:${esc(org)}` : '',
      title ? `TITLE:${esc(title)}` : '',
      tel ? `TEL;TYPE=CELL:${esc(tel)}` : '',
      email ? `EMAIL:${esc(email)}` : '',
      url ? `URL:${esc(url)}` : '',
      'END:VCARD',
    ].filter(Boolean).join('\n')
  }, [fn, org, title, tel, email, url])

  const renderQR = async () => {
    const { toCanvas } = await import('qrcode')
    if (canvasRef.current) await toCanvas(canvasRef.current, vcard, { errorCorrectionLevel: 'M', margin: 1, scale: 6 })
  }

  const onCopy = async () => { await navigator.clipboard.writeText(vcard); alert('已复制 vCard') }
  const onDownload = () => {
    const c = canvasRef.current
    if (!c) return
    const a = document.createElement('a')
    a.href = c.toDataURL('image/png')
    a.download = 'vcard.png'
    a.click()
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <label className="text-sm text-gray-500">姓名<input className="input" value={fn} onChange={(e)=>setFn(e.target.value)} /></label>
        <label className="text-sm text-gray-500">公司<input className="input" value={org} onChange={(e)=>setOrg(e.target.value)} /></label>
        <label className="text-sm text-gray-500">职位<input className="input" value={title} onChange={(e)=>setTitle(e.target.value)} /></label>
        <label className="text-sm text-gray-500">电话<input className="input" value={tel} onChange={(e)=>setTel(e.target.value)} /></label>
        <label className="text-sm text-gray-500">邮箱<input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} /></label>
        <label className="text-sm text-gray-500">网站<input className="input" value={url} onChange={(e)=>setUrl(e.target.value)} /></label>
      </div>
      <div className="flex gap-2">
        <button className="btn" onClick={renderQR}>生成二维码</button>
        <button className="btn" onClick={onCopy}>复制 vCard</button>
        <button className="btn" onClick={onDownload}>下载 PNG</button>
      </div>
      <div>
        <canvas ref={canvasRef} className="border rounded" />
      </div>
      <details>
        <summary className="cursor-pointer text-sm text-gray-500">预览 vCard 文本</summary>
        <pre className="rounded border p-2 bg-gray-50 dark:bg-gray-900/40 whitespace-pre">{vcard}</pre>
      </details>
    </div>
  )
}
