import { useMemo, useRef, useState } from 'react'

type Font = {
  hardblank: string
  height: number
  commentLines: number
  chars: Record<number, string[]>
}

function parseFLF(text: string): Font {
  const lines = text.split(/\r?\n/)
  const header = lines[0]
  const m = header.match(/^flf2a(.)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/)
  if (!m) throw new Error('无效的 FIGlet 头部')
  const hardblank = m[1]
  const height = parseInt(m[2], 10)
  const commentLines = parseInt(m[5], 10)
  const map: Record<number, string[]> = {}
  let idx = 1 + commentLines
  // 标准 ASCII 32..126
  for (let code = 32; code <= 126; code++) {
    const glyph: string[] = []
    for (let i = 0; i < height; i++) {
      let line = lines[idx++] ?? ''
      // 去除行尾结束标记（通常为 '@'，但也可能是其他字符；取最后一个字符作为终止符）
      const end = line[line.length - 1]
      line = line.replace(new RegExp(`${end}{1,}$`), '')
      glyph.push(line)
    }
    map[code] = glyph
  }
  return { hardblank, height, commentLines, chars: map }
}

function renderFiglet(text: string, font: Font): string {
  const lines = Array.from({ length: font.height }, () => '')
  for (const ch of text) {
    const code = ch.charCodeAt(0)
    const glyph = font.chars[code]
    if (!glyph) {
      // 退化：将字符直接拼到第一行，其余补空格
      lines[0] += ch
      for (let i = 1; i < font.height; i++) lines[i] += ' '
      continue
    }
    for (let i = 0; i < font.height; i++) {
      let row = glyph[i] || ''
      row = row.replace(new RegExp(`\\${font.hardblank}`, 'g'), ' ')
      lines[i] += row
    }
  }
  return lines.join('\n')
}

export default function Page() {
  const [text, setText] = useState('Hello')
  const [font, setFont] = useState<Font | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const out = useMemo(() => {
    if (!font) return ''
    try { return renderFiglet(text, font) } catch { return '' }
  }, [text, font])

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    try {
      const txt = await f.text()
      setFont(parseFLF(txt))
      e.target.value = ''
    } catch (err) {
      alert('解析 .flf 失败：' + (err as any)?.message)
    }
  }

  const onCopy = async () => {
    await navigator.clipboard.writeText(out)
    alert('已复制')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input className="input" value={text} onChange={(e)=>setText(e.target.value)} />
        <input type="file" accept=".flf,text/plain" ref={fileRef} onChange={onUpload} />
        <button className="btn" onClick={onCopy} disabled={!out}>复制</button>
      </div>
      {!font && <div className="text-sm text-gray-500">请上传 .flf 字体文件（FIGlet Font）。</div>}
      <pre className="rounded border p-3 overflow-auto bg-gray-50 dark:bg-gray-900/40 whitespace-pre">
{out}
      </pre>
    </div>
  )
}
