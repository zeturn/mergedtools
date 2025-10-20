export function setMeta({ title, description, keywords, ogImage }: { title?: string; description?: string; keywords?: string[] | string; ogImage?: string }) {
  if (title) {
    document.title = title
    const ogt = ensureMeta('meta[property="og:title"]')
    ogt?.setAttribute('content', title)
    const twt = ensureMeta('meta[name="twitter:title"]')
    twt?.setAttribute('content', title)
  }
  if (description) {
    setNamed('description', description)
    const ogd = ensureMeta('meta[property="og:description"]')
    ogd?.setAttribute('content', description)
    const twd = ensureMeta('meta[name="twitter:description"]')
    twd?.setAttribute('content', description)
  }
  if (keywords && (Array.isArray(keywords) ? keywords.length : String(keywords).length)) {
    setNamed('keywords', Array.isArray(keywords) ? keywords.join(',') : String(keywords))
  }
  if (ogImage) {
    const ogi = ensureMeta('meta[property="og:image"]')
    ogi?.setAttribute('content', ogImage)
    const twi = ensureMeta('meta[name="twitter:image"]')
    twi?.setAttribute('content', ogImage)
  }
}

function ensureMeta(selector: string) {
  let el = document.querySelector(selector) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    if (selector.includes('property')) el.setAttribute('property', selector.match(/property=\"([^\"]+)/)?.[1] ?? '')
    if (selector.includes('name')) el.setAttribute('name', selector.match(/name=\"([^\"]+)/)?.[1] ?? '')
    document.head.appendChild(el)
  }
  return el
}

function setNamed(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}
