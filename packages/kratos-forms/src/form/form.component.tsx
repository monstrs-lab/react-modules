import React                 from 'react'
import { useMemo }           from 'react'
import { FunctionComponent } from 'react'

import { FormStore }         from './form.store'
import { Provider }          from './form.context'
import { FormProps }         from './form.interfaces'

export const Form: FunctionComponent<FormProps> = ({
  action,
  fields = [],
  method = 'POST',
  children,
  ...props
}) => {
  const store = useMemo(() => FormStore.create(fields), [fields])

  return (
    <Provider value={store}>
      <form action={action} method={method} {...props}>
        {children}
      </form>
    </Provider>
  )
}
