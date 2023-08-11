import React from 'react'
import Header from '../Header'
import AlertModal from 'components/modal/AlertModal'
import Loader from 'components/modal/Loader'
import ConfirmModal from 'components/modal/ConfirmModal'
import useAxiosInterceptor from '@core/hooks/useAxiosInterceptor'
import PageHeader from '../PageHeader'

interface I_layoutProps {
  children: React.ReactElement | React.ReactElement[] | React.ReactNode
}

const VerticalLayoutWrapper = ({ children }: I_layoutProps) => {
  return <div style={{ height: '100%', display: 'flex' }}>{children}</div>
}

const MainContentWrapper = ({ children }: I_layoutProps) => {
  return <div style={{ flexGrow: 1, minWidth: 0, display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>{children}</div>
}

const ContentWrapper = ({ children }: I_layoutProps) => {
  return (
    <main
      style={{
        flexGrow: 1,
        width: '100%',
        transition: 'padding .25s ease-in-out',
        maxWidth: '100%',
        margin: '80px auto 0',
        padding: '20px 180px 50px',
        position: 'relative',
      }}
    >
      {children}
    </main>
  )
}

const Layout = (props: I_layoutProps) => {
  useAxiosInterceptor()

  const { children } = props

  return (
    <>
      <VerticalLayoutWrapper>
        <Header />
        <MainContentWrapper>
          <ContentWrapper>
            <PageHeader />
            {children}
          </ContentWrapper>
        </MainContentWrapper>
      </VerticalLayoutWrapper>
      <AlertModal />
      <ConfirmModal />
      <Loader />
    </>
  )
}

export default Layout
