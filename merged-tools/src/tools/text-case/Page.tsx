import { useMemo, useState } from 'react'
import Input from '../../components/Input'

function words(s: string) {
  return s.trim().split(/[^A-Za-z0-9]+/).filter(Boolean)
}
function titleCase(s: string) {
  return words(s).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ')
}
function snakeCase(s: string) {
  return words(s).map(w => w.toLowerCase()).join('_')
}
function kebabCase(s: string) {
  return words(s).map(w => w.toLowerCase()).join('-')
}
function camelCase(s: string) {
  const ws = words(s).map(w => w.toLowerCase())
  return ws[0] ? ws[0] + ws.slice(1).map(w => w[0].toUpperCase() + w.slice(1)).join('') : ''
}

export default function Page() {
  const [txt, setTxt] = useState('hello world_example-Test')
  const upper = useMemo(() => txt.toUpperCase(), [txt])
  const lower = useMemo(() => txt.toLowerCase(), [txt])
  const title = useMemo(() => titleCase(txt), [txt])
  const snake = useMemo(() => snakeCase(txt), [txt])
  const kebab = useMemo(() => kebabCase(txt), [txt])
  const camel = useMemo(() => camelCase(txt), [txt])
  return (
    <div className="space-y-3">
      <Input  variant="simple" className="" value={txt} onChange={(e) => setTxt(e.target.value)} />
      <div className="grid md:grid-cols-2 gap-3 font-mono text-sm">
        <div className="rounded bg-slate-800 p-2">UPPER: {upper}</div>
        <div className="rounded bg-slate-800 p-2">lower: {lower}</div>
        <div className="rounded bg-slate-800 p-2">Title: {title}</div>
        <div className="rounded bg-slate-800 p-2">snake_case: {snake}</div>
        <div className="rounded bg-slate-800 p-2">kebab-case: {kebab}</div>
        <div className="rounded bg-slate-800 p-2">camelCase: {camel}</div>
      </div>
    </div>
  )
}
