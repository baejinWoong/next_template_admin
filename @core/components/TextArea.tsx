import React from 'react'

interface I_textAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  addOn?: {
    textCount: boolean
  }
}

/**
 *
 */
const TextArea = (props: I_textAreaProps) => {
  const { maxLength, onChange, addOn, ...textAreaProps } = props
  const [textLength, setTextLength] = React.useState<number>(0)

  const changeTextAreaHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(event)
    setTextLength(event.currentTarget.value.length)
  }

  return (
    <div className="textAreaModule">
      <div className={`textAreaWrap${textAreaProps.disabled ? ' disabled' : ''}`}>
        <textarea onChange={changeTextAreaHandler} {...textAreaProps} maxLength={maxLength} />
      </div>
      {addOn && (
        <div className="addOnWrap">
          {addOn.textCount && (
            <div className="textCountAddOn">
              (<span>{textLength}</span> / <span>{maxLength}</span>)
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TextArea
