import { useMemo, useState } from 'react'
import Input from '../../components/Input'

type Token = { type: 'num' | 'op' | 'lparen' | 'rparen' | 'ident' | 'comma'; value: string }

const OPS: Record<string, { p: number; r: 'L' | 'R'; n: number; fn: (...a: number[]) => number }> = {
  '+': { p: 2, r: 'L', n: 2, fn: (a, b) => a + b },
  '-': { p: 2, r: 'L', n: 2, fn: (a, b) => a - b },
  '*': { p: 3, r: 'L', n: 2, fn: (a, b) => a * b },
  '/': { p: 3, r: 'L', n: 2, fn: (a, b) => a / b },
  '^': { p: 4, r: 'R', n: 2, fn: (a, b) => Math.pow(a, b) },
}

const FUNS: Record<string, (...a: number[]) => number> = {
  sin: (x) => Math.sin(x),
  cos: (x) => Math.cos(x),
  tan: (x) => Math.tan(x),
  log: (x, b = 10) => Math.log(x) / Math.log(b),
  ln: (x) => Math.log(x),
  sqrt: (x) => Math.sqrt(x),
  abs: (x) => Math.abs(x),
  round: (x) => Math.round(x),
  floor: (x) => Math.floor(x),
  ceil: (x) => Math.ceil(x),
  min: (...xs) => Math.min(...xs),
  max: (...xs) => Math.max(...xs),
}

const CONSTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
}

function tokenize(s: string): Token[] {
  const res: Token[] = []
  let i = 0
  while (i < s.length) {
    const c = s[i]
    if (/\s/.test(c)) { i++; continue }
    if (/[0-9.]/.test(c)) {
      let j = i + 1
      while (j < s.length && /[0-9._]/.test(s[j])) j++
      const raw = s.slice(i, j).replace(/_/g, '')
      res.push({ type: 'num', value: raw })
      i = j
      continue
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i + 1
      while (j < s.length && /[A-Za-z0-9_]/.test(s[j])) j++
      res.push({ type: 'ident', value: s.slice(i, j) })
      i = j
      continue
    }
    if (c === ',') { res.push({ type: 'comma', value: ',' }); i++; continue }
    if (c === '(') { res.push({ type: 'lparen', value: '(' }); i++; continue }
    if (c === ')') { res.push({ type: 'rparen', value: ')' }); i++; continue }
    if ('+-*/^'.includes(c)) { res.push({ type: 'op', value: c }); i++; continue }
    throw new Error('无法识别的字符: ' + c)
  }
  return res
}

