import { useMemo, useRef, useState } from 'react'

const MAP: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  '0': '-----','1': '.----','2': '..---','3': '...--','4': '....-','5': '.....','6': '-....','7': '--...','8': '---..','9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/',
}
const REV: Record<string, string> = Object.fromEntries(Object.entries(MAP).map(([k, v]) => [v, k]))

function encode(s: string) {
  return s
    .split('')
    .map(ch => MAP[ch.toUpperCase()] || '')
    .filter(Boolean)
    .join(' ')
}
function decode(morse: string) {
  return morse
    .trim()
    .split(/\s+/)
    .map(code => REV[code] || '')
    .join('')
    .replace(/\/{1}/g, ' ')
}

export default function Page() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [text, setText] = useState('SOS We need help!')
  const [unit, setUnit] = useState(100) // 毫秒
  const acRef = useRef<AudioContext | null>(null)

  const out = useMemo(() => (mode === 'encode' ? encode(text) : decode(text)), [mode, text])

  const play = async () => {
    if (mode === 'decode') return
    const ac = acRef.current || new (window.AudioContext || (window as any).webkitAudioContext)()
    acRef.current = ac
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.type = 'sine'
    osc.frequency.value = 600
    gain.gain.value = 0
    osc.connect(gain).connect(ac.destination)
    osc.start()
    const start = ac.currentTime
    let t = start
    const on = (dur: number) => { gain.gain.setValueAtTime(0.2, t); t += dur; gain.gain.setValueAtTime(0, t) }
    const off = (dur: number) => { t += dur }
    const u = unit / 1000
    const seq = out.split('')
    for (let i = 0; i < seq.length; i++) {
      const c = seq[i]
      if (c === '.') { on(1 * u); off(1 * u) }
      else if (c === '-') { on(3 * u); off(1 * u) }
      else if (c === ' ') { off(2 * u) } // 之前已留 1u 间隔，总计字母间隔 3u
      else if (c === '/') { off(6 * u) } // 之前已留 1u 间隔，总计词间隔 7u
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <select className="select" value={mode} onChange={(e)=>setMode(e.target.value as any)}>
          <option value="encode">文本 → 摩斯</option>
          <option value="decode">摩斯 → 文本</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-500">单位(ms)
          <input className="input w-24" type="number" min={20} max={1000} value={unit} onChange={(e)=>setUnit(Math.max(20, Math.min(1000, Number(e.target.value)||100)))} />
        </label>
        {mode === 'encode' && <button className="btn" onClick={play}>播放</button>}
      </div>
      <textarea className="textarea h-40" value={text} onChange={(e)=>setText(e.target.value)} placeholder={mode==='encode'? '输入要编码的文本' : '输入 . 和 -，单词间用 /，字符间用空格'} />
      <textarea className="textarea h-40" value={out} readOnly />
    </div>
  )
}
