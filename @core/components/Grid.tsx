import defaultPallettes, { I_colorType } from '@core/pallettes'
import React from 'react'

interface I_grid {
  children?: React.ReactNode | React.ReactNode[]
  type?: 'container' | 'item'
  color?: I_colorType['color']
  colorWeight?: I_colorType['colorWeight']
  area?: number
  align?: 'left' | 'center' | 'right'
  horizen?: 'top' | 'center' | 'bottom'
  style?: React.CSSProperties
}

interface I_gridStype {
  container: React.CSSProperties
  item: React.CSSProperties
}

/**
 * @param area 1~24 default 24 grid flex area(full area is 24)
 * @param align container grid children align
 */
const Grid = (props: I_grid) => {
  const { color = 'white', horizen = 'top', colorWeight = 'default' } = props
  const getPallette = defaultPallettes({ type: 'primary', color, colorWeight })
  const getTypeItemHorizen = () => {
    switch (horizen) {
      case 'top':
        return 'flex-start'
      case 'center':
        return 'center'
      default:
        return 'flex-end'
    }
  }
  const gridStyle: I_gridStype = {
    container: {
      justifyContent: props.align ?? 'left',
      alignItems: props.horizen ?? 'auto',
    },
    item: {
      flexBasis: `${(100 / 24) * (props.area ?? 24)}%`,
      maxWidth: `${(100 / 24) * (props.area ?? 24)}%`,
      textAlign: props.align ?? 'left',
      alignSelf: props.horizen ? getTypeItemHorizen() : 'auto',
    },
  }
  const colorStyle: React.CSSProperties = {
    backgroundColor: props.color ? getPallette.backgroundColor : undefined,
  }

  return (
    <div className={typeSet[props.type ?? 'item']} style={{ ...gridStyle[props.type ?? 'item'], ...colorStyle, ...props.style }}>
      {props.children}
    </div>
  )
}

export default Grid

const typeSet = {
  container: 'gridContainer',
  item: 'gridItem',
}
