import Button from '@core/components/Button'
import Card from '@core/components/Card'
import Dropdown from '@core/components/Dropdown'
import Option from '@core/components/Dropdown/Option'
import Grid from '@core/components/Grid'
import Input from '@core/components/Input'
import Typography from '@core/components/Typography'
import { getToken, putMember } from 'api/adminApi'
import React from 'react'
import { useRecoilState } from 'recoil'
import { alertModalRecoil, confirmModalRecoil, typeInfoRecoil } from 'recoil/atom'

interface I_userInfo {
  name: string
  email: string
  department: string
  position: string
  roleCode: string
  phone: string
  seq: number
}

interface I_userInfoStateProps {
  initUserInfo: I_userInfo
}

/**
 *
 */
const Account = (props: I_userInfoStateProps) => {
  const { initUserInfo } = props
  const [userInfo, setUserInfo] = React.useState(initUserInfo)
  const [, setAlertState] = useRecoilState(alertModalRecoil)
  const [, setConfirmState] = useRecoilState(confirmModalRecoil)
  const [typeInfoState] = useRecoilState(typeInfoRecoil)

  const [isChangeUserInfo, setIsChangeUserInfo] = React.useState(false)

  const isCheckChangeInfo = (type: 'name' | 'phone' | 'email' | 'roleCode' | 'department' | 'position', value: string) => {
    const userInfoKeys: Array<'name' | 'phone' | 'email' | 'roleCode' | 'department' | 'position'> = [
      'name',
      'phone',
      'email',
      'roleCode',
      'department',
      'position',
    ]
    const filterChangedKey = userInfoKeys.filter((data) => {
      return userInfo[data] !== initUserInfo[data] && data !== type
    }).length
    const isCheckResult = filterChangedKey > 0 || initUserInfo[type] !== value
    setIsChangeUserInfo(isCheckResult)
  }

  const changeUserNameHandler = (target: string) => {
    setUserInfo({ ...userInfo, name: target })
    isCheckChangeInfo('name', target)
  }
  const changeUserPhoneHandler = (target: string) => {
    setUserInfo({ ...userInfo, phone: target })
    isCheckChangeInfo('phone', target)
  }
  const changeUserDepartmentHandler = (target: string | number) => {
    setUserInfo({ ...userInfo, department: target as string })
    isCheckChangeInfo('department', target as string)
  }
  const changeUserPositionHandler = (target: string | number) => {
    setUserInfo({ ...userInfo, position: target as string })
    isCheckChangeInfo('position', target as string)
  }

  const updateUserInfo = () => {
    if (isChangeUserInfo) {
      setConfirmState({
        isOpen: true,
        alertText: '수정 하시겠습니까?',
        completeButtonCallback: () => {
          void putMember({ ...userInfo, menu: false, info: true }).then((response) => {
            if (response.data.status.code === 'E20002') {
              setAlertState({
                alertText: '수정되었습니다.',
                isOpen: true,
                clickButtonCallback: () => {
                  void getToken()
                },
              })
            }
          })
        },
      })
    }
  }

  React.useEffect(() => {
    setUserInfo(initUserInfo)
  }, [initUserInfo])

  return (
    <Card>
      <Grid type="container" style={{ rowGap: '4px', justifyContent: 'space-between' }}>
        <Grid type="item" area={11} style={{ marginTop: '12px' }}>
          <Typography wrap="p" style={{ marginBottom: '4px' }}>
            아이디
          </Typography>
          <Input value={userInfo?.email || ''} readOnly disabled />
        </Grid>
        <Grid type="item" area={11} style={{ marginTop: '12px' }}>
          <Typography wrap="p" style={{ marginBottom: '4px' }}>
            전화번호
          </Typography>
          <Input
            value={userInfo?.phone || ''}
            placeholder=""
            onChange={(e) => {
              changeUserPhoneHandler(e.target.value)
            }}
          />
        </Grid>
        <Grid type="item" area={11} style={{ marginTop: '12px' }}>
          <Typography wrap="p" style={{ marginBottom: '4px' }}>
            이름
          </Typography>
          <Input
            value={userInfo?.name || ''}
            onChange={(e) => {
              changeUserNameHandler(e.target.value)
            }}
          />
        </Grid>
        {/* <Grid type="item" area={11} style={{ marginTop: '12px' }}>
          <Typography wrap="p">권한</Typography>
          <Dropdown value={userInfo?.roleCode || ''} readOnly>
            {typeInfoState.role.map((data, idx) => (
              <Option value={data.roleCode} key={`roles_${idx}`}>
                {data.roleName}
              </Option>
            ))}
          </Dropdown>
        </Grid> */}
        <Grid type="item" area={11} style={{ marginTop: '12px' }}>
          <Typography wrap="p" style={{ marginBottom: '4px' }}>
            부서
          </Typography>
          <Dropdown value={userInfo?.department || ''} onChange={changeUserDepartmentHandler}>
            {typeInfoState.department.map((data, idx) => (
              <Option value={data.groupId} key={`departments_${idx}`}>
                {data.groupName}
              </Option>
            ))}
          </Dropdown>
        </Grid>
        <Grid type="item" area={11} style={{ marginTop: '12px' }}>
          <Typography wrap="p" style={{ marginBottom: '4px' }}>
            직급/직책
          </Typography>
          <Dropdown value={userInfo?.position || ''} onChange={changeUserPositionHandler}>
            {typeInfoState.position.map((data, idx) => (
              <Option value={data.positionId} key={`positions_${idx}`}>
                {data.positionName}
              </Option>
            ))}
          </Dropdown>
        </Grid>
        <Grid type="item">
          <Grid type="container" align="right" style={{ marginTop: '16px' }}>
            <Grid type="item" area={3}>
              <Button onClick={updateUserInfo} type={isChangeUserInfo ? 'primary' : 'disabled'}>
                저장
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  )
}

export default Account
