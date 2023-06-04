import type { ReactNode }    from 'react'
import type { ReactElement } from 'react'

export interface UseAppUrlProps {
  children?: ReactNode | ((url: string) => ReactElement<any, any>)
  subdomain?: string
  pathname?: string
}
