import React, { useState, useEffect } from 'react'

import { useRecoilState } from 'recoil'
import { alertModalRecoil } from 'recoil/atom'
import { I_passwordUpdateParams } from 'api/type/adminInterface'
import Modal from '@core/modal'
import Card from '@core/components/Card'
import Grid from '@core/components/Grid'
import Input from '@core/components/Input'
import Button from '@core/components/Button'
import Typography from '@core/components/Typography'
import { putMemberPassword } from 'api/adminApi'
import useIsModalKeyDown from '@core/hooks/useIsModalKeyDown'

interface I_state {
  email: string
  password: string
}

interface I_userInfoModalType {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  userInfo: I_state
}

const UpdatePasswordModal = ({ isOpen, setIsOpen, userInfo }: I_userInfoModalType) => {
  const [password, setPassword] = useState<I_passwordUpdateParams>({
    newPassword: '',
    newPasswordCheck: '',
    password: userInfo.password,
  })
  const [isSame, setisSame] = useState<boolean | null>(null)

  const [, setAlertModalState] = useRecoilState(alertModalRecoil)

  const changePasword = (key: 'newPassword' | 'newPasswordCheck', value: string) => {
    if (value) {
      switch (key) {
        case 'newPassword':
          if (value !== password.newPasswordCheck) {
            setisSame(false)
          } else {
            setisSame(true)
          }
          break
        case 'newPasswordCheck':
          if (value !== password.newPassword) {
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
    setPassword({ ...password, [key]: value })
  }

  const updatePaswordHandler = () => {
    if (password.newPassword === password.newPasswordCheck) {
      if (passwordTestReg.test(password.newPassword) && passwordTestReg.test(password.newPasswordCheck)) {
        void putMemberPassword(password).then((response) => {
          if (response.data.status.code === 'E20002') {
            setIsOpen(false)
            setAlertModalState({
              alertText: '비밀번호 변경이 완료되었습니다.\n변경된 비밀번호로 다시 로그인하세요',
              isOpen: true,
            })
          }
        })
      } else {
        setAlertModalState({
          alertText: '8자 이상 30자 이내의 숫자 및 영문, 특수기호(@$!%*#?&)를 이용한 비밀번호를 설정해주세요.',
          isOpen: true,
        })
      }
    } else {
      setAlertModalState({
        alertText: '비밀번호가 서로 다릅니다.',
        isOpen: true,
      })
    }
  }

  useEffect(() => {
    setPassword((p) => {
      return { ...p, password: userInfo.password }
    })
  }, [userInfo.password])

  useIsModalKeyDown(() => {
    if (isOpen) updatePaswordHandler()
  }, [isOpen, password])

  return (
    <Modal open={isOpen}>
      <Card style={{ width: '900px' }}>
        <Typography fontSize="subtitle2">초기 비밀번호 변경</Typography>
        <Grid type="container" style={{ rowGap: '8px', marginTop: '20px' }} horizen="center">
          <Grid type="item" area={4}>
            <Typography>새 비밀번호</Typography>
          </Grid>
          <Grid type="item" area={20}>
            <Input
              placeholder="8자 이상 30자 이내의 숫자 및 영문, 특수기호(@$!%*#?&)를 이용한 비밀번호를 설정해주세요"
              value={password?.newPassword || ''}
              onChange={(e) => {
                changePasword('newPassword', e.target.value)
              }}
              type={'password'}
              state={!!password.newPassword && !passwordTestReg.test(password.newPassword) ? 'error' : undefined}
              stateText={
                passwordTestReg.test(password.newPassword)
                  ? '사용 가능한 비밀번호입니다.'
                  : '사용 불가능한 비밀번호입니다. 비밀번호 규격을 다시 한 번 확인해주세요.'
              }
            />
          </Grid>
          <Grid type="item">
            <Typography colorWeight="500"></Typography>
          </Grid>
          <Grid type="item" area={4}>
            <Typography>비밀번호 확인</Typography>
          </Grid>
          <Grid type="item" area={20}>
            <Input
              placeholder=""
              value={password?.newPasswordCheck || ''}
              onChange={(e) => {
                changePasword('newPasswordCheck', e.target.value)
              }}
              type={'password'}
              state={isSame === null ? undefined : isSame ? 'success' : 'error'}
              stateText={isSame === null ? '' : isSame ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
            />
          </Grid>
          <Grid type="item" style={{ marginTop: '24px' }}>
            <Grid type="container" align="right">
              <Grid type="item" area={6}>
                <Button type="primary" size="middum" onClick={updatePaswordHandler}>
                  수정
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Modal>
  )
}

export default UpdatePasswordModal

const passwordTestReg = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{8,}$/
