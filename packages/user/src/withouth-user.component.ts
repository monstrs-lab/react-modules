import { useContext } from 'react'

import { Context }    from './user.context'

export const WithouthUser = ({ children }) => {
  const user = useContext(Context)

  if (user) {
    return null
  }

  return children
}
