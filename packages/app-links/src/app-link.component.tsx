import type { FC }             from 'react'

import type { UseAppUrlProps } from './app-url.interfaces.js'

import { useAppUrl }           from './use-app-url.hook.js'

export const AppLink: FC<UseAppUrlProps> = ({ children, subdomain, pathname }) => {
  const url = useAppUrl({ subdomain, pathname })

  if (!children || !url) {
    return null
  }

  if (typeof children !== 'function') {
    throw new Error('AppLink - children must be a function.')
  }

  return children(url)
}
