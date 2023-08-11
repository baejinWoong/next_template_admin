import React from 'react'
import ReactDOM from 'react-dom'
import Card from '../Card'

interface I_modalProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  children?: React.ReactNode
  targetRef: React.RefObject<HTMLElement>
}

/**
 *
 */
const Index = ({ open, setOpen, children, targetRef }: I_modalProps) => {
  const popOverRef = React.useRef<HTMLDivElement>(null)
  const dimClick = () => {
    setOpen(false)
  }
  React.useEffect(() => {
    const isAnotherModal = document.getElementsByClassName('modalWrap').length > 1
    if (open) {
      document.body.style.overflow = 'hidden'
      if (popOverRef.current && targetRef.current) {
        popOverRef.current.style.top = `${targetRef.current.offsetTop + targetRef.current.offsetHeight}px`
        popOverRef.current.style.left = `${targetRef.current.offsetLeft + 5}px`
      }
    } else if (!isAnotherModal) {
      document.body.style.removeProperty('overflow')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (open) {
    const el = document.body
    return ReactDOM.createPortal(
      <div
        className="popOverWrap"
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        <div className="popOverLayout" ref={popOverRef}>
          <Card type={2}>{children}</Card>
        </div>
        <span className="dim" onClick={dimClick} />
      </div>,
      el,
    )
  } else return null
}

export default Index
