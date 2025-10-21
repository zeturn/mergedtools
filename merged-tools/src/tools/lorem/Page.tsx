import { useMemo, useState } from 'react'
import { Textarea } from '../../components/Input'

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'.split(' ')

function makeWords(n: number) {
  const out: string[] = []
  for (let i = 0; i < n; i++) out.push(WORDS[i % WORDS.length])
  return out
}

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }

export default function Page() {
  const [mode, setMode] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs')
  const [count, setCount] = useState(3)

  const text = useMemo(() => {
    if (mode === 'words') return makeWords(count).join(' ')
    if (mode === 'sentences') {
      const s: string[] = []
      for (let i = 0; i < count; i++) {
        const len = 8 + (i % 6)
        const words = makeWords(len)
        s.push(capitalize(words.join(' ')) + '.')
      }
      return s.join(' ')
    }
    // paragraphs
    const p: string[] = []
    for (let i = 0; i < count; i++) {
      const sentences: string[] = []
      for (let j = 0; j < 3 + (i % 3); j++) {
        const len = 8 + ((i + j) % 6)
        const words = makeWords(len)
        sentences.push(capitalize(words.join(' ')) + '.')
      }
      p.push(sentences.join(' '))
    }
    return p.join('\n\n')
  }, [mode, count])

  const onCopy = async () => {
    await navigator.clipboard.writeText(text)
    alert('已复制')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select className="select" value={mode} onChange={(e)=>setMode(e.target.value as any)}>
          <option value="paragraphs">段落</option>
          <option value="sentences">句子</option>
          <option value="words">单词</option>
        </select>
        <input type="number" className="input w-28" min={1} max={1000} value={count} onChange={(e)=>setCount(Math.max(1, Math.min(1000, Number(e.target.value))))} />
        <button className="btn" onClick={onCopy}>复制</button>
      </div>
      <Textarea variant="simple" className="h-64" value={text} readOnly />
    </div>
  )
}
