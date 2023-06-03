import type { UseAppUrlProps } from './app-url.interfaces.js'

import { useState }            from 'react'
import tldjs                   from 'tldjs'

import { useBrowserEffect }    from './use-browser-effect.hook.js'

export const useAppUrl = ({ subdomain, pathname = '/' }: UseAppUrlProps = {}): string | null => {
  const [url, setUrl] = useState<string | null>(null)

  useBrowserEffect(() => {
    const { hostname, protocol } = window.location

    const domain = tldjs.getDomain(hostname)

    if (domain) {
      const origin = subdomain ? `${protocol}//${subdomain}.${domain}` : `${protocol}//${domain}`

      setUrl(`${origin}${pathname}`)
    }
  }, [subdomain, pathname])

  return url
}
