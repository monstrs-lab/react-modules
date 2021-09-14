import React       from 'react'
import { useMemo } from 'react'

import { useFlow } from '../providers'

export const FlowForm = ({ children, ...props }) => {
  const flow = useFlow()

  // eslint-disable-next-line
  const { action, method } = useMemo(() => flow.getState()?.ui, [flow.getState()])

  return (
    <form {...props} action={action} method={method}>
      {children}
    </form>
  )
}
