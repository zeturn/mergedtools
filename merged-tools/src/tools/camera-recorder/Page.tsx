import { useEffect, useRef, useState } from 'react'

export default function Page(){
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRef = useRef<MediaStream|null>(null)
  const recRef = useRef<MediaRecorder|null>(null)
  const chunks = useRef<BlobPart[]>([])
  const [recording, setRecording] = useState(false)
  const [blobUrl, setBlobUrl] = useState<string|undefined>()

  async function start(){
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    mediaRef.current = stream
    if(videoRef.current){ videoRef.current.srcObject = stream; await videoRef.current.play() }
    const type = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')? 'video/webm;codecs=vp9' : 'video/webm'
    const rec = new MediaRecorder(stream, { mimeType: type })
    recRef.current = rec
    chunks.current = []
    rec.ondataavailable = e=> { if(e.data.size>0) chunks.current.push(e.data) }
    rec.onstop = ()=>{
      const blob = new Blob(chunks.current, { type })
      const url = URL.createObjectURL(blob)
      setBlobUrl(url)
    }
    rec.start()
    setRecording(true)
  }
  function stop(){
    recRef.current?.stop()
    mediaRef.current?.getTracks().forEach(t=>t.stop())
    setRecording(false)
  }
  useEffect(()=>()=>{ // cleanup
    mediaRef.current?.getTracks().forEach(t=>t.stop())
  },[])
  return (
    <div className="space-y-3">
      <video ref={videoRef} className="w-full rounded bg-black" playsInline muted></video>
      <div className="flex gap-2">
        {!recording ? <button className="btn" onClick={start}>开始录制</button> : <button className="btn" onClick={stop}>停止</button>}
        {blobUrl && <a href={blobUrl} download={`recording.webm`} className="btn">下载</a>}
      </div>
      <div className="text-xs text-gray-500">需要浏览器权限。部分浏览器可能只支持 WebM 导出。</div>
    </div>
  )
}
