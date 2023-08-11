import React from 'react'
import defaultPallettes from '@core/pallettes'

/**
 *
 */

interface I_tableRow extends React.TableHTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
  hover?: boolean
  hoverColor?: 'black' | 'purple' | 'red' | 'white'
}

const TableRow = (props: I_tableRow) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { hoverColor = 'black', hover, ...trprops } = props
  const style: React.CSSProperties = {
    ...props.style,
    cursor: hover ? 'pointer' : 'auto',
  }
  const trProps = {
    ...trprops,
    style,
  }
  const getPallette = defaultPallettes({ type: 'table', color: hoverColor })

  const hoverHandler = (event: React.MouseEvent<HTMLTableRowElement>) => {
    event.currentTarget.style.backgroundColor = getPallette.hover?.backgroundColor ?? ''
  }
  const mouthLeaveHandler = (event: React.MouseEvent<HTMLTableRowElement>) => {
    const target = event.currentTarget
    target.style.backgroundColor = getPallette.backgroundColor
  }

  return (
    <tr {...trProps} onMouseOver={hover ? hoverHandler : undefined} onMouseLeave={hover ? mouthLeaveHandler : undefined}>
      {props.children}
    </tr>
  )
}

export default TableRow
