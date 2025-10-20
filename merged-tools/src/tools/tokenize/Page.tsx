import { useMemo, useState } from 'react'

type Mode = 'auto' | 'word' | 'char' | 'bigram'

export default function Page(){
  const [text, setText] = useState('')
  const [mode, setMode] = useState<Mode>('auto')
  const [topN, setTopN] = useState(20)
  const [minLen, setMinLen] = useState(1)

  const tokens = useMemo(()=> tokenize(text, mode, minLen), [text, mode, minLen])
  const freq = useMemo(()=> count(tokens).slice(0, topN), [tokens, topN])

  return (
    <div className="space-y-3">
      <textarea className="w-full min-h-40 rounded bg-slate-900 p-2" placeholder="输入文本..." value={text} onChange={(e)=>setText(e.target.value)} />
      <div className="flex gap-3 items-center flex-wrap">
        <label className="text-sm text-slate-400">模式
          <select className="ml-2 bg-slate-800 rounded p-1" value={mode} onChange={(e)=>setMode(e.target.value as Mode)}>
            <option value="auto">自动</option>
            <option value="word">英文单词</option>
            <option value="char">逐字符</option>
            <option value="bigram">双字</option>
          </select>
        </label>
        <label className="text-sm text-slate-400">Top N
          <input type="number" className="ml-2 w-20 bg-slate-800 rounded p-1" value={topN} onChange={(e)=>setTopN(Number(e.target.value))} />
        </label>
        <label className="text-sm text-slate-400">最小长度
          <input type="number" className="ml-2 w-20 bg-slate-800 rounded p-1" value={minLen} onChange={(e)=>setMinLen(Number(e.target.value))} />
        </label>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-slate-900 rounded p-3">
          <div className="text-sm text-slate-400 mb-2">分词结果（{tokens.length}）</div>
          <div className="flex flex-wrap gap-2 text-xs">
            {tokens.slice(0, 500).map((t,i)=> <span key={i} className="px-2 py-1 bg-slate-800 rounded">{t}</span>)}
          </div>
        </div>
        <div className="bg-slate-900 rounded p-3">
          <div className="text-sm text-slate-400 mb-2">关键词 Top {topN}</div>
          <table className="text-sm w-full">
            <thead><tr><th className="text-left">词</th><th className="text-left">频次</th></tr></thead>
            <tbody>
              {freq.map(([k,v])=> <tr key={k}><td>{k}</td><td>{v}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function tokenize(text: string, mode: Mode, minLen: number): string[]{
  const isCJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(text)
  const m = mode==='auto'? (isCJK? 'bigram':'word') : mode
  if (m==='word'){
    return text
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter(Boolean)
      .filter(t=>t.length>=minLen)
  }
  if (m==='char'){
    return Array.from(text).filter(ch=>!(/\s/.test(ch))).filter(ch=>ch.length>=minLen)
  }
  // bigram
  const chars = Array.from(text).filter(ch=>!(/\s/.test(ch)))
  const out: string[] = []
  for (let i=0;i<chars.length-1;i++){
    const bi = chars[i]+chars[i+1]
    if (bi.length>=minLen) out.push(bi)
  }
  return out
}

function count(tokens: string[]): Array<[string, number]>{
  const m = new Map<string, number>()
  for (const t of tokens){ m.set(t, (m.get(t)||0)+1) }
  return Array.from(m.entries()).sort((a,b)=> b[1]-a[1])
}
