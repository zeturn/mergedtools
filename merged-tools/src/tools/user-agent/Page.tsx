import { useEffect, useMemo, useState } from 'react'
import { Textarea } from '../../components/Input'

type UAInfo = {
  browser: { name: string, version?: string },
  engine: { name: string, version?: string },
  os: { name: string, version?: string },
  device: { type: 'desktop'|'mobile'|'tablet'|'bot'|'unknown', model?: string },
}

function parseUA(ua: string): UAInfo{
  const info: UAInfo = { browser: { name: 'Unknown' }, engine: { name: 'Unknown' }, os: { name: 'Unknown' }, device: { type: 'unknown' } }
  // Engine
  const eng = /(AppleWebKit)\/(\S+)|\b(Gecko)\/(\S+)|\b(EdgeHTML)\/(\S+)/i.exec(ua)
  if(eng){
    const name = (eng[1]||eng[3]||eng[5])!
    const version = (eng[2]||eng[4]||eng[6])!
    info.engine = { name, version }
  } else if(/Trident\//.test(ua)) info.engine = { name: 'Trident' }
  // Browser
  const bRegs = [
    /(EdgA?)\/(\S+)/, // Edge/Edga
    /(Chrome)\/(\S+)/,
    /(Safari)\/(\S+)/,
    /(Firefox)\/(\S+)/,
    /(Opera|OPR)\/(\S+)/,
    /(MSIE) (\S+)/,
    /(Trident)\/.*rv:(\S+)/,
  ]
  for(const r of bRegs){
    const m = r.exec(ua)
    if(m){
      let name = m[1]
      if(name==='OPR') name='Opera'
      if(name==='Trident') name='IE'
      const version = m[2]
      info.browser = { name, version }
      break
    }
  }
  // OS
  const osRegs = [
    /(Windows NT) (\d+\.\d+)/,
    /(Android) (\d+[\d\.]*)/,
    /(iPhone|iPad|iPod).*?OS (\d+[\_\d]*)/,
    /(Mac OS X) (\d+[\_\d]*)/,
    /(Linux)/,
  ]
  for(const r of osRegs){
    const m = r.exec(ua)
    if(m){
      const name = m[1].replace(/_/g,'.')
      const version = (m[2]||'').replace(/_/g,'.')||undefined
      info.os = { name, version }
      break
    }
  }
  // Device type
  if(/Mobile|iPhone|Android/.test(ua)) info.device.type = 'mobile'
  else if(/iPad|Tablet/.test(ua)) info.device.type = 'tablet'
  else if(/bot|crawler|spider|bingpreview/i.test(ua)) info.device.type = 'bot'
  else info.device.type = 'desktop'
  return info
}

export default function Page(){
  const [ua, setUa] = useState(navigator.userAgent)
  const info = useMemo(()=>parseUA(ua),[ua])
  useEffect(()=>{ setUa(navigator.userAgent) },[])
  return (
    <div className="space-y-3">
      <Textarea variant="simple" className="h-28" value={ua} onChange={e=>setUa(e.target.value)} />
      <div className="grid md:grid-cols-2 gap-3 text-sm">
        <div className="card p-3">
          <div className="font-medium">浏览器</div>
          <div>{info.browser.name} {info.browser.version}</div>
        </div>
        <div className="card p-3">
          <div className="font-medium">引擎</div>
          <div>{info.engine.name} {info.engine.version}</div>
        </div>
        <div className="card p-3">
          <div className="font-medium">操作系统</div>
          <div>{info.os.name} {info.os.version}</div>
        </div>
        <div className="card p-3">
          <div className="font-medium">设备</div>
          <div>{info.device.type}</div>
        </div>
      </div>
      <div className="text-xs text-gray-500">提示：该解析器为轻量正则启发式实现，结果为近似识别，可能与专业库有差异。</div>
    </div>
  )
}
