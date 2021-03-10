export type IdentityUrlType = 'login' | 'registration' | 'settings' | 'verification' | 'logout'

export interface UseIdentityUrlProps {
  type?: IdentityUrlType
  subdomain?: string
  returnTo?: string
  substractHost?: string
}
