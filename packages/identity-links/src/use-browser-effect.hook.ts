/* eslint-disable react-hooks/rules-of-hooks */

import type { EffectCallback } from 'react'
import type { DependencyList } from 'react'

import { useEffect }           from 'react'

export const useBrowserEffect = (effect: EffectCallback, deps?: DependencyList): void => {
  if (typeof window !== 'undefined') {
    useEffect(effect, deps)
  }
}