function toRPN(tokens: Token[]): (Token | { type: 'fun'; name: string; argc: number })[] {
  const out: (Token | { type: 'fun'; name: string; argc: number })[] = []
  const ops: Token[] = []
  const argCountStack: number[] = [] // 仅函数调用时使用
  let expectUnary = true
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (t.type === 'num') { out.push(t); expectUnary = false; continue }
    if (t.type === 'ident') {
      // 可能是常量或函数；在 toRPN 阶段不确定，先推到输出，若后面紧跟 lparen 则转函数
      out.push(t)
      expectUnary = false
      continue
    }
    if (t.type === 'comma') {
      // 弹出操作符直到遇到左括号
      while (ops.length && ops[ops.length - 1].type !== 'lparen') out.push(ops.pop()!)
      // 记录当前函数的参数分隔
      if (argCountStack.length) argCountStack[argCountStack.length - 1]++
      expectUnary = true
      continue
    }
    if (t.type === 'lparen') {
      // 将前一个 ident 作为函数名转换（若存在）。这里采用约定：ident 紧邻 '(' 视为函数调用
      const last = out[out.length - 1]
      if (last && (last as Token).type === 'ident') {
        // 将 ident 占位，等到遇到 rparen 再确定 argc
        argCountStack.push(1) // 至少一个参数，遇到空 () 会在 rparen 时设为 0
        ops.push({ type: 'ident', value: (last as Token).value })
        out.pop() // 移除输出中的函数名，占位由 ops 中 ident 承担
      }
      ops.push(t)
      expectUnary = true
      continue
    }
    if (t.type === 'rparen') {
      let seenLParen = false
      while (ops.length) {
        const op = ops.pop()!
        if (op.type === 'lparen') { seenLParen = true; break }
        out.push(op)
      }
      if (!seenLParen) throw new Error('括号不匹配')
      // 若栈顶是函数名 ident，则弹出并附带参数个数
      if (ops.length && ops[ops.length - 1].type === 'ident') {
        const fn = ops.pop()!
        let argc = argCountStack.pop() ?? 0
        // 处理空参 ()
        const prev = tokens[i - 1]
        if (prev && prev.type === 'lparen') argc = 0
        out.push({ type: 'fun', name: fn.value, argc })
      }
      expectUnary = false
      continue
    }
    if (t.type === 'op') {
      let op = t.value
      // 一元负号处理：将前导或紧接左括号/逗号后的减号视为 0- x
      if (op === '-' && expectUnary) {
        out.push({ type: 'num', value: '0' })
      }
      while (ops.length && ops[ops.length - 1].type === 'op') {
        const top = OPS[ops[ops.length - 1].value]
        const cur = OPS[op]
        if (!top || !cur) break
        if ((cur.r === 'L' && cur.p <= top.p) || (cur.r === 'R' && cur.p < top.p)) {
          out.push(ops.pop()!)
        } else break
      }
      ops.push(t)
      expectUnary = true
      continue
    }
  }
  while (ops.length) {
    const op = ops.pop()!
    if (op.type === 'lparen' || op.type === 'rparen') throw new Error('括号不匹配')
    if (op.type === 'ident') {
      // 函数名未闭合
      out.push({ type: 'fun', name: op.value, argc: argCountStack.pop() ?? 0 })
    } else {
      out.push(op)
    }
  }
  return out
}

function evalRPN(rpn: ReturnType<typeof toRPN>): number {
  const st: number[] = []
  for (const t of rpn) {
    if ((t as Token).type === 'num') { st.push(parseFloat((t as Token).value)); continue }
    if ((t as Token).type === 'op') {
      const op = OPS[(t as Token).value]
      if (st.length < op.n) throw new Error('参数不足')
      const args = st.splice(st.length - op.n)
      st.push(op.fn(...args))
      continue
    }
    if ((t as any).type === 'fun') {
      const name = (t as any).name as string
      const argc = (t as any).argc as number
      const f = FUNS[name]
      if (!f) throw new Error('未知函数: ' + name)
      if (st.length < argc) throw new Error('参数不足')
      const args = st.splice(st.length - argc)
      st.push(f(...args))
      continue
    }
    if ((t as Token).type === 'ident') {
      const v = CONSTS[(t as Token).value.toLowerCase()]
      if (v === undefined) throw new Error('未知标识符: ' + (t as Token).value)
      st.push(v)
      continue
    }
    throw new Error('不支持的 RPN 记号')
  }
  if (st.length !== 1) throw new Error('表达式无效')
  return st[0]
}

export default function Page() {
  const [expr, setExpr] = useState('sin(pi/6)^2 + cos(pi/6)^2')
  const [error, setError] = useState<string | null>(null)

  const result = useMemo(() => {
    setError(null)
    try {
      const tokens = tokenize(expr)
      const rpn = toRPN(tokens)
      const val = evalRPN(rpn)
      return val
    } catch (e: any) {
      setError(e.message || String(e))
      return null
    }
  }, [expr])

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-gray-500">表达式</label>
        <Input  variant="simple" value={expr} onChange={(e) => setExpr(e.target.value)} />
        <div className="text-xs text-gray-500 mt-1">支持 + - * / ^, 括号, 函数: sin cos tan log ln sqrt abs round floor ceil min max; 常量: pi e</div>
      </div>
      <div className="rounded border p-3 bg-gray-50 dark:bg-gray-900/40">
        {error ? (
          <div className="text-red-600">错误：{error}</div>
        ) : (
          <div>结果：{result}</div>
        )}
      </div>
    </div>
  )
}
