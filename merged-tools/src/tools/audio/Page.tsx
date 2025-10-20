import { useEffect, useRef, useState } from 'react'

export default function Page(){
  const [ctx, setCtx] = useState<AudioContext|null>(null)
  const [buf, setBuf] = useState<AudioBuffer|null>(null)
  const canvasWave = useRef<HTMLCanvasElement>(null)
  const canvasSpec = useRef<HTMLCanvasElement>(null)
  const analyserRef = useRef<AnalyserNode|null>(null)
  const sourceRef = useRef<AudioBufferSourceNode|null>(null)

  useEffect(()=>{ setCtx(new AudioContext()) }, [])

  async function loadFile(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0]; if (!f || !ctx) return
    const arr = await f.arrayBuffer()
    const audio = await ctx.decodeAudioData(arr.slice(0))
    setBuf(audio)
    drawWave(audio)
  }

  function play(){
    if (!ctx || !buf) return
    stop()
    const src = ctx.createBufferSource(); src.buffer = buf
    const an = ctx.createAnalyser(); an.fftSize = 2048
    src.connect(an); an.connect(ctx.destination)
    analyserRef.current = an; sourceRef.current = src
    src.start()
    raf()
  }

  function stop(){
    sourceRef.current?.stop(); sourceRef.current = null
  }

  function raf(){
    const an = analyserRef.current; if (!an) return
    drawSpectrum(an)
    requestAnimationFrame(raf)
  }

  function drawWave(audio: AudioBuffer){
    const c = canvasWave.current; if (!c) return
    c.width = c.clientWidth * devicePixelRatio; c.height = 200 * devicePixelRatio
    const ctx2 = c.getContext('2d')!
    ctx2.clearRect(0,0,c.width,c.height)
    ctx2.strokeStyle = '#22d3ee'; ctx2.lineWidth = 1
    const data = audio.getChannelData(0)
    const step = Math.ceil(data.length / c.width)
    const amp = c.height/2
    ctx2.beginPath(); ctx2.moveTo(0, amp)
    for (let x=0; x<c.width; x++){
      const start = x*step; let min=1, max=-1
      for (let i=start; i<start+step && i<data.length; i++){ const v = data[i]; if (v<min) min=v; if (v>max) max=v }
      ctx2.lineTo(x, (1+min)*amp)
      ctx2.lineTo(x, (1+max)*amp)
    }
    ctx2.stroke()
  }

  function drawSpectrum(an: AnalyserNode){
    const c = canvasSpec.current; if (!c) return
    c.width = c.clientWidth * devicePixelRatio; c.height = 200 * devicePixelRatio
    const ctx2 = c.getContext('2d')!
    const arr = new Uint8Array(an.frequencyBinCount)
    an.getByteFrequencyData(arr)
    ctx2.clearRect(0,0,c.width,c.height)
    ctx2.fillStyle = '#60a5fa'
    const barW = c.width / arr.length
    for (let i=0;i<arr.length;i++){
      const v = arr[i]/255 * c.height
      ctx2.fillRect(i*barW, c.height - v, barW*0.9, v)
    }
  }

  function exportWav(){
    if (!buf) return
    const wav = audioBufferToWav(buf)
    const blob = new Blob([wav], { type: 'audio/wav' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href=url; a.download='audio.wav'; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-3">
      <input type="file" accept="audio/*" onChange={loadFile} />
      <div className="flex gap-2">
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={play} disabled={!buf}>播放</button>
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={stop}>停止</button>
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={exportWav} disabled={!buf}>导出 WAV</button>
      </div>
      <div className="space-y-2">
        <div className="text-sm text-slate-400">波形</div>
        <canvas ref={canvasWave} className="w-full h-[200px] bg-slate-900 rounded" />
        <div className="text-sm text-slate-400">频谱</div>
        <canvas ref={canvasSpec} className="w-full h-[200px] bg-slate-900 rounded" />
      </div>
      <p className="text-xs text-slate-400">说明：仅在浏览器本地处理音频，不会上传；导出的 WAV 为 PCM 16-bit.</p>
    </div>
  )
}

function audioBufferToWav(buffer: AudioBuffer){
  const numOfChan = buffer.numberOfChannels
  const length = buffer.length * numOfChan * 2 + 44
  const out = new ArrayBuffer(length)
  const view = new DataView(out)

  writeStr(view, 0, 'RIFF')
  view.setUint32(4, 36 + buffer.length * numOfChan * 2, true)
  writeStr(view, 8, 'WAVE')
  writeStr(view, 12, 'fmt ')
  view.setUint32(16, 16, true) // PCM
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, numOfChan, true)
  view.setUint32(24, buffer.sampleRate, true)
  view.setUint32(28, buffer.sampleRate * numOfChan * 2, true)
  view.setUint16(32, numOfChan * 2, true)
  view.setUint16(34, 16, true) // bits
  writeStr(view, 36, 'data')
  view.setUint32(40, buffer.length * numOfChan * 2, true)

  let offset = 44
  for (let ch=0; ch<numOfChan; ch++){
    const data = buffer.getChannelData(ch)
    for (let i=0;i<data.length;i++){
      let s = Math.max(-1, Math.min(1, data[i]))
      view.setInt16(offset, s<0 ? s*0x8000 : s*0x7FFF, true)
      offset+=2
    }
  }
  return out
}

function writeStr(view: DataView, offset: number, str: string){
  for (let i=0;i<str.length;i++) view.setUint8(offset+i, str.charCodeAt(i))
}
