import React, { useState } from 'react'
import TableContext from '@core/components/Table/context'

/**
 * @param children children only use TableCell
 */

interface I_tableBody {
  children: React.ReactNode
}

const TableBody = (props: I_tableBody) => {
  const [active, setActive] = useState<React.MutableRefObject<HTMLTableCellElement | null>>()
  return (
    <tbody>
      <TableContext.Provider value={{ active, type: 'body', setActive }}>{props.children}</TableContext.Provider>
    </tbody>
  )
}

export default TableBody
