import { useEffect } from 'react'

const SITE_URL = 'https://tools.hollowdata.com'

export function useCanonical(pathname: string) {
  useEffect(() => {
    const path = pathname || '/'
    const href = `${SITE_URL}${path}`
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
    }
    link.setAttribute('href', href)
  }, [pathname])
}
