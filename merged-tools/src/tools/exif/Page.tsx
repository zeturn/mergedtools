import { useState } from 'react'
import * as exifr from 'exifr'

export default function Page() {
  const [out, setOut] = useState('')
  return (
    <div className="space-y-3">
      <input type="file" accept="image/*" onChange={async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        try {
          const arr = await file.arrayBuffer()
          const data = await exifr.parse(arr)
          setOut(JSON.stringify(data, null, 2) || '无 EXIF 信息')
        } catch (err: any) {
          setOut(`读取失败: ${err?.message ?? '未知错误'}`)
        }
      }} />
      <pre className="rounded bg-slate-800 p-3 font-mono whitespace-pre-wrap overflow-auto h-80">{out}</pre>
    </div>
  )
}
