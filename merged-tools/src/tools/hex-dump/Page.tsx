import { useMemo, useRef, useState } from 'react'

function toHexDump(bytes: Uint8Array) {
  const lines: string[] = []
  for (let i = 0; i < bytes.length; i += 16) {
    const chunk = bytes.subarray(i, i + 16)
    const off = i.toString(16).padStart(8, '0')
    const hex = Array.from(chunk, b => b.toString(16).padStart(2, '0')).join(' ')
    const pad = '   '.repeat(16 - chunk.length)
    const ascii = Array.from(chunk, b => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.')).join('')
    lines.push(`${off}  ${hex}${pad}  |${ascii}|`)
  }
  return lines.join('\n')
}

export default function Page() {
  const [text, setText] = useState('Hello, hex dump!')
  const [dump, setDump] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const update = (bytes: Uint8Array) => setDump(toHexDump(bytes))

  const onText = (s: string) => update(new TextEncoder().encode(s))
  const onFile = async (f: File) => update(new Uint8Array(await f.arrayBuffer()))

  useMemo(() => { onText(text) }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <textarea className="textarea h-32" value={text} onChange={(e)=>{ setText(e.target.value); onText(e.target.value) }} />
        <div className="flex items-center gap-2">
          <input type="file" ref={fileRef} onChange={(e)=>{ const f=e.target.files?.[0]; if(f) onFile(f) }} />
        </div>
      </div>
      <pre className="rounded border p-3 overflow-auto bg-gray-50 dark:bg-gray-900/40 whitespace-pre">{dump}</pre>
    </div>
  )
}
