import { useMemo, useState } from 'react'

export default function Page(){
  const [file, setFile] = useState<File | null>(null)
  const [raw, setRaw] = useState<string>('')
  const [result, setResult] = useState<string>('')

  const hints = useMemo(()=>{
    if (!raw) return [] as string[]
    const marks = [
      '/Sig', '/SIG', '/sig', '/AcroForm', '/Fields', '/V ', '/ByteRange', '/Contents', '/SubFilter', '/adbe.pkcs7.detached', '/adbe.pkcs7.sha1'
    ]
    return marks.filter(m => raw.includes(m))
  }, [raw])

  async function onPick(f?: File){
    const ff = f ?? (document.getElementById('pdf-file') as HTMLInputElement)?.files?.[0]
    if (!ff) return
    setFile(ff)
    const buf = await ff.arrayBuffer()
    const txt = new TextDecoder('latin1').decode(new Uint8Array(buf))
    setRaw(txt)
    const found = [/\/Sig\b/, /\/ByteRange\b/, /\/Contents\b/].every(rx => rx.test(txt))
    setResult(found ? '可能包含签名(需专业工具进一步验证)' : '未检测到签名标记(不排除假阴性)')
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <input id="pdf-file" type="file" accept="application/pdf" onChange={e=>onPick(e.target.files?.[0] || undefined)} />
        {file && <div className="text-sm text-slate-300">文件：{file.name}（{Math.round(file.size/1024)} KB）</div>}
      </div>
      <div className="rounded p-3 bg-slate-800">
        <div className="font-semibold mb-2">检测结论</div>
        <div>{result || '请选择 PDF 文件'}</div>
      </div>
      {!!hints.length && (
        <div className="rounded p-3 bg-slate-800">
          <div className="font-semibold mb-2">命中标记({hints.length})</div>
          <div className="text-sm break-words">{hints.join(', ')}</div>
        </div>
      )}
    </div>
  )
}
