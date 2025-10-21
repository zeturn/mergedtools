import { useMemo, useState } from 'react'
import Input from '../../components/Input'

export default function Page(){
  const [input, setInput] = useState('User.Name+alias@gmail.com')
  const out = useMemo(()=> normalizeEmail(input), [input])

  return (
    <div className="space-y-3">
      <Input  variant="simple" className="" value={input} onChange={(e)=>setInput(e.target.value)} />
      <div className="bg-slate-900 rounded p-3 font-mono">{out}</div>
      <div className="text-xs text-slate-400">说明：目前支持 gmail（去点与+tag）、outlook/hotmail（保留点、去掉 +tag）、yahoo（保留点，去掉 -tag），其他域名仅小写本地部分。</div>
    </div>
  )
}

function normalizeEmail(email: string){
  const m = /^(.*)@([^@]+)$/.exec(email.trim())
  if (!m) return email
  let local = m[1]
  const domain = m[2].toLowerCase()
  if (/gmail\.com$/.test(domain)){
    local = local.toLowerCase().split('+')[0].replace(/\./g,'')
  } else if (/(outlook|hotmail|live)\.com$/.test(domain)){
    local = local.toLowerCase().split('+')[0]
  } else if (/yahoo\.(com|co\.[a-z]{2})$/.test(domain)){
    local = local.toLowerCase().split('-')[0]
  } else {
    local = local.toLowerCase()
  }
  return `${local}@${domain}`
}
