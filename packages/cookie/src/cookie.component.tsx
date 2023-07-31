import type { ReactElement } from 'react'

import { useMemo }           from 'react'
import CookiesPkg            from 'universal-cookie'

const Cookies = CookiesPkg.default || CookiesPkg

export interface CookieProps {
  name: string
  children: (value: string | undefined) => ReactElement
}

export const Cookie = ({ children, name }: CookieProps): ReactElement | null => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const value: string | undefined = useMemo(() => new Cookies().get(name), [name])

  if (!children || !name) {
    return null
  }

  if (typeof children !== 'function') {
    throw new Error('Cookie - children must be a function.')
  }

  return children(value)
}
