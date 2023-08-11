import React from 'react'

/**
 *
 */

interface I_input extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'password' | 'tel'
  afterTagNode?: React.ReactNode
  label?: string
  state?: 'error' | 'success'
  stateText?: string
}

const Input = (props: I_input) => {
  const { afterTagNode, label, state, stateText, ...inputProps } = props
  return (
    <div className={`inputText${state === 'error' ? ' typeError' : ''}${state === 'success' ? ' typeSuccess' : ''}${props.afterTagNode ? ' afterTags' : ''}`}>
      {label && <span style={{ marginBottom: '4px', display: 'block', color: '#000000' }}>{label}</span>}
      <div className="inputWrap">
        <input type={props.type} {...inputProps} />
        <div className="inputIcon" style={{ display: afterTagNode ? 'block' : 'none' }}>
          {afterTagNode}
        </div>
      </div>
      <div className="inputStateText">
        <p className={state === 'error' ? ' errorText' : state === 'success' ? ' successText' : ''}>{stateText}</p>
      </div>
    </div>
  )
}

export default Input
