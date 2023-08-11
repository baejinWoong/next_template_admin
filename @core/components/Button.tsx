import React from 'react'
import defaultPallettes, { I_colorType, fontClassSet } from '@core/pallettes'

interface I_buttonProps extends React.HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean
  type?: 'primary' | 'secondary' | 'disabled'
  color?: I_colorType['color']
  fontSize?: 'title1' | 'title2' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'element1' | 'element2'
  size?: 'minimum' | 'small' | 'middum' | 'large' | 'auto' | 'iconOnly'
  widthSize?: 'small' | 'middum' | 'fullwide'
  iconSize?: 'small' | 'large'
  children?: React.ReactNode
  afterTagNode?: React.ReactNode
}

/**
 * @param fontSize button text fontSize same typography component
 * @param afterTagNode button afterIcon, use .svg
 * @param iconSize if you use afterTagNode, this param set afterTagNode size
 */
const Button: React.FC<I_buttonProps> = (props: I_buttonProps) => {
  const { type, color, fontSize, size = 'middum', iconSize = 'large', widthSize = 'fullwide', afterTagNode, onClick, ...defaultProps } = props
  const getPallette = defaultPallettes({ type, color })
  const paddingSize = size === 'iconOnly' && iconSize === 'large' ? 'small' : size ?? 'middum'
  const buttonProps = {
    ...defaultProps,
    style: {
      ...props.style,
      backgroundColor: getPallette.backgroundColor,
      border: `1px solid ${getPallette.color}`,
    },
  }
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const hoverHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (buttonRef.current) {
      buttonRef.current.style.backgroundColor = getPallette.hover?.backgroundColor ?? getPallette.backgroundColor
      buttonRef.current.style.color = getPallette.hover?.color ?? getPallette.color
      buttonRef.current.style.border = `1px solid ${getPallette.hover?.color ?? getPallette.color}`
    }
    props.onMouseEnter?.(event)
  }
  const hoverLeaveHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (buttonRef.current) {
      buttonRef.current.style.backgroundColor = getPallette.backgroundColor
      buttonRef.current.style.color = getPallette.color
    }
    props.onMouseLeave?.(event)
  }

  const clickHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation()
    if (!props.disabled) onClick?.(event)
    event.currentTarget.blur()
  }

  return (
    <button
      type="button"
      className={`button ${widthSet[widthSize ?? size]} ${heightSet[size]} ${paddingSet[paddingSize]}`}
      onClick={clickHandler}
      {...buttonProps}
      onMouseEnter={hoverHandler}
      onMouseLeave={hoverLeaveHandler}
      ref={buttonRef}
    >
      {props.children && (
        <span className={fontSize ? fontClassSet[fontSize] : fontSet[size]} style={{ color: getPallette.color }}>
          {props.children}
        </span>
      )}
      {props.afterTagNode && (
        <i className={iconSizeSet[iconSize]} style={{ ...iconWrapSet[iconSize], color: getPallette.color }}>
          {props.afterTagNode}
        </i>
      )}
      {/* 
        가로사이즈 : width240 | width160 | width120 | width80 | widthAuto
        높이사이즈 : height56 | height48 | height44 | height34
        여백 : paddingRow20 | paddingRow14 | paddingRow12 | paddingRow07
        아이콘사이즈 : iconSize24 | iconSize20
      */}
    </button>
  )
}

export default Button

const iconSizeSet = {
  small: 'iconSize20',
  large: 'iconSize24',
}

const widthSet = {
  minimum: 'widthAuto',
  small: 'widthAuto',
  middum: 'widthAuto',
  large: 'widthAuto',
  auto: 'widthAuto',
  iconOnly: 'widthAuto',
  fullwide: 'widthFull',
}

const heightSet = {
  minimum: 'height34',
  small: 'height44',
  middum: 'height48',
  large: 'height56',
  auto: '',
  iconOnly: 'height48',
  fullwide: 'height56',
}

const paddingSet = {
  minimum: 'paddingRow07',
  small: 'paddingRow12',
  middum: 'paddingRow14',
  large: 'paddingRow20',
  auto: 'paddingRow12',
  iconOnly: 'paddingRow07',
  fullwide: '',
}

const fontSet = {
  minimum: fontClassSet.element1,
  small: fontClassSet.body2,
  middum: fontClassSet.body2,
  large: fontClassSet.body2,
  auto: fontClassSet.body2,
  iconOnly: '',
  fullwide: '',
}

const iconWrapSet = {
  small: {
    height: '20px',
  },
  large: {
    height: '24px',
  },
}
