import { useEffect, useState } from 'react'
import Input from '../../components/Input'

export default function Page() {
  const [part, setPart] = useState('25')
  const [whole, setWhole] = useState('200')
  const [percent, setPercent] = useState('12.5')
  const [dec, setDec] = useState(2)

  const num = (s: string) => (s.trim() === '' ? NaN : Number(s))
  const fmt = (x: number) => (Number.isFinite(x) ? x.toFixed(dec) : '')

  useEffect(() => {
    const p = num(part), w = num(whole)
    if (Number.isFinite(p) && Number.isFinite(w) && w !== 0) setPercent(fmt((p / w) * 100))
  }, [part, whole, dec])

  useEffect(() => {
    const w = num(whole), pct = num(percent)
    if (Number.isFinite(w) && Number.isFinite(pct)) setPart(fmt((pct / 100) * w))
  }, [whole, percent, dec])

  useEffect(() => {
    const p = num(part), pct = num(percent)
    if (Number.isFinite(p) && Number.isFinite(pct) && pct !== 0) setWhole(fmt(p / (pct / 100)))
  }, [part, percent, dec])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="flex items-center gap-2">
          <span className="w-20 text-sm text-gray-500">部分</span>
          <Input  variant="simple" value={part} onChange={(e) => setPart(e.target.value)} />
        </label>
        <label className="flex items-center gap-2">
          <span className="w-20 text-sm text-gray-500">整体</span>
          <Input  variant="simple" value={whole} onChange={(e) => setWhole(e.target.value)} />
        </label>
        <label className="flex items-center gap-2">
          <span className="w-20 text-sm text-gray-500">百分比 %</span>
          <Input  variant="simple" value={percent} onChange={(e) => setPercent(e.target.value)} />
        </label>
        <label className="flex items-center gap-2">
          <span className="w-20 text-sm text-gray-500">小数位</span>
          <Input  variant="simple" type="number" min={0} max={10} value={dec} onChange={(e) => setDec(Math.max(0, Math.min(10, Number(e.target.value))))} />
        </label>
      </div>
      <div className="text-sm text-gray-500">任意修改两项，第三项自动计算。</div>
    </div>
  )
}
