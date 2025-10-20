import { useState } from 'react'

function htmlToMd(html: string){
  const doc = new DOMParser().parseFromString(html, 'text/html')
  function walk(n: Node): string {
    if (n.nodeType === Node.TEXT_NODE) return (n.nodeValue || '').replace(/\s+/g,' ')
    if (!(n instanceof Element)) return ''
    const tag = n.tagName.toLowerCase()
    const inner = Array.from(n.childNodes).map(walk).join('')
    switch(tag){
      case 'strong': case 'b': return `**${inner}**`
      case 'em': case 'i': return `*${inner}*`
      case 'u': return `__${inner}__`
      case 'code': return `\`${inner}\``
      case 'pre': return `\n\n\
\`\`\`\n${n.textContent}\n\`\`\`\n\n`
      case 'a': return `[${inner}](${(n as HTMLAnchorElement).href})`
      case 'img': return `![](${(n as HTMLImageElement).src})`
      case 'br': return `  \n`
      case 'p': return `\n\n${inner}\n\n`
      case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6':
        const level = Number(tag[1]); return `\n\n${'#'.repeat(level)} ${inner}\n\n`
      case 'ul': return `\n\n${Array.from(n.children).map(li=>`- ${walk(li)}`).join('\n')}\n\n`
      case 'ol': return `\n\n${Array.from(n.children).map((li,i)=>`${i+1}. ${walk(li)}`).join('\n')}\n\n`
      case 'li': return inner
      default: return inner
    }
  }
  return walk(doc.body).trim() || ''
}

export default function Page(){
  const [html, setHtml] = useState('<h1>Title</h1><p><strong>Hello</strong> <em>World</em></p>')
  const [md, setMd] = useState('')
  function run(){ setMd(htmlToMd(html)) }
  return (
    <div className="space-y-3">
      <textarea className="w-full min-h-32 rounded bg-slate-800 p-2" value={html} onChange={(e)=>setHtml(e.target.value)} />
      <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={run}>转换</button>
      <pre className="w-full min-h-32 rounded bg-slate-900 p-2 font-mono whitespace-pre-wrap break-words">{md}</pre>
    </div>
  )
}
