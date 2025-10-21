import { useMemo, useState } from 'react'
import { Input, Textarea } from '../../components/Input'

function slugify(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
}

export default function Page() {
  const [md, setMd] = useState('# Title\n\n## Section 1\n\n### Sub 1\n\n## Section 2')
  const [minLevel, setMinLevel] = useState(2)
  const [maxLevel, setMaxLevel] = useState(4)

  const toc = useMemo(() => {
    const lines = md.split(/\r?\n/)
    const items: {level: number, text: string, slug: string}[] = []
    for (const line of lines) {
      const m = line.match(/^(#{1,6})\s+(.*)$/)
      if (m) {
        const level = m[1].length
        const text = m[2].trim()
        if (level >= minLevel && level <= maxLevel) items.push({ level, text, slug: slugify(text) })
      }
    }
    return items.map(i => `${'  '.repeat(i.level - minLevel)}- [${i.text}](#${i.slug})`).join('\n')
  }, [md, minLevel, maxLevel])

  const onCopy = async () => { await navigator.clipboard.writeText(toc); alert('已复制 TOC') }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-2">
        <Textarea variant="simple" className="h-40" value={md} onChange={(e)=>setMd(e.target.value)} />
        <div className="space-y-2">
          <label className="text-sm text-gray-500">最小级别<Input  variant="simple" type="number" min={1} max={6} value={minLevel} onChange={(e)=>setMinLevel(Number(e.target.value))} /></label>
          <label className="text-sm text-gray-500">最大级别<Input  variant="simple" type="number" min={1} max={6} value={maxLevel} onChange={(e)=>setMaxLevel(Number(e.target.value))} /></label>
          <button className="btn" onClick={onCopy}>复制 TOC</button>
        </div>
        <Textarea variant="simple" className="h-40" value={toc} readOnly />
      </div>
    </div>
  )
}
