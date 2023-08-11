import React from 'react'

interface I_tabArea {
  isActive: boolean
  children: React.ReactNode | React.ReactNode[] | React.ReactElement[]
}

/**
 *
 */
const TabArea = (props: I_tabArea) => {
  const { isActive, children } = props
  return <div style={{ height: !isActive ? '0' : '', width: '100%', overflow: !isActive ? 'hidden' : '' }}>{children}</div>
}

export default TabArea
