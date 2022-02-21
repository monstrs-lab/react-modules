import { useState }         from 'react'
import { getDomain }        from 'tldjs'

import { UseAppUrlProps }   from './app-url.interfaces'
import { useBrowserEffect } from './use-browser-effect.hook'

export const useAppUrl = ({ subdomain, pathname = '/' }: UseAppUrlProps = {}): string | null => {
  const [url, setUrl] = useState<string | null>(null)

  useBrowserEffect(() => {
    const { hostname, origin, protocol } = window.location

    const domain = getDomain(hostname)

    const urlOrigin = subdomain ? `${protocol}//${subdomain}.${domain}` : origin

    setUrl(`${urlOrigin}${pathname}`)
  }, [subdomain, pathname])

  return url
}
