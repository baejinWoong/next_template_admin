import React from 'react'
import defaultPallettes, { I_colorType, fontClassSet } from '@core/pallettes'

interface I_typographyProps extends React.HTMLAttributes<HTMLSpanElement> {
  fontSize?: 'title1' | 'title2' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'element1' | 'element2'
  children?: React.ReactNode
  type?: 'primary' | 'secondary' | 'disabled'
  color?: I_colorType['color']
  colorWeight?: I_colorType['colorWeight']
  wrap?: 'p' | 'span'
}

/**
 * @param wrap Typography html tag select p or span
 */
const Typography = (props: I_typographyProps) => {
  const { fontSize = 'body1', type = 'secondary', color = 'black', colorWeight, ...typoProps } = props
  const getPallette = defaultPallettes({ type, color, colorWeight })
  const defaultProps = {
    ...typoProps,
    style: {
      ...props.style,
      color: getPallette.color,
    },
  }

  if (props.type) {
    defaultProps.style.backgroundColor = getPallette.backgroundColor
  }

  if (props.wrap === 'p') {
    return (
      <p className={fontClassSet[fontSize]} {...defaultProps}>
        {props.children}
      </p>
    )
  }
  return (
    <span className={fontClassSet[fontSize]} {...defaultProps}>
      {props.children}
    </span>
  )
}

export default Typography
