import { useMemo, useState } from 'react'

type MetaState = {
  title: string
  description: string
  url: string
  siteName: string
  image: string
  themeColor: string
  icon: string
  keywords: string
}

const initial: MetaState = {
  title: '示例站点标题',
  description: '一句简短而清晰的站点描述。',
  url: 'https://example.com',
  siteName: 'Example Site',
  image: 'https://example.com/og.png',
  themeColor: '#0ea5e9',
  icon: '/favicon.ico',
  keywords: 'example, demo, site',
}

export default function Page() {
  const [s, setS] = useState<MetaState>(initial)

  const html = useMemo(() => {
    const lines: string[] = []
    if (s.title) lines.push(`<title>${escapeHtml(s.title)}</title>`) 
    if (s.description) lines.push(`<meta name="description" content="${escapeHtml(s.description)}">`)
    if (s.keywords) lines.push(`<meta name="keywords" content="${escapeHtml(s.keywords)}">`)
    if (s.themeColor) lines.push(`<meta name="theme-color" content="${escapeHtml(s.themeColor)}">`)
    if (s.icon) lines.push(`<link rel="icon" href="${escapeHtml(s.icon)}">`)
    if (s.url) lines.push(`<link rel="canonical" href="${escapeHtml(s.url)}">`)
    // OpenGraph
    if (s.title) lines.push(`<meta property="og:title" content="${escapeHtml(s.title)}">`)
    if (s.description) lines.push(`<meta property="og:description" content="${escapeHtml(s.description)}">`)
    if (s.url) lines.push(`<meta property="og:url" content="${escapeHtml(s.url)}">`)
    if (s.siteName) lines.push(`<meta property="og:site_name" content="${escapeHtml(s.siteName)}">`)
    if (s.image) lines.push(`<meta property="og:image" content="${escapeHtml(s.image)}">`)
    // Twitter
    if (s.title) lines.push(`<meta name="twitter:title" content="${escapeHtml(s.title)}">`)
    if (s.description) lines.push(`<meta name="twitter:description" content="${escapeHtml(s.description)}">`)
    if (s.image) lines.push(`<meta name="twitter:image" content="${escapeHtml(s.image)}">`)
    lines.push(`<meta name="twitter:card" content="summary_large_image">`)
    return lines.join('\n')
  }, [s])

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">输入</h2>
        <div className="grid grid-cols-2 gap-3">
          <L label="标题"><input className="input" value={s.title} onChange={e=>setS(v=>({ ...v, title: e.target.value }))} /></L>
          <L label="站点名"><input className="input" value={s.siteName} onChange={e=>setS(v=>({ ...v, siteName: e.target.value }))} /></L>
          <L label="URL"><input className="input" value={s.url} onChange={e=>setS(v=>({ ...v, url: e.target.value }))} /></L>
          <L label="主题色"><input className="input" value={s.themeColor} onChange={e=>setS(v=>({ ...v, themeColor: e.target.value }))} /></L>
          <L label="图标"><input className="input" value={s.icon} onChange={e=>setS(v=>({ ...v, icon: e.target.value }))} /></L>
          <L label="OG 图片"><input className="input" value={s.image} onChange={e=>setS(v=>({ ...v, image: e.target.value }))} /></L>
          <L label="关键词"><input className="input" value={s.keywords} onChange={e=>setS(v=>({ ...v, keywords: e.target.value }))} /></L>
          <div className="col-span-2">
            <L label="描述">
              <textarea className="textarea h-28" value={s.description} onChange={e=>setS(v=>({ ...v, description: e.target.value }))} />
            </L>
          </div>
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">输出</h2>
        <pre className="rounded bg-slate-800 p-3 font-mono whitespace-pre overflow-auto text-sm">
{html}
        </pre>
      </section>
    </div>
  )
}

function L({ label, children }: { label: string; children: React.ReactNode }){
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-slate-300">{label}</span>
      {children}
    </label>
  )
}

function escapeHtml(s: string){
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
