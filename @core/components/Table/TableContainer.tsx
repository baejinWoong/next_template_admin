import React from 'react'

/**
 *
 */

interface I_tableContainer extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode
}

const TableContainer = (props: I_tableContainer) => {
  const { children, style, ...tableProps } = props
  return (
    <div style={{ width: '100%', overflowX: 'auto', ...style }}>
      <table className="tableBasic" {...tableProps}>
        {children}
      </table>
    </div>
  )
}

export default TableContainer
