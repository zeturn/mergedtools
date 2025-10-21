import { useMemo, useState } from 'react'
import { Textarea } from '../../components/Input'

function toNumeronym(word: string) {
  if (word.length <= 3) return word
  return word[0] + String(word.length - 2) + word[word.length - 1]
}

export default function Page() {
  const [text, setText] = useState('internationalization\naccessibility\nlocalization')
  const out = useMemo(() => text.split(/\r?\n/).map(w => toNumeronym(w.trim())).join('\n'), [text])
  return (
    <div className="space-y-4">
      <Textarea variant="simple" className="h-40" value={text} onChange={(e)=>setText(e.target.value)} />
      <Textarea variant="simple" className="h-40" value={out} readOnly />
    </div>
  )
}
