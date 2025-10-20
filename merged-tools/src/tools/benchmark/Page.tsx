import { useMemo, useState } from 'react'

function runBench(code: string, warmup: number, samples: number): { times: number[], mean: number, stdev: number } {
  const fn = new Function(code) as () => void
  for (let i = 0; i < warmup; i++) fn()
  const times: number[] = []
  for (let i = 0; i < samples; i++) {
    const t0 = performance.now()
    fn()
    const t1 = performance.now()
    times.push(t1 - t0)
  }
  const mean = times.reduce((a,b)=>a+b,0) / times.length
  const stdev = Math.sqrt(times.reduce((a,b)=>a+(b-mean)**2,0)/times.length)
  return { times, mean, stdev }
}

export default function Page() {
  const [code, setCode] = useState('let s=0; for(let i=0;i<100000;i++) s+=i')
  const [warmup, setWarmup] = useState(5)
  const [samples, setSamples] = useState(20)
  const [out, setOut] = useState<{ times: number[], mean: number, stdev: number } | null>(null)

  const disabled = useMemo(()=> samples<=0 || warmup<0 || !code.trim(), [samples, warmup, code])

  const onRun = () => setOut(runBench(code, Math.max(0,warmup), Math.max(1,samples)))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="block text-sm mb-1">代码（将被放入 new Function 中执行）</label>
          <textarea className="w-full h-48 border rounded px-2 py-1 font-mono" value={code} onChange={e=>setCode(e.target.value)} />
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm">预热次数
              <input type="number" className="ml-2 border rounded px-2 py-1 w-24" value={warmup} min={0} max={1000} onChange={e=>setWarmup(Number(e.target.value))} />
            </label>
            <label className="text-sm">采样次数
              <input type="number" className="ml-2 border rounded px-2 py-1 w-24" value={samples} min={1} max={1000} onChange={e=>setSamples(Number(e.target.value))} />
            </label>
            <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={onRun} disabled={disabled}>运行</button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-600">注：使用 performance.now() 计时，结果受浏览器与硬件影响；避免执行有副作用/长时间阻塞的代码。</div>
          {out ? (
            <div className="space-y-2">
              <div className="text-sm">均值：{out.mean.toFixed(3)} ms，标准差：{out.stdev.toFixed(3)} ms</div>
              <div className="text-sm">样本：[{out.times.map(t=>t.toFixed(3)).join(', ')}]</div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">尚未运行</div>
          )}
        </div>
      </div>
    </div>
  )
}
