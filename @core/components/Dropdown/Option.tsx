import React from 'react'
import DropdownContext from '@core/components/Dropdown/context'

interface I_option {
  value: string | number
  children: string | number
}

export const Option = (props: I_option) => {
  const { value, onSelectValue, setInitValue } = React.useContext(DropdownContext)

  const clickOptionHandler = React.useCallback(() => {
    onSelectValue?.(props.value, props.children)
  }, [onSelectValue, props.children, props.value])

  React.useLayoutEffect(() => {
    if (value === props.value) setInitValue?.(props.value, props.children)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value, value])

  return <li onClick={clickOptionHandler}>{props.children}</li>
}

export default Option
