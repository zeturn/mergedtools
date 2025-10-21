import { useMemo, useState } from 'react'
import { XMLParser } from 'fast-xml-parser'
import { Textarea } from '../../components/Input'

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })

export default function Page(){
  const [xml, setXml] = useState('<root><a x="1">ok</a></root>')
  const [pretty, setPretty] = useState(true)

  const result = useMemo(()=>{
    try {
      const obj = parser.parse(xml)
      return { ok: true as const, obj }
    } catch (e: any) {
      return { ok: false as const, error: String(e?.message || e) }
    }
  }, [xml])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">XML 校验</h2>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={pretty} onChange={e=>setPretty(e.target.checked)} />
          美化显示
        </label>
      </div>
      <Textarea variant="simple" className="h-60" value={xml} onChange={e=>setXml(e.target.value)} />
      <div className={"rounded p-3 " + (result.ok ? 'bg-emerald-900/40' : 'bg-rose-900/40')}>
        {result.ok ? (
          <>
            <div className="font-medium text-emerald-300">通过：语法有效</div>
            <pre className="mt-2 font-mono whitespace-pre-wrap overflow-auto text-sm">{pretty ? JSON.stringify(result.obj, null, 2) : JSON.stringify(result.obj)}</pre>
          </>
        ) : (
          <>
            <div className="font-medium text-rose-300">失败：{result.error}</div>
          </>
        )}
      </div>
    </div>
  )
}
