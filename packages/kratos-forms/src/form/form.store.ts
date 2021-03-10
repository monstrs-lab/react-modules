import { KratosFormField } from './form.interfaces'

export class FormStore {
  private fields: Map<string, KratosFormField>

  private values: Map<string, string | any>

  constructor(fields: Map<string, KratosFormField>, values: Map<string, string | any>) {
    this.fields = fields
    this.values = values
  }

  static create(fields: KratosFormField[] = []) {
    const fieldsMap: Map<string, KratosFormField> = new Map()
    const valuesMap: Map<string, string | any> = new Map()

    fields.forEach(({ value = '', ...field }) => {
      fieldsMap.set(field.name, field)
      valuesMap.set(field.name, value)
    })

    return new FormStore(fieldsMap, valuesMap)
  }

  getField(name) {
    return this.fields.get(name)
  }

  getValue(name) {
    return this.values.get(name)
  }
}
