import { useMemo }             from 'react'

import { UseIdentityUrlProps } from './identity-url.interfaces'

export const IdentityUrlTypes = {
  login: '/auth/login',
  registration: '/auth/registration',
  verification: '/auth/verification',
  logout: '/auth/logout',
  settings: '/settings',
}

export const useIdentityUrl = ({
  type = 'login',
  subdomain = 'accounts',
  returnTo,
  substractHost,
}: UseIdentityUrlProps = {}) =>
  useMemo(() => {
    if (typeof window === 'undefined') {
      return null
    }

    const { hostname, origin, href } = window.location
    const path = IdentityUrlTypes[type]

    let returnToValue = href

    if (returnTo) {
      if (returnTo.startsWith('http')) {
        returnToValue = returnTo
      } else if (returnTo.startsWith('/')) {
        returnToValue = `${origin}${returnTo}`
      }
    }

    let host = hostname

    if (substractHost && host.startsWith(substractHost)) {
      host = host.replace(substractHost.endsWith('.') ? substractHost : `${substractHost}.`, '')
    }

    if (subdomain) {
      host = `${subdomain}.${host}`
    }

    return `https://${host}${path}?return_to=${returnToValue}`
  }, [type, subdomain, returnTo, substractHost])
