import defaultPallettes, { I_colorType } from '@core/pallettes'
import React, { useState } from 'react'

/**
 *
 */

interface I_switchProps {
  value?: boolean
  disabled?: boolean
  onChange?: (value: boolean) => void
  type?: 'primary' | 'secondary' | 'disabled'
  color?: I_colorType['color']
}

const Switch = (props: I_switchProps) => {
  const [is, setIs] = useState<boolean>(props.value ?? false)

  const getPallette = defaultPallettes({ type: props.type, color: props.color })

  const switchClickHandler = () => {
    if (!props.disabled) {
      setIs((prevState) => !prevState)
      props.onChange?.(!is)
    }
  }

  React.useEffect(() => {
    setIs(props.value ?? false)
  }, [props.value])

  return (
    <div className={`switch${(is && ' active') || ''}`} style={(is && { backgroundColor: getPallette.backgroundColor }) || {}} onClick={switchClickHandler}>
      <span></span>
    </div>
  )
}

export default Switch
