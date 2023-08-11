import React from 'react'

import Modal from '@core/modal'

// recoil Import
import { useRecoilState } from 'recoil'
import { loaderModalRecoil } from '../../recoil/atom'

const Loader = () => {
  const [loaderState] = useRecoilState(loaderModalRecoil)

  return (
    <Modal open={loaderState.isOpen}>
      <span className="loader" />
    </Modal>
  )
}

export default Loader
