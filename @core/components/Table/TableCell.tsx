import TableContext from '@core/components/Table/context'
import React, { useContext, useRef, useState } from 'react'

/**
 *
 */

interface I_tableCell
  extends React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>,
    React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement> {
  children: React.ReactNode
  width?: string | number
  order?: boolean
  orderButtonCallback?: () => 'asc' | 'desc'
  align?: 'left' | 'center' | 'right'
}

const TableCell = (props: I_tableCell) => {
  const { children, width, orderButtonCallback, align, ...tableProps } = props

  const [order, setOrder] = useState<'asc' | 'desc' | ''>('')
  const { active, type, setActive } = useContext(TableContext)

  const ref = useRef<HTMLTableCellElement | null>(null)

  const clickOrderHander = () => {
    setOrder((prevState) => {
      if (prevState === 'asc') return 'desc'
      return 'asc'
    })
    if (setActive) setActive(ref)
  }

  const isActive = active === ref && props.order

  switch (type) {
    case 'header':
      return (
        <>
          <th className={`${isActive ? 'active' : ''} ${alignSet[props.align ?? 'left']}`} ref={ref} style={{ width: props.width }}>
            {props.order ? (
              <span onClick={clickOrderHander} style={{ cursor: 'pointer' }}>
                {props.children}
              </span>
            ) : (
              <span>{props.children}</span>
            )}

            {props.order && (
              <div className="tableButton">
                <button type="button" className={`tableButtonTop${isActive && order === 'asc' ? ' active' : ''}`} value="asc">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 5">
                    <path d="M1.04 4.703a.5.5 0 0 1-.39-.812L3.61.19a.5.5 0 0 1 .78 0l2.96 3.7a.5.5 0 0 1-.39.812H1.04Z" />
                  </svg>
                </button>
                <button type="button" className={`tableButtonTop${isActive && order === 'desc' ? ' active' : ''}`} value="desc">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentcolor" viewBox="0 0 8 5">
                    <path d="M6.96.297a.5.5 0 0 1 .39.812l-2.96 3.7a.5.5 0 0 1-.78 0l-2.96-3.7a.5.5 0 0 1 .39-.812h5.92Z" />
                  </svg>
                </button>
              </div>
            )}
          </th>
        </>
      )
    case 'body':
      return (
        <td className={`${alignSet[props.align ?? 'left']}`} width={props.width} {...tableProps}>
          {props.children}
        </td>
      )
    default:
      return <td width={props.width}>{props.children}</td>
  }
}

export default TableCell

const alignSet = {
  left: 'alignLeft',
  center: 'alignCenter',
  right: 'alignRight',
}
