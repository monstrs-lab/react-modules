import { useMemo }           from 'react'
import { useState }          from 'react'
import { useCallback }       from 'react'
import { FormEvent }         from 'react'
import { FunctionComponent } from 'react'

import { FormFieldProps }    from './form-field.interfaces'
import { useForm }           from '../form'

export const FormField: FunctionComponent<FormFieldProps> = ({ name, children }) => {
  const form = useForm()

  if (!form) {
    throw new Error('Missing <FormProvider>')
  }

  const [value, setValue] = useState(form.getValue(name))

  const onChange = useCallback(
    (event: FormEvent<HTMLInputElement> | string | any) => {
      if (event && event.target) {
        setValue(event.target.value)
      } else {
        setValue(event)
      }
    },
    [setValue]
  )

  const field = useMemo(() => form.getField(name), [name, form])

  if (!field) {
    // eslint-disable-next-line
    console.log(`Field ${name} not found`)

    return null
  }

  if (typeof children === 'function') {
    return children(field, value, onChange)
  }

  return children
}
