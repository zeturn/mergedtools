import { useMemo, useState } from 'react'
import Input from '../../components/Input'

export default function Page(){
  const [a, setA] = useState('0')
  const [b, setB] = useState('0')
  const [op, setOp] = useState<'+'|'-'|'*'|'/'|'^'>('+')
  const res = useMemo(()=>{
    const A = parseFloat(a), B = parseFloat(b)
    if ([A,B].some(Number.isNaN)) return '请输入数字'
    switch(op){
      case '+': return String(A+B)
      case '-': return String(A-B)
      case '*': return String(A*B)
      case '/': return B===0 ? '除数不能为 0' : String(A/B)
      case '^': return String(Math.pow(A,B))
    }
  }, [a,b,op])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <Input  variant="simple" value={a} onChange={e=>setA(e.target.value)} />
        <select className="input" value={op} onChange={e=>setOp(e.target.value as any)}>
          <option value="+">+</option>
          <option value="-">-</option>
          <option value="*">*</option>
          <option value="/">/</option>
          <option value="^">^</option>
        </select>
        <Input  variant="simple" value={b} onChange={e=>setB(e.target.value)} />
        <Input  variant="simple" value={res} readOnly />
      </div>
      <p className="text-sm text-gray-500">需要复杂表达式？试试“数学表达式计算器（math-eval）”。</p>
    </div>
  )
}
