import type { ReactNode }   from 'react'
import type { Session }     from '@ory/client'
import type { JSX }         from 'react'

import { useState }         from 'react'
import { getDomain }        from 'tldjs'
import React                from 'react'

import { UserProvider }     from '@monstrs/react-user'

import { useBrowserEffect } from './use-browser-effect.hook.js'

export type BasePathFn = () => string

export type BasePath = BasePathFn | string

const locationExtractedBasePath: BasePathFn = () => {
  const { hostname, protocol } = window.location

  if (hostname === 'localhost') {
    return `${protocol}//localhost:4433`
  }

  const domain = getDomain(hostname)

  if (!domain) {
    throw new Error('Domain not found')
  }

  return `${protocol}//identity.${domain}`
}

export class IdentitySessionsWhoamiUrl {
  static fromBasePath(basePath: BasePath): string {
    return new URL(
      '/sessions/whoami',
      typeof basePath === 'function' ? basePath() : basePath
    ).toString()
  }
}

export const fetchSession = async (url): Promise<Session | undefined> => {
  const response = await fetch(url, {
    credentials: 'include',
  })

  const data = await response.json()

  if (data?.error) {
    if (data.error.code === 401) {
      return undefined
    }

    throw new Error(data.error.message)
  }

  return data
}

export interface IdentityBrowserUserProviderProps {
  children?: ReactNode
  basePath: BasePath
}

export const IdentityBrowserUserProvider = ({
  basePath = locationExtractedBasePath,
  children,
}: IdentityBrowserUserProviderProps): JSX.Element => {
  const [session, setSession] = useState<Session | undefined>(undefined)

  useBrowserEffect(() => {
    fetchSession(IdentitySessionsWhoamiUrl.fromBasePath(basePath)).then(setSession)
  }, [locationExtractedBasePath])

  return <UserProvider value={session?.identity}>{children}</UserProvider>
}
