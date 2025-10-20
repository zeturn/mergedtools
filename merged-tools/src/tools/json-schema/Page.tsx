import { useMemo, useState } from 'react'
import Ajv from 'ajv'

const DEFAULT_SCHEMA = `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": { "name": { "type": "string" }, "age": { "type": "integer", "minimum": 0 } },
  "required": ["name"],
  "additionalProperties": false
}`

const DEFAULT_DATA = `{
  "name": "Alice",
  "age": 20
}`

export default function Page() {
  const [schemaText, setSchemaText] = useState(DEFAULT_SCHEMA)
  const [dataText, setDataText] = useState(DEFAULT_DATA)
  const result = useMemo(() => {
    try {
      const schema = JSON.parse(schemaText)
      const data = JSON.parse(dataText)
      const ajv = new Ajv({ allErrors: true, strict: false })
      const validate = ajv.compile(schema)
      const ok = validate(data)
      if (ok) return { ok: true, errors: [] as any[] }
      return { ok: false, errors: validate.errors ?? [] }
    } catch (e: any) {
      return { ok: false, errors: [{ message: e?.message ?? '解析失败' }] }
    }
  }, [schemaText, dataText])

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="text-sm text-slate-400">JSON Schema</div>
        <textarea className="w-full h-64 rounded bg-slate-800 p-3 font-mono" value={schemaText} onChange={(e)=>setSchemaText(e.target.value)} />
      </div>
      <div className="space-y-2">
        <div className="text-sm text-slate-400">JSON 数据</div>
        <textarea className="w-full h-64 rounded bg-slate-800 p-3 font-mono" value={dataText} onChange={(e)=>setDataText(e.target.value)} />
      </div>
      <div className="md:col-span-2">
        <div className={`rounded p-3 ${result.ok ? 'bg-emerald-900/40 ring-emerald-700' : 'bg-rose-900/40 ring-rose-700'} ring-1` }>
          {result.ok ? '✅ 校验通过' : '❌ 校验失败'}
          {!result.ok && (
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
              {result.errors.map((e, i) => (
                <li key={i} className="font-mono">{e.instancePath ? `${e.instancePath} ` : ''}{e.message}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
