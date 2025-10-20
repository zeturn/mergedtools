import { useEffect, useState } from 'react'

export default function Page(){
  const [info, setInfo] = useState<any>({})

  useEffect(()=>{
    (async ()=>{
      const nav = navigator as any
      const mem = (nav.deviceMemory??'')
      const hc = (nav.hardwareConcurrency??'')
      const langs = nav.languages||[]
      const perms = await getPermissions()
      const media = await getMedia()
      setInfo({
        userAgent: nav.userAgent,
        platform: nav.platform,
        vendor: nav.vendor,
        language: nav.language,
        languages: langs,
        deviceMemory: mem,
        hardwareConcurrency: hc,
        screen: { w: screen.width, h: screen.height, pixelRatio: devicePixelRatio },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        online: navigator.onLine,
        permissions: perms,
        media: media,
      })
    })()
  }, [])

  function copy(){
    navigator.clipboard.writeText(JSON.stringify(info, null, 2))
  }

  return (
    <div className="space-y-3">
      <pre className="bg-slate-900 p-3 rounded overflow-auto text-sm"><code>{JSON.stringify(info, null, 2)}</code></pre>
      <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={copy}>复制 JSON</button>
    </div>
  )
}

async function getPermissions(){
  const names = ['geolocation','notifications','camera','microphone','clipboard-read','clipboard-write']
  const out: Record<string,string> = {}
  for (const n of names){
    try{
      // @ts-ignore
      const s = await (navigator.permissions?.query({ name: n }))
      out[n] = s?.state||'unknown'
    }catch{ out[n]='unknown' }
  }
  return out
}

async function getMedia(){
  try{
    const devices = await navigator.mediaDevices?.enumerateDevices()
    return devices?.map(d=> ({ kind: d.kind, label: d.label }))
  }catch{ return [] }
}
