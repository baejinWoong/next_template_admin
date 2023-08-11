import React from 'react'

interface I_tableContext {
  active?: React.MutableRefObject<HTMLTableCellElement | null>
  type: string
  setActive?: (state: React.MutableRefObject<HTMLTableCellElement | null>) => void
}

export default React.createContext<I_tableContext>({
  type: '',
})
