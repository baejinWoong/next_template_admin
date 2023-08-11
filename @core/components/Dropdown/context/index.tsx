import React from 'react'

interface I_dropdownContext {
  value: string | number
  onSelectValue?: (value: string | number, name: string | number) => void
  setInitValue?: (value: string | number, name: string | number) => void
}

export default React.createContext<I_dropdownContext>({ value: '' })
