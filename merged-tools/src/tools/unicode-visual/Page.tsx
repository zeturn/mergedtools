import { useMemo, useState } from 'react'

function codepointInfo(ch: string) {
  const cp = ch.codePointAt(0) ?? 0
  return { ch, dec: cp, hex: cp.toString(16).toUpperCase().padStart(4, '0'), nfc: ch.normalize('NFC'), nfd: ch.normalize('NFD') }
}

export default function Page() {
  const [text, setText] = useState('Hello 世界')
  const rows = useMemo(() => Array.from(text).map(codepointInfo), [text])

  return (
    <div className="space-y-4">
      <textarea className="textarea h-32" value={text} onChange={(e)=>setText(e.target.value)} />
      <div className="overflow-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800"><tr><th className="p-2">字符</th><th>十进制</th><th>十六进制</th><th>NFC</th><th>NFD</th></tr></thead>
          <tbody>
            {rows.map((r,i)=> (
              <tr key={i} className="odd:bg-white dark:odd:bg-gray-900/40"><td className="p-2 font-mono">{r.ch}</td><td className="p-2">{r.dec}</td><td className="p-2">U+{r.hex}</td><td className="p-2">{r.nfc}</td><td className="p-2">{r.nfd}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
