import { useMemo, useState } from 'react'

const LOOKS_LIKE: Record<string, string> = {
  A: 'Α', a: 'ɑ', B: 'Β', E: 'Ε', e: 'ｅ', H: 'Η', I: 'Ι', i: 'і', K: 'Κ', M: 'Μ', N: 'Ν', O: 'Ο', o: 'ο', P: 'Ρ', T: 'Τ', X: 'Χ', Y: 'Υ',
}

function replaceSimilar(s: string) {
  return s.split('').map(ch => LOOKS_LIKE[ch] ?? ch).join('')
}

function reverseStr(s: string) { return s.split('').reverse().join('') }

function insertRandom(s: string, seed = 1) {
  let out = ''
  let r = seed >>> 0
  const rand = () => (r = (r * 1664525 + 1013904223) >>> 0)
  for (const ch of s) {
    out += ch
    if ((rand() & 3) === 0) out += String.fromCharCode(0x200b + (rand() % 5)) // 零宽字符
  }
  return out
}

export default function Page() {
  const [src, setSrc] = useState('example@example.com')
  const [mode, setMode] = useState<'similar' | 'reverse' | 'insert'>('similar')
  const [seed, setSeed] = useState(1)

  const dst = useMemo(() => {
    if (mode === 'similar') return replaceSimilar(src)
    if (mode === 'reverse') return reverseStr(src)
    return insertRandom(src, seed)
  }, [src, mode, seed])

  return (
    <div className="space-y-4">
      <textarea className="textarea h-28" value={src} onChange={(e)=>setSrc(e.target.value)} />
      <div className="flex flex-wrap items-center gap-2">
        <select className="select" value={mode} onChange={(e)=>setMode(e.target.value as any)}>
          <option value="similar">相似字符替换</option>
          <option value="reverse">倒序</option>
          <option value="insert">随机插入零宽字符</option>
        </select>
        {mode === 'insert' && (
          <label className="flex items-center gap-2 text-sm text-gray-500">seed<input className="input w-24" type="number" value={seed} onChange={(e)=>setSeed(Number(e.target.value)||0)} /></label>
        )}
      </div>
      <textarea className="textarea h-28" value={dst} readOnly />
      <div className="text-xs text-gray-500">注意：仅用于弱混淆展示，不提供安全性。</div>
    </div>
  )
}
