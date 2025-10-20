import { useState } from 'react'
import * as csso from 'csso'
import { minify as terserMinify } from 'terser'

export default function Page() {
  const [htmlIn, setHtmlIn] = useState('<div>  hello  </div>')
  const [cssIn, setCssIn] = useState('body {  color:  red; }')
  const [jsIn, setJsIn] = useState('function add(a,b){ return a + b }')
  const [htmlOut, setHtmlOut] = useState('')
  const [cssOut, setCssOut] = useState('')
  const [jsOut, setJsOut] = useState('')

  function runHtml() {
    try {
      // 轻量 HTML 压缩：移除注释、压缩多余空白，保留 <pre><code><textarea> 内容的空白
      const preserveTags = ['pre','code','textarea']
      const placeholders: string[] = []
      let s = htmlIn
      // 提取需要保留空白的块
      preserveTags.forEach(tag => {
        const re = new RegExp(`<${tag}[^>]*>[\s\S]*?<\/${tag}>`, 'gi')
        s = s.replace(re, (m) => { placeholders.push(m); return `__HTML_KEEP_${placeholders.length-1}__` })
      })
      // 移除 HTML 注释（保留条件注释）
      s = s.replace(/<!--(?!\s*\[if)([\s\S]*?)-->/g, '')
      // 折叠多余空白
      s = s.replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ')
      // 还原保留块
      s = s.replace(/__HTML_KEEP_(\d+)__/g, (_, i) => placeholders[Number(i)])
      setHtmlOut(s.trim())
    } catch (e: any) { setHtmlOut(`错误: ${e?.message ?? '未知'}`) }
  }
  function runCss() {
    try { setCssOut((csso as any).minify(cssIn).css) } catch (e: any) { setCssOut(`错误: ${e?.message ?? '未知'}`) }
  }
  async function runJs() {
    try { const out = await terserMinify(jsIn); setJsOut(out.code ?? '') } catch (e: any) { setJsOut(`错误: ${e?.message ?? '未知'}`) }
  }

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <div className="flex items-center justify-between"><h3 className="text-xl font-semibold">HTML</h3><button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={runHtml}>压缩</button></div>
        <textarea className="w-full h-32 rounded bg-slate-800 p-3 font-mono" value={htmlIn} onChange={(e)=>setHtmlIn(e.target.value)} />
        <pre className="w-full h-24 rounded bg-slate-900 p-3 font-mono overflow-auto whitespace-pre-wrap">{htmlOut}</pre>
      </section>
      <section className="space-y-2">
        <div className="flex items-center justify-between"><h3 className="text-xl font-semibold">CSS</h3><button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={runCss}>压缩</button></div>
        <textarea className="w-full h-32 rounded bg-slate-800 p-3 font-mono" value={cssIn} onChange={(e)=>setCssIn(e.target.value)} />
        <pre className="w-full h-24 rounded bg-slate-900 p-3 font-mono overflow-auto whitespace-pre-wrap">{cssOut}</pre>
      </section>
      <section className="space-y-2">
        <div className="flex items-center justify-between"><h3 className="text-xl font-semibold">JS</h3><button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={runJs}>压缩</button></div>
        <textarea className="w-full h-32 rounded bg-slate-800 p-3 font-mono" value={jsIn} onChange={(e)=>setJsIn(e.target.value)} />
        <pre className="w-full h-24 rounded bg-slate-900 p-3 font-mono overflow-auto whitespace-pre-wrap">{jsOut}</pre>
      </section>
    </div>
  )
}
