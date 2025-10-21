import { useMemo, useState } from 'react'
import { JSONPath } from 'jsonpath-plus'
import Input from '../../components/Input'

export default function Page() {
  const [txt, setTxt] = useState('{"store":{"book":[{"category":"fiction","price":8.95}]}}')
  const [expr, setExpr] = useState('$.store.book[*].price')
  const out = useMemo(() => {
    try {
      const json = JSON.parse(txt)
      const res = JSONPath({ path: expr, json })
      return JSON.stringify(res, null, 2)
    } catch { return '' }
  }, [txt, expr])
  return (
    <div className="space-y-3">
      <textarea className="w-full h-40 rounded bg-slate-800 p-3 font-mono" value={txt} onChange={(e) => setTxt(e.target.value)} />
      <Input  variant="simple" className="" value={expr} onChange={(e) => setExpr(e.target.value)} />
      <pre className="rounded bg-slate-800 p-3 font-mono whitespace-pre-wrap overflow-auto">{out}</pre>
    </div>
  )
}
