import { useMemo, useState } from 'react'
import Input from '../../components/Input'

function estimateEntropy(pwd: string){
  if (!pwd) return { bits: 0, pool: 0 }
  let pool = 0
  if (/[a-z]/.test(pwd)) pool += 26
  if (/[A-Z]/.test(pwd)) pool += 26
  if (/[0-9]/.test(pwd)) pool += 10
  if (/[^a-zA-Z0-9]/.test(pwd)) pool += 33 // 粗略估计符号集
  // 常见扩展：空格、非 ASCII
  if (/\s/.test(pwd)) pool += 1
  if (/[^\x00-\x7f]/.test(pwd)) pool += 100
  const bits = Math.log2(Math.max(1, pool)) * pwd.length
  return { bits, pool }
}

function zxcvbnLiteHints(pwd: string){
  const hints: string[] = []
  if (/^(?:password|123456|qwerty|admin|letmein|welcome|iloveyou)$/i.test(pwd)) hints.push('常见弱口令')
  if (/^(.)\1{5,}$/.test(pwd)) hints.push('重复字符过多')
  if (/^[a-z]+$/.test(pwd) || /^[A-Z]+$/.test(pwd)) hints.push('仅字母')
  if (/^[0-9]+$/.test(pwd)) hints.push('仅数字')
  if (pwd.length < 12) hints.push('长度建议 ≥ 12')
  if (!/[^a-zA-Z0-9]/.test(pwd)) hints.push('建议包含符号字符')
  if (!/[A-Z]/.test(pwd)) hints.push('建议包含大写字母')
  if (!/[a-z]/.test(pwd)) hints.push('建议包含小写字母')
  if (!/[0-9]/.test(pwd)) hints.push('建议包含数字')
  return hints
}

export default function Page(){
  const [pwd, setPwd] = useState('CorrectHorseBatteryStaple!')
  const est = useMemo(()=> estimateEntropy(pwd), [pwd])
  const hints = useMemo(()=> zxcvbnLiteHints(pwd), [pwd])
  const score = est.bits >= 80 ? 4 : est.bits >= 60 ? 3 : est.bits >= 40 ? 2 : est.bits >= 28 ? 1 : 0
  const colors = ['bg-rose-700','bg-orange-600','bg-amber-600','bg-emerald-600','bg-emerald-700']
  const labels = ['很弱','较弱','一般','较强','很强']

  return (
    <div className="space-y-4">
      <Input  variant="simple" type="password" value={pwd} onChange={(e)=>setPwd(e.target.value)} placeholder="输入密码" />
      <div className="space-y-1">
        <div className="h-2 w-full bg-slate-800 rounded">
          <div className={`h-2 rounded ${colors[score]}`} style={{ width: `${(score+1)*20}%` }} />
        </div>
        <div className="text-sm text-gray-400">{labels[score]} · 估算熵 {est.bits.toFixed(1)} bit（字符池≈{est.pool}）</div>
      </div>
      {hints.length>0 && (
        <div className="space-y-1">
          <div className="text-sm text-gray-400">建议</div>
          <ul className="list-disc pl-6 text-sm text-gray-300">
            {hints.map((h,i)=> <li key={i}>{h}</li>)}
          </ul>
        </div>
      )}
      <div className="text-xs text-gray-500">提示：此为轻量估算，并非完整口令强度模型；请结合随机性与口令管理器使用。</div>
    </div>
  )
}
