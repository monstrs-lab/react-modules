import type { ReactNode }    from 'react'
import type { ReactElement } from 'react'
export type IdentityUrlType =
  | 'login'
  | 'logout'
  | 'recovery'
  | 'registration'
  | 'settings'
  | 'verification'

export interface UseIdentityUrlReturnToProps {
  subdomain?: string
  pathname?: string
}

export interface UseIdentityUrlProps {
  type?: IdentityUrlType
  returnTo?: UseIdentityUrlReturnToProps | false | true
  children?: ReactNode | ((url: string) => ReactElement<any, any>)
}
