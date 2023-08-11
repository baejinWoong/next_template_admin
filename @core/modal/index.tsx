import React from 'react'
import ReactDOM from 'react-dom'

interface I_modalProps {
  open: boolean
  children?: React.ReactNode
}

/**
 * @param open isOpen Modal boolean, Default: false
 */
const Modal = ({ open, children }: I_modalProps) => {
  React.useEffect(() => {
    const isAnotherModal = document.getElementsByClassName('modalWrap').length > 0
    const isHeader = document.body.getElementsByTagName('header').length > 0
    const isScroll = document.body.offsetHeight > window.innerHeight
    if (open) {
      document.body.style.overflow = 'hidden'
      if (isHeader && isScroll) {
        document.body.style.paddingRight = '15px'
        document.body.getElementsByTagName('header')[0].style.paddingRight = '55px'
      }
    } else if (!isAnotherModal) {
      document.body.style.removeProperty('overflow')
      if (isHeader && isScroll) {
        document.body.style.removeProperty('padding-right')
        document.body.getElementsByTagName('header')[0].style.removeProperty('padding-right')
      }
    }
  }, [open])

  if (open) {
    const el = document.body
    return ReactDOM.createPortal(
      <div
        className="modalWrap"
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        <div className="modalLayout">{children}</div>
        <span className="dim" />
      </div>,
      el,
    )
  } else return null
}

export default Modal
