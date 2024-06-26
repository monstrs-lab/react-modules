import type { UiNodeInputAttributes } from '@ory/client'
import type { ReactElement }          from 'react'

import type { FlowUiInputNode }       from './flow-input-node.component'

import { useMemo }                    from 'react'

import { useFlow }                    from '../hooks'

export interface FlowTotpUnlinkNodesProps {
  children: (nodes: Array<FlowUiInputNode>) => ReactElement
}

export const FlowTotpUnlinkNodes = ({
  children,
}: FlowTotpUnlinkNodesProps): ReactElement | null => {
  const { flow } = useFlow()

  const nodes = useMemo(
    () =>
      flow?.ui?.nodes?.filter(
        (node) =>
          node.group === 'totp' && (node.attributes as UiNodeInputAttributes).name === 'unlink'
      ),
    [flow]
  )

  if (!(nodes && nodes.length > 0)) {
    return null
  }

  if (typeof children === 'function') {
    return children(nodes as Array<FlowUiInputNode>)
  }

  return children as ReactElement
}
