import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import type { NextPage } from 'next'
import { AppProps } from 'next/app'

import { RecoilRoot } from 'recoil'

import '../styles/globals.scss'
import Layout from 'components/common/layout/Layout'
import { useRouter } from 'next/router'

interface I_extendedAppProps extends AppProps {
  Component: NextPage
}

const App = (props: I_extendedAppProps) => {
  const { Component, pageProps } = props
  const [isJwt, setIsJwt] = useState(false)
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>)

  const router = useRouter()

  useEffect(() => {
    if (!window.sessionStorage.getItem('Authorization')) void router.replace('/login')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setIsJwt(!!window.sessionStorage.getItem('Authorization'))
  }, [router])

  return (
    <>
      <Head>
        <link rel="icon" type="image/x-icon" href="/images/FAVI.png"></link>
        <title>NON CRYPTO ADMIN</title>
      </Head>
      <RecoilRoot>{(isJwt || router.asPath === '/login') && getLayout(<Component {...pageProps} />)}</RecoilRoot>
    </>
  )
}

export default App
