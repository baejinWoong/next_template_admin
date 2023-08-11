import { useEffect } from 'react'

// recoil Import
import { useRecoilState } from 'recoil'
import { alertModalRecoil, confirmModalRecoil, loaderModalRecoil } from 'recoil/atom'
import { alertModalState, confirmModalState } from 'recoil/defaultValue'

const useIsModalKeyDown = (callBack: () => void, depth: any[] = []) => {
  const [alertState, setAlertState] = useRecoilState(alertModalRecoil)
  const [confirmState, setConfirmState] = useRecoilState(confirmModalRecoil)
  const [loaderState] = useRecoilState(loaderModalRecoil)

  useEffect(() => {
    const isOpen = alertState.isOpen || confirmState.isOpen || loaderState.isOpen
    const enterKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (!isOpen) {
          callBack()
        } else if (alertState.isOpen) {
          alertState.clickButtonCallback?.()
          setAlertState(alertModalState)
        } else if (confirmState.isOpen) {
          confirmState.completeButtonCallback?.()
          setConfirmState(confirmModalState)
        }
      }
    }

    window.document.addEventListener('keypress', enterKeydown)
    return () => {
      window.document.removeEventListener('keypress', enterKeydown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, depth.concat([alertState.isOpen, confirmState.isOpen, loaderState.isOpen]))
}

export default useIsModalKeyDown
