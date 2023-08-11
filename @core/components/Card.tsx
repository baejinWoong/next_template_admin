import defaultPallettes, { I_colorType } from '@core/pallettes'
import React from 'react'

/**
 *
 */

interface I_card extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode | React.ReactNode[]
  color?: I_colorType['color']
  colorWeight?: I_colorType['colorWeight']
  type?: 1 | 2
}

const Card = (props: I_card) => {
  const { color = 'white', colorWeight = 'default', ...cardProps } = props
  const getPallette = defaultPallettes({ type: 'primary', color, colorWeight })

  const defaultProps = {
    ...cardProps,
    style: {
      ...props.style,
      color: getPallette.color,
    },
  }

  if (color || colorWeight) {
    defaultProps.style.backgroundColor = getPallette.backgroundColor
  }

  return <div className={`gridSet type0${props.type ?? 1}`} {...defaultProps} />
}

export default Card
