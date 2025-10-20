import { useState } from 'react'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })
const prettyBuilder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: '@_', format: true, suppressEmptyNode: false })
const minBuilder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: '@_', format: false, suppressEmptyNode: false })

export default function Page(){
  const [src, setSrc] = useState('<root><a x="1">hi</a><b/></root>')
  const [out, setOut] = useState('')
  function pretty(){ try{ const obj = parser.parse(src); setOut(prettyBuilder.build(obj)) }catch(e:any){ setOut('错误：'+(e?.message||'')) } }
  function minify(){ try{ const obj = parser.parse(src); setOut(minBuilder.build(obj)) }catch(e:any){ setOut('错误：'+(e?.message||'')) } }
  return (
    <div className="space-y-3">
      <textarea className="textarea h-48" value={src} onChange={(e)=>setSrc(e.target.value)} />
      <div className="flex gap-2">
        <button className="btn" onClick={pretty}>格式化</button>
        <button className="btn" onClick={minify}>压缩</button>
      </div>
      <textarea className="textarea h-48" value={out} readOnly />
    </div>
  )
}
