import { useState } from 'react'

export default function Page(){
  const [a, setA] = useState('Hello\nWorld\n')
  const [b, setB] = useState('Hello\nNew World!\n')
  const [udiff, setUdiff] = useState('')
  const [patched, setPatched] = useState('')

  async function run(){
  const { diff_match_patch, DIFF_DELETE, DIFF_EQUAL, DIFF_INSERT } = await import('diff-match-patch')
  const dmp = new diff_match_patch()
    const diffs = dmp.diff_main(a, b)
    dmp.diff_cleanupSemantic(diffs)
    // generate a simple unified-like diff
    const out: string[] = []
    for (const [op, text] of diffs as [number,string][]){
      if (op === DIFF_EQUAL) out.push(' '+text)
      else if (op === DIFF_INSERT) out.push('+'+text)
      else if (op === DIFF_DELETE) out.push('-'+text)
    }
    setUdiff(out.join(''))
  }

  async function apply(){
    const { diff_match_patch } = await import('diff-match-patch')
    const dmp = new diff_match_patch()
    const patch = dmp.patch_make(a, b)
  const [res] = dmp.patch_apply(patch, a)
  setPatched(res)
  }

  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-4">
        <textarea className="w-full min-h-32 rounded bg-slate-800 p-2 font-mono" value={a} onChange={(e)=>setA(e.target.value)} />
        <textarea className="w-full min-h-32 rounded bg-slate-800 p-2 font-mono" value={b} onChange={(e)=>setB(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={run}>Diff</button>
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={apply}>Apply Patch</button>
      </div>
      <pre className="w-full min-h-32 rounded bg-slate-900 p-2 font-mono whitespace-pre-wrap break-words">{udiff}</pre>
      {patched && <pre className="w-full min-h-16 rounded bg-slate-900 p-2 font-mono whitespace-pre-wrap break-words">{patched}</pre>}
    </div>
  )
}
