import { useMemo, useState } from 'react'
import { Input, Textarea } from '../../components/Input'

// 轻量 Punycode 实现（RFC 3492 简化版，适用于域名 label），仅做基础转换

const base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700, initialBias = 72, initialN = 128, delimiter = '-'

function adapt(delta: number, numPoints: number, firstTime: boolean) {
  delta = firstTime ? Math.floor(delta / damp) : delta >> 1
  delta += Math.floor(delta / numPoints)
  let k = 0
  while (delta > (((base - tMin) * tMax) >> 1)) {
    delta = Math.floor(delta / (base - tMin))
    k += base
  }
  return Math.floor(k + ((base - tMin + 1) * delta) / (delta + skew))
}

function encodeLabel(input: string) {
  const codePoints = Array.from(input).map(c => c.codePointAt(0)!)
  let n = initialN, delta = 0, bias = initialBias
  let output: number[] = []
  for (const cp of codePoints) if (cp < 0x80) output.push(cp)
  const basicLength = output.length
  let handledCPCount = basicLength
  if (basicLength) output.push(delimiter.charCodeAt(0))
  while (handledCPCount < codePoints.length) {
    let m = Number.MAX_SAFE_INTEGER
    for (const cp of codePoints) if (cp >= n && cp < m) m = cp
    delta += (m - n) * (handledCPCount + 1)
    n = m
    for (const cp of codePoints) {
      if (cp < n) {
        delta++
        if (delta === 0) throw new Error('overflow')
      }
      if (cp === n) {
        let q = delta
        for (let k = base;; k += base) {
          const t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias)
          if (q < t) break
          const code = t + ((q - t) % (base - t))
          output.push(code + (code < 26 ? 97 : 22))
          q = Math.floor((q - t) / (base - t))
        }
        output.push(q + (q < 26 ? 97 : 22))
        bias = adapt(delta, handledCPCount + 1, handledCPCount === basicLength)
        delta = 0
        handledCPCount++
      }
    }
    delta++
    n++
  }
  return 'xn--' + String.fromCharCode(...output)
}

function decodeLabel(input: string) {
  const s = input.toLowerCase().startsWith('xn--') ? input.slice(4) : input
  const codePoints: number[] = []
  let n = initialN, i = 0, bias = initialBias
  const idx = s.lastIndexOf(delimiter)
  let b = 0
  if (idx > -1) {
    for (let j = 0; j < idx; j++) codePoints.push(s.charCodeAt(j))
    b = idx + 1
  }
  while (b < s.length) {
    let oldi = i, w = 1
    for (let k = base;; k += base) {
      const c = s.charCodeAt(b++)
      const d = c - 48 < 10 ? c - 22 : c - 65 < 26 ? c - 65 : c - 97 < 26 ? c - 97 : base
      if (d >= base) throw new Error('非法 punycode 字符')
      i += d * w
      const t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias)
      if (d < t) break
      w *= (base - t)
    }
    const outLen = codePoints.filter(cp => cp < 0x80).length + 1
    bias = adapt(i - oldi, outLen, oldi === 0)
    n += Math.floor(i / outLen)
    i %= outLen
    codePoints.splice(i, 0, n)
    i++
  }
  return String.fromCodePoint(...codePoints)
}

export default function Page() {
  const [dir, setDir] = useState<'toPuny'|'toUnicode'>('toPuny')
  const [host, setHost] = useState('例子.测试')
  const out = useMemo(() => {
    try {
      if (dir==='toPuny') return host.split('.').map(encodeLabel).join('.')
      return host.split('.').map(decodeLabel).join('.')
    } catch (e: any) {
      return '错误：' + (e.message || String(e))
    }
  }, [host, dir])
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <select className="select" value={dir} onChange={(e)=>setDir(e.target.value as any)}>
          <option value="toPuny">Unicode → Punycode</option>
          <option value="toUnicode">Punycode → Unicode</option>
        </select>
      </div>
      <Input  variant="simple" value={host} onChange={(e)=>setHost(e.target.value)} />
      <Textarea variant="simple" className="h-32" value={out} readOnly />
      <div className="text-xs text-gray-500">提示：IDNA 复杂度较高，此实现为简化版本，适用于一般场景。</div>
    </div>
  )
}
