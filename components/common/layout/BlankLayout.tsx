import AlertModal from 'components/modal/AlertModal'
import ConfirmModal from 'components/modal/ConfirmModal'
import Loader from 'components/modal/Loader'
import useAxiosInterceptor from '@core/hooks/useAxiosInterceptor'
import React, { ReactNode } from 'react'

interface I_props {
  children: ReactNode
}

/**
 *
 */
const BlankLayout = (props: I_props) => {
  useAxiosInterceptor()

  const { children } = props

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      {children}
      <Loader />
      <ConfirmModal />
      <AlertModal />
    </div>
  )
}

export default BlankLayout
