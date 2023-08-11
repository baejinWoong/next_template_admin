import Button from '@core/components/Button'
import Card from '@core/components/Card'
import CheckBox from '@core/components/CheckBox'
import Grid from '@core/components/Grid'
import Input from '@core/components/Input'
import Typography from '@core/components/Typography'
import BlankLayout from 'components/common/layout/BlankLayout'
import { useRouter } from 'next/router'
import React, { ChangeEvent, ReactNode, useEffect, useState } from 'react'

import { CloseEyeSvg, OpenEyeSvg } from '@core/icons'
import { postSignIn } from 'api/adminApi'
import useIsModalKeyDown from '@core/hooks/useIsModalKeyDown'
import UpdatePasswordModal from 'components/modal/UpdatePasswordModal'
import { NextPage } from 'next'
import { useRecoilState } from 'recoil'
import { alertModalRecoil } from 'recoil/atom'
import { checkedRegType } from 'utils'

// import { useRecoilState } from 'recoil'
// import { loaderModalRecoil } from 'recoil/atom'

interface I_state {
  email: string
  password: string
}

interface I_isView {
  showPassword: boolean
}

/**
 *
 */
const Index: NextPage = () => {
  // ** State
  const [values, setValues] = useState<I_state>({
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = React.useState<I_isView>({
    showPassword: false,
  })

  const [isOpenPassModal, setIsOpenPassModal] = useState(false)
  const [isSaveEmail, setIsSaveEmail] = useState(false)
  const [, setAlertModalState] = useRecoilState(alertModalRecoil)

  // const [, setLoaderState] = useRecoilState(loaderModalRecoil)

  // ** Hook
  const router = useRouter()

  const loginFormChangeHandler = (prop: keyof I_state) => (event: ChangeEvent<HTMLInputElement>) => {
    if (window.localStorage.getItem('saveEmail') === 'true' && prop === 'email') {
      window.localStorage.setItem('saveEmailValue', event.target.value)
    }
    setValues((prev) => ({ ...prev, [prop]: event.target.value }))
  }

  const handleClickShowPassword = () => {
    setShowPassword({ showPassword: !showPassword.showPassword })
  }

  // const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   event.preventDefault()
  // }

  const checkValues = () => {
    if (!values.email) {
      setAlertModalState({
        alertText: '아이디를 입력해주세요.',
        isOpen: true,
      })
      return false
    } else if (!checkedRegType(values.email, 'email')) {
      setAlertModalState({
        alertText: '아이디는 id@elwide.com 형태로 입력해 주세요.',
        isOpen: true,
      })
    } else if (!values.password) {
      setAlertModalState({
        alertText: '비밀번호를 입력해주세요.',
        isOpen: true,
      })
    } else return true
  }

  const loginHandler = () => {
    if (checkValues())
      void postSignIn(values)
        .then((response) => {
          if (['E20003'].find((code) => code === response.data?.status?.code)) {
            window.sessionStorage.setItem('loginUserInfo', JSON.stringify({ ...response.data?.data, email: values.email }))

            if (response.data?.data.isFirst) setIsOpenPassModal(true)
            else void router.push('/')
          }
        })
        .catch(() => {
          setAlertModalState({
            alertText: '아이디/비밀번호 불일치\n 비밀번호 5회 오류 시 사용이 중지됩니다.',
            isOpen: true,
          })
        })
  }

  const changeSaveIdHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      window.localStorage.setItem('saveEmail', 'true')
      window.localStorage.setItem('saveEmailValue', values.email)
    } else {
      window.localStorage.setItem('saveEmail', 'false')
      window.localStorage.removeItem('saveEmailValue')
    }
    setIsSaveEmail(event.target.checked)
  }

  useIsModalKeyDown(() => {
    if (!isOpenPassModal) loginHandler()
  }, [values, router])

  useEffect(() => {
    if (window.localStorage.getItem('saveEmail') === 'true') {
      setValues({ ...values, email: window.localStorage.getItem('saveEmailValue') ?? '' })
      setIsSaveEmail(true)
    }
    window.sessionStorage.clear()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card type={1} style={{ width: '400px' }}>
      <Grid type="container">
        <Grid type="item">
          <Typography fontSize="subtitle2" color="purple">
            Admin Login
          </Typography>
        </Grid>
        <Grid type="item" style={{ marginTop: '24px' }}>
          <Input placeholder="아이디" type="text" value={values.email} onChange={loginFormChangeHandler('email')} />
        </Grid>
        <Grid type="item" style={{ marginTop: '16px' }}>
          <Input
            placeholder="비밀번호"
            type={showPassword.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={loginFormChangeHandler('password')}
            afterTagNode={<button onClick={handleClickShowPassword}>{showPassword.showPassword ? OpenEyeSvg : CloseEyeSvg}</button>}
          />
        </Grid>
        <Grid type="item" style={{ marginTop: '16px' }}>
          <CheckBox label="ID 저장" size="large" onChange={(event) => changeSaveIdHandler(event)} checked={isSaveEmail} />
        </Grid>
        <Grid type="item" style={{ marginTop: '40px' }}>
          <Button size="middum" fontSize="body2" onClick={loginHandler}>
            로그인
          </Button>
        </Grid>
      </Grid>
      <UpdatePasswordModal isOpen={isOpenPassModal} setIsOpen={setIsOpenPassModal} userInfo={values} />
    </Card>
  )
}

Index.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Index
