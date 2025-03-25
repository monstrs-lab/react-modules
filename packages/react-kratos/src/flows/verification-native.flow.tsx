import type { VerificationFlow }           from '@ory/client'
import type { GenericError }               from '@ory/client'
import type { UpdateVerificationFlowBody } from '@ory/client'
import type { ReactNode }                  from 'react'
import type { ReactElement }               from 'react'

import { AxiosError }                      from 'axios'
import { useState }                        from 'react'
import { useEffect }                       from 'react'
import { useMemo }                         from 'react'
import { useCallback }                     from 'react'
import React                               from 'react'

import { FlowProvider }                    from '../providers'
import { ValuesProvider }                  from '../providers'
import { SubmitProvider }                  from '../providers'
import { ValuesStore }                     from '../providers'
import { useSdk }                          from '../hooks'

export interface VerificationNativeFlowProps {
  children: ReactNode
  flowId?: string
  onGenericError?: (error: GenericError) => void
  onError?: (error: unknown) => void
}

export const VerificationNativeFlow = ({
  children,
  flowId,
  onError,
  onGenericError,
}: VerificationNativeFlowProps): ReactElement => {
  const sdk = useSdk()
  const [flow, setFlow] = useState<VerificationFlow | undefined>(undefined)
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

    if (flowId) {
      await sdk
        .getVerificationFlow({ id: flowId }, { withCredentials: true })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch((err) => {
          if (onError) {
            onError(err)
          }
        })
        .finally(() => {
          setLoading(false)
        })

      return
    }

    await sdk
      .createNativeVerificationFlow()
      .then(({ data }) => {
        setFlow(data)
      })
      .catch((err) => {
        if (onError) {
          onError(err)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [sdk, setFlow, setLoading, onError, flowId])

  useEffect(() => {
    onCreate()
  }, [onCreate])

  const onSubmit = useCallback(
    async (
      override?: Partial<UpdateVerificationFlowBody>,
      onSubmitConfirm?: () => void,
      onSubmitError?: (error: unknown) => void
    ) => {
      setSubmitting(true)

      const body = {
        ...values.getValues(),
        ...(override || {}),
      } as UpdateVerificationFlowBody

      try {
        const { data } = await sdk.updateVerificationFlow({
          flow: String(flow?.id),
          updateVerificationFlowBody: body,
        })

        if (onSubmitConfirm) {
          onSubmitConfirm()
        }
        setFlow(data)
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
              setFlow(error.response.data as VerificationFlow)
            }
          } else if (error.response?.status === 404 || error.response?.status === 410) {
            onCreate()
          }
        }
      } finally {
        setSubmitting(false)
      }
    },
    [sdk, flow, values, onCreate, onGenericError]
  )

  return (
    <FlowProvider value={{ flow, loading }}>
      <ValuesProvider value={values}>
        <SubmitProvider value={{ submitting, onSubmit }}>{children}</SubmitProvider>
      </ValuesProvider>
    </FlowProvider>
  )
}
