import type { ReactNode } from 'react'

import { useContext }     from 'react'

import { Context }        from './user.context.js'

export interface WithUserLoadingProps {
  children: ReactNode
}

export const WithUserLoading = ({ children }: WithUserLoadingProps): ReactNode | null => {
  const user = useContext(Context)

  if (typeof user !== 'undefined') {
    return null
  }

  return children
}
