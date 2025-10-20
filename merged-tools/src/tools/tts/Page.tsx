import { useEffect, useRef, useState } from 'react'

export default function Page() {
  const [text, setText] = useState('你好，世界！Hello world!')
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voiceURI, setVoiceURI] = useState<string>('')
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    const load = () => setVoices(window.speechSynthesis.getVoices())
    load()
    window.speechSynthesis.onvoiceschanged = load
    return () => { window.speechSynthesis.onvoiceschanged = null as any }
  }, [])

  const speak = () => {
    const u = new SpeechSynthesisUtterance(text)
    const v = voices.find(v => v.voiceURI === voiceURI) || voices[0]
    if (v) u.voice = v
    u.rate = rate
    u.pitch = pitch
    utterRef.current = u
    speechSynthesis.cancel()
    speechSynthesis.speak(u)
  }
  const pause = () => speechSynthesis.pause()
  const resume = () => speechSynthesis.resume()
  const stop = () => speechSynthesis.cancel()

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-2">
        <label className="flex items-center gap-2 text-sm text-gray-500">语音
          <select className="select flex-1" value={voiceURI} onChange={(e)=>setVoiceURI(e.target.value)}>
            {voices.map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-500">速率
          <input className="input" type="range" min={0.5} max={2} step={0.1} value={rate} onChange={(e)=>setRate(Number(e.target.value))} />
          <span>{rate.toFixed(1)}</span>
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-500">音调
          <input className="input" type="range" min={0} max={2} step={0.1} value={pitch} onChange={(e)=>setPitch(Number(e.target.value))} />
          <span>{pitch.toFixed(1)}</span>
        </label>
      </div>
      <textarea className="textarea h-40" value={text} onChange={(e)=>setText(e.target.value)} />
      <div className="flex gap-2">
        <button className="btn" onClick={speak}>播放</button>
        <button className="btn" onClick={pause}>暂停</button>
        <button className="btn" onClick={resume}>继续</button>
        <button className="btn" onClick={stop}>停止</button>
      </div>
      <div className="text-xs text-gray-500">注意：不同浏览器/系统的可用语音不同，导出音频需要使用系统录音或虚拟声卡方案。</div>
    </div>
  )
}
