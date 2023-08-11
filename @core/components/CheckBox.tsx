import React, { useLayoutEffect, useState } from 'react'

interface I_checkBoxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'large' | 'small'
  label?: string
}

/**
 *
 */
const CheckBox = (props: I_checkBoxProps) => {
  const [key, setkey] = useState('')

  const { label, size, ...inputProps } = props
  const isReadOnly = props.readOnly ?? false
  const isDisabled = props.disabled ?? false

  const onClickHandler = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation()
  }

  useLayoutEffect(() => {
    setkey(Math.random().toString().replace('0.', ''))
  }, [])

  return (
    <span className={`inpCheckBox${size ? ` fontSize${sizeConvert[size]}` : ''}`} onClick={onClickHandler}>
      <input type="checkbox" id={`checkbox_${key}`} readOnly={isReadOnly} disabled={isDisabled} checked={props.checked} {...inputProps} />
      <label htmlFor={`checkbox_${key}`}>{label && <span>{label}</span>}</label>
    </span>
  )
}

export default CheckBox

const sizeConvert = {
  large: 16,
  small: 14,
}
