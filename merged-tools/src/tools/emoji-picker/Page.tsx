import { useMemo, useState } from 'react'
import Input from '../../components/Input'

const EMOJIS = [
  { ch: '😀', n: 'grinning' }, { ch: '😁', n: 'beaming' }, { ch: '😂', n: 'joy' }, { ch: '🤣', n: 'rofl' },
  { ch: '😊', n: 'smile' }, { ch: '😍', n: 'heart eyes' }, { ch: '😘', n: 'kiss' }, { ch: '😎', n: 'cool' },
  { ch: '🤔', n: 'thinking' }, { ch: '😴', n: 'sleep' }, { ch: '😭', n: 'cry' }, { ch: '😡', n: 'angry' },
  { ch: '👍', n: 'thumbs up' }, { ch: '👎', n: 'thumbs down' }, { ch: '🙏', n: 'pray' }, { ch: '👏', n: 'clap' },
  { ch: '🔥', n: 'fire' }, { ch: '💯', n: '100' }, { ch: '✨', n: 'sparkles' }, { ch: '🎉', n: 'party' },
  { ch: '❤️', n: 'heart' }, { ch: '🧡', n: 'orange heart' }, { ch: '💛', n: 'yellow heart' }, { ch: '💚', n: 'green heart' },
  { ch: '💙', n: 'blue heart' }, { ch: '💜', n: 'purple heart' }, { ch: '🖤', n: 'black heart' }, { ch: '🤍', n: 'white heart' },
  { ch: '🚀', n: 'rocket' }, { ch: '💡', n: 'idea' }, { ch: '📎', n: 'paperclip' }, { ch: '✅', n: 'check' },
]

export default function Page() {
  const [q, setQ] = useState('')
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return EMOJIS
    return EMOJIS.filter(e => e.n.includes(s))
  }, [q])

  const onCopy = async (ch: string) => {
    await navigator.clipboard.writeText(ch)
    // 轻提示
  }

  return (
    <div className="space-y-4">
      <Input  variant="simple" placeholder="搜索名称（英文）" value={q} onChange={(e)=>setQ(e.target.value)} />
      <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-2">
        {filtered.map((e, i) => (
          <button key={i} className="h-12 rounded border flex items-center justify-center text-2xl hover:bg-gray-100 dark:hover:bg-gray-800" onClick={()=>onCopy(e.ch)} title={e.n}>
            {e.ch}
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-500">点击复制到剪贴板。</div>
    </div>
  )
}
