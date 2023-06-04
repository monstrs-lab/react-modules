import type { ReactNode } from 'react'

import { useContext }     from 'react'

import { Context }        from './user.context.js'

export interface WithUserProps {
  children: ReactNode | ((user: any) => ReactNode)
}

export const WithUser = ({ children }: WithUserProps): ReactNode | null => {
  const user = useContext(Context)

  if (!user) {
    return null
  }

  if (typeof children === 'function') {
    return children(user)
  }

  return children
}
