import type { SettingsFlow }           from '@ory/client'
import type { GenericError }           from '@ory/client'
import type { UpdateSettingsFlowBody } from '@ory/client'
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

export interface SettingsNativeFlowProps {
  children: ReactNode
  sessionToken?: string
  flowId?: string
  onError?: (error: unknown) => void
  onGenericError?: (error: GenericError) => void
}

export const SettingsNativeFlow = ({
  children,
  flowId,
  sessionToken,
  onError,
  onGenericError,
}: SettingsNativeFlowProps): ReactElement => {
  const sdk = useSdk()
  const [flow, setFlow] = useState<SettingsFlow | undefined>(undefined)
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
        .getSettingsFlow({ id: String(flowId), xSessionToken: sessionToken })
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
      .createNativeSettingsFlow({
        xSessionToken: sessionToken,
      })
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
  }, [sdk, sessionToken, setFlow, flowId, onError, setLoading])

  useEffect(() => {
    onCreate()
  }, [onCreate])

  const onSubmit = useCallback(
    async (
      override?: Partial<UpdateSettingsFlowBody>,
      onSubmitConfirm?: () => void,
      onSubmitError?: (error: unknown) => void
    ) => {
      setSubmitting(true)

      const body = {
        ...values.getValues(),
        ...(override || {}),
      } as UpdateSettingsFlowBody

      try {
        const { data } = await sdk.updateSettingsFlow(
          { flow: String(flow?.id), updateSettingsFlowBody: body, xSessionToken: sessionToken },
          { withCredentials: true }
        )

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
              setFlow(error.response.data as SettingsFlow)
            }
          } else if (error.response?.status === 404 || error.response?.status === 410) {
            onCreate()
          }
        }
      } finally {
        setSubmitting(false)
      }
    },
    [sdk, flow, values, onCreate, sessionToken, onGenericError]
  )

  return (
    <FlowProvider value={{ flow, loading }}>
      <ValuesProvider value={values}>
        <SubmitProvider value={{ submitting, onSubmit }}>{children}</SubmitProvider>
      </ValuesProvider>
    </FlowProvider>
  )
}
