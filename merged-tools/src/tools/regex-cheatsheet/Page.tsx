import { useState } from 'react'

const SECTIONS = [
  { title: '元字符', items: [ ['.', '任意字符'], ['\d', '数字'], ['\w', '字母/数字/下划线'], ['\s', '空白'], ['\b', '单词边界'] ] },
  { title: '量词', items: [ ['*', '0 次或多次'], ['+', '1 次或多次'], ['?', '0 或 1 次'], ['{m}', '恰好 m 次'], ['{m,}', '至少 m 次'], ['{m,n}', 'm 到 n 次'] ] },
  { title: '分组与引用', items: [ ['(x)', '捕获组'], ['(?:x)', '非捕获组'], ['(?<name>x)', '命名组'], ['\\1', '第 1 个捕获组'] ] },
  { title: '锚点', items: [ ['^', '开头'], ['$', '结尾'] ] },
  { title: '选择', items: [ ['x|y', 'x 或 y'] ] },
]

export default function Page(){
  const [pattern, setPattern] = useState('foo\\d+')
  const [flags, setFlags] = useState('g')
  const [text, setText] = useState('foo1 bar foo23 baz')
  const [result, setResult] = useState('')

  function test(){
    try{
      const re = new RegExp(pattern, flags)
      const matches = Array.from(text.matchAll(re)).map(m=> ({ match: m[0], index: m.index }))
      setResult(JSON.stringify(matches, null, 2))
    }catch(e: unknown){ setResult('无效正则：'+ String(e)) }
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-3">
        {SECTIONS.map(sec=> (
          <div key={sec.title} className="bg-slate-900 rounded p-3">
            <div className="text-slate-400 mb-2">{sec.title}</div>
            <ul className="list-disc pl-5 text-sm">
              {sec.items.map(([k,v])=> <li key={k}><span className="font-mono bg-slate-800 px-1 py-0.5 rounded mr-2">{k}</span>{v}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <div className="text-slate-400">小测试</div>
        <div className="flex gap-2 items-center flex-wrap">
          <input className="bg-slate-800 rounded p-2 font-mono" value={pattern} onChange={(e)=>setPattern(e.target.value)} />
          <input className="bg-slate-800 rounded p-2 w-20" value={flags} onChange={(e)=>setFlags(e.target.value)} />
          <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={test}>测试</button>
        </div>
        <textarea className="w-full min-h-24 bg-slate-900 rounded p-2" value={text} onChange={(e)=>setText(e.target.value)} />
        <pre className="bg-slate-900 p-3 rounded overflow-auto text-sm"><code>{result}</code></pre>
      </div>
    </div>
  )
}
