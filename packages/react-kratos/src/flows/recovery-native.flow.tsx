import type { GenericError }           from '@ory/client'
import type { UpdateRecoveryFlowBody } from '@ory/client'
import type { RecoveryFlow }           from '@ory/client'
import type { ContinueWith }           from '@ory/client'
import type { Session }                from '@ory/client'
import type { ReactNode }              from 'react'
import type { ReactElement }           from 'react'

import { AxiosError }                  from 'axios'
import { useState }                    from 'react'
import { useEffect }                   from 'react'
import { useMemo }                     from 'react'
import { useCallback }                 from 'react'
import React                           from 'react'

import { FlowProvider }                from '../providers'
import { ValuesProvider }              from '../providers'
import { SubmitProvider }              from '../providers'
import { ValuesStore }                 from '../providers'
import { useSdk }                      from '../hooks'

export interface RecoveryNativeFlowProps {
  children: ReactNode
  onError?: (error: unknown) => void
  onGenericError?: (error: GenericError) => void
  onSubmitPassed: (flowId: string) => void
  setSession: (
    session:
      | {
          sessionToken?: string
          session: Session
        }
      | undefined
  ) => Promise<void>
}

export type CollectRecoveryActionsType = {
  settingsFlowId: string
  sessionToken: string
  recoveryFlowId: string
}

const collectRecoveryActions = (
  items?: Array<ContinueWith>
): CollectRecoveryActionsType | undefined =>
  items?.reduce(
    (acc, curr) => {
      switch (curr.action) {
        case 'show_settings_ui':
          return { ...acc, settingsFlowId: curr.flow.id }

        case 'set_ory_session_token': {
          return { ...acc, sessionToken: curr.ory_session_token }
        }

        case 'show_recovery_ui': {
          return { ...acc, recoveryFlowId: curr.flow.id }
        }
        default: {
          return acc
        }
      }
    },
    { settingsFlowId: '', sessionToken: '', recoveryFlowId: '' }
  )

export const RecoveryNativeFlow = ({
  children,
  onError,
  onGenericError,
  onSubmitPassed,
  setSession,
}: RecoveryNativeFlowProps): ReactElement => {
  const sdk = useSdk()
  const [flow, setFlow] = useState<RecoveryFlow | undefined>(undefined)
  const values = useMemo(() => new ValuesStore(), [])
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)

  useEffect(() => {
    if (flow) {
      values.setFromFlow(flow)
    }
  }, [values, flow])

  const onCreate = useCallback(async () => {
    setLoading(true)

    try {
      const { data } = await sdk.createNativeRecoveryFlow({ withCredentials: true })

      setFlow(data)
    } catch (error) {
      if (onError) {
        onError(error)
      }
    } finally {
      setLoading(false)
    }
  }, [sdk, setFlow, onError, setLoading])

  useEffect(() => {
    onCreate()
  }, [onCreate])

  const onSubmit = useCallback(
    async (
      override?: Partial<UpdateRecoveryFlowBody>,
      onSubmitConfirm?: () => void,
      onSubmitError?: (error: unknown) => void
    ) => {
      setSubmitting(true)

      const body = {
        ...values.getValues(),
        ...(override || {}),
      } as UpdateRecoveryFlowBody

      try {
        const { data: updatedFlow } = await sdk.updateRecoveryFlow({
          flow: String(flow?.id),
          updateRecoveryFlowBody: body,
        })

        if (onSubmitConfirm) {
          onSubmitConfirm()
        }
        if (updatedFlow.state === 'passed_challenge') {
          const actions = collectRecoveryActions(updatedFlow.continue_with)

          if (actions?.sessionToken) {
            await sdk
              .toSession({
                xSessionToken: actions?.sessionToken,
              })
              .then(({ data: session }) => {
                setSession({ session, sessionToken: actions?.sessionToken }).then(() => {
                  if (onSubmitPassed) {
                    onSubmitPassed(actions.settingsFlowId)
                  }
                })
              })
          }
        } else {
          setFlow(updatedFlow)
        }
      } catch (error) {
        if (onSubmitError) {
          onSubmitError(error)
        }
        if (error instanceof AxiosError) {
          if (error.response?.status === 400) {
            if (error.response.data.error) {
              if (onGenericError) {
                onGenericError(error.response.data.error as GenericError)
              }
            } else {
              setFlow(error.response.data as RecoveryFlow)
            }
          } else if (error.response?.status === 404 || error.response?.status === 410) {
            onCreate()
          }
        }
      } finally {
        setSubmitting(false)
      }
    },
    [sdk, flow, values, onCreate, onGenericError, onSubmitPassed, setSession]
  )

  return (
    <FlowProvider value={{ flow, loading }}>
      <ValuesProvider value={values}>
        <SubmitProvider value={{ submitting, onSubmit }}>{children}</SubmitProvider>
      </ValuesProvider>
    </FlowProvider>
  )
}
