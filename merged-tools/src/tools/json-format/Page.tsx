import { useState } from 'react'
import { Textarea } from '../../components/Input'

export default function Page(){
  const [src, setSrc] = useState('{"foo":1,"bar":[2,3]}')
  const [out, setOut] = useState('')
  function pretty(){ try{ setOut(JSON.stringify(JSON.parse(src), null, 2)) }catch(e:any){ setOut('错误：'+(e?.message||'')) } }
  function minify(){ try{ setOut(JSON.stringify(JSON.parse(src))) }catch(e:any){ setOut('错误：'+(e?.message||'')) } }
  return (
    <div className="space-y-3">
      <Textarea variant="simple" className="h-48" value={src} onChange={(e)=>setSrc(e.target.value)} />
      <div className="flex gap-2">
        <button className="btn" onClick={pretty}>格式化</button>
        <button className="btn" onClick={minify}>压缩</button>
      </div>
      <Textarea variant="simple" className="h-48" value={out} readOnly />
    </div>
  )
}
