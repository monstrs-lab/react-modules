import type { ReactNode } from 'react'

import { useContext }     from 'react'

import { Context }        from './user.context.js'

export interface WithouthUserProps {
  children: ReactNode
}

export const WithouthUser = ({ children }: WithouthUserProps): ReactNode | null => {
  const user = useContext(Context)

  if (user) {
    return null
  }

  return children
}
