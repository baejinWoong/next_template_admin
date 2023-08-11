import React, { useLayoutEffect, useState } from 'react'

/**
 *
 */

interface I_radioProps extends React.HtmlHTMLAttributes<HTMLInputElement> {
  value?: string | number
  onChange?: (event: React.FormEvent<HTMLInputElement>) => void
  color?: 'white' | 'black'
  size?: 'small' | 'large'
  label?: string
  group: string
  readOnly?: boolean
  checked?: boolean
}

const Radio = (props: I_radioProps) => {
  const [key, setkey] = useState('')

  const { value, onChange, color, size, label, group, ...inputProps } = props

  useLayoutEffect(() => {
    setkey(Math.random().toString().replace('0.', ''))
  }, [])

  return (
    <span className={`inpRadio ${fontSet[size ?? 'small']} ${color ?? ''}`}>
      <input type="radio" name={`rdo_${group}`} id={`rdo_${key}`} onChange={onChange} defaultValue={value} {...inputProps} />
      <label htmlFor={`rdo_${key}`}>{label ?? value ?? ''}</label>
    </span>
  )
}

export default Radio

const fontSet = {
  small: 'fontSize14',
  large: 'fontSize16',
}
