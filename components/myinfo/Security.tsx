import Button from '@core/components/Button'
import Card from '@core/components/Card'
import Grid from '@core/components/Grid'
import Input from '@core/components/Input'
import Typography from '@core/components/Typography'
import useIsModalKeyDown from '@core/hooks/useIsModalKeyDown'
import { CloseEyeSvg, OpenEyeSvg } from '@core/icons'
import { putMemberPassword } from 'api/adminApi'

import { useRouter } from 'next/router'
import React from 'react'
import { useRecoilState } from 'recoil'
import { alertModalRecoil } from 'recoil/atom'

interface I_state {
  newPassword: string
  password: string
  newPasswordCheck: string
}

interface I_isView {
  showPassword: boolean
  showNewPassword: boolean
  showNewPasswordCheck: boolean
}

/**
 *
 */
const Security = () => {
  const [password, setPassword] = React.useState<I_state>({
    password: '',
    newPassword: '',
    newPasswordCheck: '',
  })

  const [showPassword, setShowPassword] = React.useState<I_isView>({
    showPassword: false,
    showNewPassword: false,
    showNewPasswordCheck: false,
  })

  const [isSame, setisSame] = React.useState<boolean | null>(null)

  const [alertState, setAlertState] = useRecoilState(alertModalRecoil)

  const router = useRouter()

  // Handle Current Password
  const handlepasswordChange = (prop: keyof I_state) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const targetValue = event.target.value
    setPassword({ ...password, [prop]: targetValue })
  }
  const handleClickshowPassword = () => {
    setShowPassword({ ...showPassword, showPassword: !showPassword.showPassword })
  }
  const handleMouseDownpassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  // Handle New Password
  const handleNewPasswordChange = (prop: keyof I_state) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const targetValue = event.target.value
    if (event.target.value) {
      switch (prop) {
        case 'newPassword':
          if (targetValue !== password.newPasswordCheck) {
            setisSame(false)
          } else {
            setisSame(true)
          }
          break
        case 'newPasswordCheck':
          if (targetValue !== password.newPassword) {
            setisSame(false)
          } else {
            setisSame(true)
          }
          break

        default:
          break
      }
    } else {
      setisSame(null)
    }
    setPassword({ ...password, [prop]: targetValue })
  }
  const handleClickShowNewPassword = () => {
    setShowPassword({ ...showPassword, showNewPassword: !showPassword.showNewPassword })
  }
  const handleMouseDownNewPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }
  const handleClickshowNewPasswordCheck = () => {
    setShowPassword({ ...showPassword, showNewPasswordCheck: !showPassword.showNewPasswordCheck })
  }
  const handleMouseDownNewPasswordCheck = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const updatePaswordHandler = () => {
    if (passwordTestReg.test(password.newPassword) && passwordTestReg.test(password.newPasswordCheck)) {
      if (password.newPassword === password.newPasswordCheck) {
        void putMemberPassword(password)
          .then((response) => {
            if (response.data.status.code === 'E20002') {
              setAlertState({
                ...alertState,
                alertText: '수정되었습니다.',
                isOpen: true,
                clickButtonCallback: () => {
                  void router.push('/')
                },
              })
            }
          })
          .catch((error) => {
            setAlertState({
              ...alertState,
              alertText: error.response.data.status.message,
              isOpen: true,
            })
          })
      } else {
        setAlertState({
          ...alertState,
          alertText: '비밀번호가 서로 다릅니다.',
          isOpen: true,
        })
      }
    } else {
      setAlertState({
        ...alertState,
        alertText: '8자 이상 30자 이내의 숫자 및 영문, 특수기호(@$!%*#?&)를 이용한 비밀번호를 설정해주세요.',
        isOpen: true,
      })
    }
  }

  useIsModalKeyDown(() => {
    return false
  }, [])

  return (
    <Card>
      <Grid type="container" style={{ rowGap: '4px' }}>
        <Grid type="item">
          <Grid type="container">
            <Grid type="item" area={12}>
              <Typography wrap="p" style={{ marginBottom: '4px' }}>
                기존 비밀번호
              </Typography>
              <Input
                value={password.password}
                type={showPassword.showPassword ? 'text' : 'password'}
                onChange={handlepasswordChange('password')}
                afterTagNode={
                  <button onClick={handleClickshowPassword} onMouseDown={handleMouseDownpassword}>
                    {showPassword.showPassword ? OpenEyeSvg : CloseEyeSvg}
                  </button>
                }
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid type="item" style={{ marginTop: '24px' }}>
          <Grid type="container">
            <Grid type="item" area={12}>
              <Typography wrap="p" style={{ marginBottom: '4px' }}>
                신규 비밀번호
              </Typography>
              <Input
                value={password.newPassword}
                placeholder="8자 이상 30자 이내의 숫자 및 영문, 특수기호(@$!%*#?&)를 이용한 비밀번호를 설정해주세요."
                type={showPassword.showNewPassword ? 'text' : 'password'}
                onChange={handleNewPasswordChange('newPassword')}
                afterTagNode={
                  <button onClick={handleClickShowNewPassword} onMouseDown={handleMouseDownNewPassword}>
                    {showPassword.showPassword ? OpenEyeSvg : CloseEyeSvg}
                  </button>
                }
                state={!password.newPassword ? undefined : passwordTestReg.test(password.newPassword) ? 'success' : 'error'}
                stateText={
                  !password.newPassword
                    ? '8자 이상 30자 이내의 숫자 및 영문, 특수기호(@$!%*#?&)를 이용한 비밀번호를 설정해주세요.'
                    : passwordTestReg.test(password.newPassword)
                    ? '사용 가능한 비밀번호입니다.'
                    : '사용 불가능한 비밀번호입니다. 8자 이상 30자 이내의 숫자 및 영문, 특수기호(@$!%*#?&)를 이용한 비밀번호를 설정해주세요.'
                }
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid type="item" style={{ marginTop: '24px' }}>
          <Grid type="container">
            <Grid type="item" area={12}>
              <Typography wrap="p" style={{ marginBottom: '4px' }}>
                신규 비밀번호 확인
              </Typography>
              <Input
                value={password.newPasswordCheck}
                type={showPassword.showNewPasswordCheck ? 'text' : 'password'}
                onChange={handleNewPasswordChange('newPasswordCheck')}
                afterTagNode={
                  <button onClick={handleClickshowNewPasswordCheck} onMouseDown={handleMouseDownNewPasswordCheck}>
                    {showPassword.showPassword ? OpenEyeSvg : CloseEyeSvg}
                  </button>
                }
                state={isSame === null ? undefined : isSame ? 'success' : 'error'}
                stateText={isSame === null ? '' : isSame ? '비밀번호와 동일합니다.' : '비밀번호와 서로 다릅니다.'}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid type="item">
          <Grid type="container" align="right" style={{ marginTop: '16px' }}>
            <Grid type="item" area={3}>
              <Button onClick={updatePaswordHandler} type={password.password && password.newPassword && password.newPasswordCheck ? 'primary' : 'disabled'}>
                비밀번호 수정
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  )
}

export default Security

const passwordTestReg = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{8,}$/
