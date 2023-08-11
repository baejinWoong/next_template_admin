import React, { useRef, useState } from 'react'
import DropdownContext from '@core/components/Dropdown/context'

interface I_dropdown {
  children?: React.ReactNode | React.ReactNode[]
  onChange?: (state: string | number) => void
  size?: 'small' | 'large' | 'auto'
  type?: '1' | '2'
  value?: string | number
  readOnly?: boolean
  label?: string
}

/**
 * @param onChange dropdown option click event callback function
 * @param size dropdown width size
 * @param type dropdown height size type
 * params have dropdown value
 */
const Dropdown = (props: I_dropdown) => {
  const { size, type, value = '', onChange, children } = props

  const [name, setName] = useState<string | number>('')
  const [clickTarget, setClickTarget] = useState<{
    name: string | number
    value: string | number
  }>()
  const [currentClickTarget, setCurrentClickTarget] = useState<{
    name: string | number
    value: string | number
  }>()

  const [isFocus, setIsFocus] = useState<boolean>(false)
  const [isCheckedFocus, setIsCheckedFocus] = useState<boolean>(false)

  const ref = useRef<HTMLDivElement | null>(null)
  const dropdownRef = useRef<HTMLOListElement | null>(null)

  const changeActiveHandler = (targetValue: string | number, targetName: string | number) => {
    setCurrentClickTarget({ name: targetName, value: targetValue })
    onChange?.(targetValue)
    ref.current?.blur()
  }

  const initTargetSetHandler = (targetValue: string | number, targetName: string | number) => {
    setClickTarget({ name: targetName, value: targetValue })
  }

  const mouthDownHandler = (event: React.MouseEvent) => {
    setIsFocus(document.activeElement === ref.current)
  }

  const mouthUpHandler = (event: React.MouseEvent) => {
    if (isFocus && isCheckedFocus) ref.current?.blur()
  }

  const mouthOverHandler = (event: React.MouseEvent) => {
    setIsCheckedFocus(true)
  }

  const mouthLeaveHandler = (event: React.MouseEvent) => {
    setIsCheckedFocus(false)
  }

  const onBlurHandler = (event: React.FocusEvent) => {
    const target = dropdownRef.current as HTMLOListElement
    target.scrollTo(0, 0)
  }

  const scrollDropDownBubbleDiff = (event: WheelEvent) => {
    event.preventDefault()
  }

  const scrollDropDownEvent = (event: React.WheelEvent<HTMLOListElement>) => {
    const targetEl = event.currentTarget as HTMLElement
    const TargetScrollY = targetEl.scrollTop
    targetEl.scrollTo({ top: TargetScrollY + event.deltaY, behavior: 'smooth' })
  }

  React.useEffect(() => {
    setClickTarget(currentClickTarget)
  }, [value])

  React.useEffect(() => {
    const target = dropdownRef.current as HTMLOListElement
    target.addEventListener('wheel', scrollDropDownBubbleDiff, { passive: false })
    return () => {
      target.removeEventListener('wheel', scrollDropDownBubbleDiff)
    }
  }, [])

  React.useEffect(() => {
    if (value) {
      if (clickTarget?.value.toString() === value.toString()) {
        setName(clickTarget.name)
      }
    } else {
      setName(clickTarget?.name ?? '')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, clickTarget])

  return (
    <div>
      {props.label ?? <span>{props.label}</span>}
      <div
        className={`dropDown type0${type ?? '2'} ${sizeSet[size ?? 'auto']}${props.readOnly ? ' readOnly' : ''}`}
        tabIndex={props.readOnly ? undefined : 0}
        ref={ref}
        onMouseDown={mouthDownHandler}
        onMouseUp={mouthUpHandler}
        onBlur={onBlurHandler}
      >
        <DropdownContext.Provider value={{ value, onSelectValue: changeActiveHandler, setInitValue: initTargetSetHandler }}>
          <strong className="selected" onMouseOver={mouthOverHandler} onMouseOut={mouthLeaveHandler}>
            {name}&nbsp;
          </strong>
          <ol ref={dropdownRef} className="dropDownList" onWheel={scrollDropDownEvent}>
            {children}
          </ol>
        </DropdownContext.Provider>
      </div>
    </div>
  )
}

export default Dropdown

const sizeSet = {
  small: 'width88',
  large: 'width172',
  auto: '',
}
