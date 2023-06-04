import type { FC }                  from 'react'

import type { UseIdentityUrlProps } from './identity-url.interfaces.js'

import { useIdentityUrl }           from './use-identity-url.hook.js'

export const IdentityLink: FC<UseIdentityUrlProps> = ({ children, type, returnTo }) => {
  const url = useIdentityUrl({ type, returnTo })

  if (!children || !url) {
    return null
  }

  if (typeof children !== 'function') {
    throw new Error('IdentityLink - children must be a function.')
  }

  return children(url)
}
