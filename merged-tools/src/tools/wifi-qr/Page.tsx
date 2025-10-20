import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

type Enc = 'WPA' | 'WEP' | 'nopass'

export default function Page(){
  const [ssid, setSsid] = useState('MyWiFi')
  const [enc, setEnc] = useState<Enc>('WPA')
  const [pwd, setPwd] = useState('password1234')
  const [hidden, setHidden] = useState(false)
  const canvas = useRef<HTMLCanvasElement>(null)

  const text = wifiString({ ssid, enc, pwd, hidden })

  useEffect(()=>{ generate() }, [ssid, enc, pwd, hidden])

  async function generate(){
    if (!canvas.current) return
    await QRCode.toCanvas(canvas.current, text, { width: 256 })
  }

  function download(){
    const c = canvas.current; if(!c) return
    c.toBlob(b=>{ if(!b) return; const url = URL.createObjectURL(b); const a = document.createElement('a'); a.href = url; a.download = 'wifi-qr.png'; a.click(); URL.revokeObjectURL(url) })
  }

  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3 items-end">
        <label className="text-sm text-slate-400">SSID<input className="w-full bg-slate-800 rounded p-2" value={ssid} onChange={(e)=>setSsid(e.target.value)} /></label>
        <label className="text-sm text-slate-400">加密
          <select className="w-full bg-slate-800 rounded p-2" value={enc} onChange={(e)=>setEnc(e.target.value as Enc)}>
            <option value="WPA">WPA/WPA2/WPA3</option>
            <option value="WEP">WEP</option>
            <option value="nopass">无密码</option>
          </select>
        </label>
        <label className="text-sm text-slate-400">密码<input className="w-full bg-slate-800 rounded p-2" value={pwd} onChange={(e)=>setPwd(e.target.value)} disabled={enc==='nopass'} /></label>
        <label className="text-sm text-slate-400 flex items-center gap-2"><input type="checkbox" checked={hidden} onChange={(e)=>setHidden(e.target.checked)} />隐藏网络</label>
      </div>
      <div className="flex items-center gap-3">
        <canvas ref={canvas} className="bg-white rounded" width={256} height={256} />
        <div className="space-y-2">
          <div className="text-xs text-slate-400 break-all">{text}</div>
          <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={download}>下载 PNG</button>
        </div>
      </div>
  <p className="text-xs text-slate-400">格式示例：WIFI:T:&lt;enc&gt;;S:&lt;ssid&gt;;P:&lt;password&gt;;H:&lt;hidden&gt;; 其中特殊字符需转义。</p>
    </div>
  )
}

function esc(s: string){
  return s.replace(/([\\\\;,:\"])|[\n\r]/g, (m)=> m.length===1? ('\\'+m): '' )
}

function wifiString({ ssid, enc, pwd, hidden }: { ssid: string; enc: Enc; pwd: string; hidden: boolean }){
  const T = enc
  const S = esc(ssid)
  const P = enc==='nopass' ? '' : esc(pwd)
  const H = hidden ? 'true' : ''
  return `WIFI:T:${T};S:${S};${enc!=='nopass'?`P:${P};`:''}${hidden?`H:${H};`:''};`
}
