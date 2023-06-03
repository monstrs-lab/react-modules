import { createContext } from 'react'

export const Context = createContext<any>(undefined)

export const { Provider, Consumer } = Context
