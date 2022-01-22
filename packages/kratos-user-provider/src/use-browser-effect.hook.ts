/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */

import { useEffect }      from 'react'
import { EffectCallback } from 'react'
import { DependencyList } from 'react'

export const useBrowserEffect = (effect: EffectCallback, deps?: DependencyList) => {
  if (typeof window === 'undefined') {
    return undefined
  }

  return useEffect(effect, deps)
}
