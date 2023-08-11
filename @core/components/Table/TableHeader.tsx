import React, { useState } from 'react'
import TableContext from '@core/components/Table/context'

/**
 * @param children children only use TableCell
 */

interface I_tableHeader {
  children: React.ReactNode
}

const TableHeader = (props: I_tableHeader) => {
  const [active, setActive] = useState<React.MutableRefObject<HTMLTableCellElement | null>>()
  return (
    <thead>
      <TableContext.Provider value={{ active, type: 'header', setActive }}>{props.children}</TableContext.Provider>
    </thead>
  )
}

export default TableHeader
