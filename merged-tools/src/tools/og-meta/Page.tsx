import { useMemo, useState } from 'react'

export default function Page(){
  const [title, setTitle] = useState('My Page Title')
  const [desc, setDesc] = useState('Page description...')
  const [url, setUrl] = useState('https://example.com')
  const [image, setImage] = useState('https://example.com/cover.png')
  const [site, setSite] = useState('@sitehandle')

  const html = useMemo(()=>{
    return [
      `<meta property="og:title" content="${escapeHtml(title)}">`,
      `<meta property="og:description" content="${escapeHtml(desc)}">`,
      `<meta property="og:url" content="${escapeHtml(url)}">`,
      `<meta property="og:image" content="${escapeHtml(image)}">`,
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:title" content="${escapeHtml(title)}">`,
      `<meta name="twitter:description" content="${escapeHtml(desc)}">`,
      `<meta name="twitter:image" content="${escapeHtml(image)}">`,
      `<meta name="twitter:site" content="${escapeHtml(site)}">`,
    ].join('\n')
  }, [title, desc, url, image, site])

  function copy(){ navigator.clipboard.writeText(html) }

  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <input className="bg-slate-800 rounded p-2" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" />
        <input className="bg-slate-800 rounded p-2" value={desc} onChange={(e)=>setDesc(e.target.value)} placeholder="Description" />
        <input className="bg-slate-800 rounded p-2" value={url} onChange={(e)=>setUrl(e.target.value)} placeholder="URL" />
        <input className="bg-slate-800 rounded p-2" value={image} onChange={(e)=>setImage(e.target.value)} placeholder="Image URL" />
        <input className="bg-slate-800 rounded p-2" value={site} onChange={(e)=>setSite(e.target.value)} placeholder="Twitter @site" />
      </div>
      <pre className="bg-slate-900 p-3 rounded overflow-auto text-sm"><code>{html}</code></pre>
      <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={copy}>复制 meta 片段</button>
    </div>
  )
}

function escapeHtml(s: string){
  return s.replace(/[&<>"]+/g, (m)=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m] as string))
}
