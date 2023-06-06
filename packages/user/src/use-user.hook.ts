import { useContext } from 'react'

import { Context }    from './user.context.js'

export const useUser = (): any => useContext(Context)
