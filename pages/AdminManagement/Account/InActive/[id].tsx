import Button from '@core/components/Button'
import Card from '@core/components/Card'
import Dropdown from '@core/components/Dropdown'
import Option from '@core/components/Dropdown/Option'
import Grid from '@core/components/Grid'
import Input from '@core/components/Input'
import Radio from '@core/components/Radio'
import Switch from '@core/components/Switch'
import Typography from '@core/components/Typography'
import { deleteMember, getMemberDetail, putMember, putMemberReset } from 'api/adminApi'
import { I_detailMenuSet, detailMenuLists, headerMenuLists } from 'components/common/Navigation/menuLists'
import { getMenusAll, getMenuFlat } from 'components/common/Navigation/util'
import LoadAdministratorModal from 'components/modal/LoadAdministratorModal'
import { useRouter } from 'next/router'
import React from 'react'
import { useRecoilState } from 'recoil'
import { alertModalRecoil, confirmModalRecoil, typeInfoRecoil } from 'recoil/atom'
import { checkedRegType } from 'utils'

interface I_userInfo {
  name: string
  email: string
  department: string
  position: string
  roleCode: string | 'ROLE_MASTER' | 'ROLE_ADMIN' | 'ROLE_USER'
  phone: string
  seq: number
  status: string | 'Y' | 'N' | 'S'
  menuAuth: Array<{
    code: string
    read: boolean
    create: boolean
    delete: boolean
  }>
}

interface I_loadAdminModalState {
  isOpen: boolean
  type: 'Epic' | 'Steam'
}

type I_inputType = 'name' | 'phone' | 'email' | 'roleCode' | 'department' | 'position' | 'status'
type I_HeaderMenu = 'Epic' | 'Steam' | 'TotalDashBoard' | 'AdminManagement'

/**
 *
 */
const AdminAccountUpdate = () => {
  const [changeUserInfo, setChangeUserInfo] = React.useState<I_userInfo>(defaultUserInfo)
  const [targetUserInfo, setTargetUserInfo] = React.useState<I_userInfo>({ ...defaultUserInfo, roleCode: 'ROLE_MASTER' })

  const [isChangeUserInfo, setIsChangeUserInfo] = React.useState(false)
  const [isChangeUserMenuAuth, setIsChangeUserMenuAuth] = React.useState(false)

  const [epicMenuAuthCheckType, setEpicMenuAuthCheckType] = React.useState<'self' | 'another'>('self')
  const [steamMenuAuthCheckType, setSteamMenuAuthCheckType] = React.useState<'self' | 'another'>('self')

  const [loadAdminModalState, setLoadAdminModalState] = React.useState<I_loadAdminModalState>({
    isOpen: false,
    type: 'Epic',
  })

  const [userInfo, setUserInfo] = React.useState<any>()

  const [alertModalState, setAlertModalState] = useRecoilState(alertModalRecoil)
  const [, setConfirmModalState] = useRecoilState(confirmModalRecoil)
  const [typeInfoState] = useRecoilState(typeInfoRecoil)

  const router = useRouter()

  const isCheckChangeInfo = (type: I_inputType, value: string) => {
    const changeUserInfoKeys: I_inputType[] = ['name', 'phone', 'email', 'roleCode', 'department', 'position', 'status']
    const filterChangedKey = changeUserInfoKeys.filter((data) => {
      if (changeUserInfo[data] !== targetUserInfo[data] && data !== type) return true
      return false
    }).length
    const isCheckResult = filterChangedKey > 0 || targetUserInfo[type] !== value
    setIsChangeUserInfo(isCheckResult)
  }

  const isCheckChangeMenuAuth = (code: string, targetKey: 'read' | 'create' | 'delete', targetValue: boolean) => {
    const isCheckChangeAuthLength = changeUserInfo.menuAuth.filter((data) => {
      const targetUserConstMenuAuth = targetUserInfo.menuAuth.filter((auth) => {
        return data.code === auth.code
      })[0]
      const authFilters: Array<'read' | 'create' | 'delete'> = ['read', 'create', 'delete']
      const diffAuth = authFilters.filter((auth) => {
        return data[auth] !== targetUserConstMenuAuth?.[auth] && !(data.code === code && auth === targetKey)
      }).length
      return diffAuth > 0
    }).length

    const isCheckResult =
      isCheckChangeAuthLength > 0 ||
      targetUserInfo.menuAuth.find((data) => {
        return data.code === code
      })?.[targetKey] !== targetValue
    setIsChangeUserMenuAuth(isCheckResult)
  }

  const isCheckChangeMenuAuthAll = (
    newMenuAuth: Array<{
      code: string
      read: boolean
      create: boolean
      delete: boolean
    }>,
  ) => {
    const filters = newMenuAuth.filter((data) => {
      const changeMenuAuth = newMenuAuth.filter((menu) => data.code === menu.code)[0]
      const originMenuAuth = targetUserInfo.menuAuth.filter((menu) => data.code === menu.code)[0]
      const authFilters: Array<'read' | 'create' | 'delete'> = ['read', 'create', 'delete']
      return authFilters.filter((data) => changeMenuAuth[data] !== originMenuAuth?.[data]).length > 0
    })
    setIsChangeUserMenuAuth(filters.length > 0)
  }

  const isCheckedInsertUserInfo = () => {
    const checkAllmenuAuth = () => {
      return (
        changeUserInfo.menuAuth.filter((menu) => {
          return menu.create || menu.delete || menu.read
        }).length > 0
      )
    }

    /**
     * 해당 메뉴의 체크된 하위 메뉴가 있으면 false 없으면 true
     */
    const checkDetailMenuAuth = (targetMenu: I_HeaderMenu) => {
      if (!detailMenuLists[targetMenu]) return false
      return !(
        changeUserInfo.menuAuth
          .filter((filter) => getMenusAll(detailMenuLists[targetMenu]).find((data) => data.menuCode === filter.code))
          .filter((filter) => filter.read).length > 0
      )
    }

    if (changeUserInfo.email === '') {
      setAlertModalState({
        ...alertModalState,
        alertText: '이메일을 입력해주세요.',
        isOpen: true,
        clickButtonCallback: () => {
          return false
        },
      })
      return false
    } else if (changeUserInfo.name === '') {
      setAlertModalState({
        ...alertModalState,
        alertText: '이름을 입력해주세요.',
        isOpen: true,
        clickButtonCallback: () => {
          return false
        },
      })
      return false
    } else if (changeUserInfo.phone === '') {
      setAlertModalState({
        ...alertModalState,
        alertText: '전화번호를 입력해주세요.',
        isOpen: true,
        clickButtonCallback: () => {
          return false
        },
      })
      return false
    } else if (changeUserInfo.position === '') {
      setAlertModalState({
        ...alertModalState,
        alertText: '직급을 선택해주세요.',
        isOpen: true,
        clickButtonCallback: () => {
          return false
        },
      })
      return false
    } else if (changeUserInfo.roleCode === '') {
      setAlertModalState({
        ...alertModalState,
        alertText: '권한을 선택해주세요.',
        isOpen: true,
        clickButtonCallback: () => {
          return false
        },
      })
      return false
    } else if (changeUserInfo.department === '') {
      setAlertModalState({
        ...alertModalState,
        alertText: '부서를 선택해주세요.',
        isOpen: true,
        clickButtonCallback: () => {
          return false
        },
      })
      return false
    } else if (!checkAllmenuAuth()) {
      setAlertModalState({
        ...alertModalState,
        alertText: '하나 이상의 메뉴를 활성화해주세요.',
        isOpen: true,
        clickButtonCallback: () => {
          return false
        },
      })
      return false
    } else {
      const selectHeaderMenu = changeUserInfo.menuAuth
        .filter((filter) => headerMenuLists.find((find) => find.menuCode === filter.code))
        .filter((filter) => filter.read)
      const noSelectMenu = headerMenuLists
        .filter((filter) => selectHeaderMenu.find((find) => find.code === filter.menuCode))
        .find((find) => checkDetailMenuAuth(find.menuName as I_HeaderMenu))

      if (noSelectMenu) {
        setAlertModalState({
          ...alertModalState,
          alertText: `${noSelectMenu.menuName}메뉴의 하나 이상의 메뉴를 활성화해주세요.`,
          isOpen: true,
          clickButtonCallback: () => {
            return false
          },
        })
        return false
      }
      return true
    }
  }

  const changeMenuAuthRadioHandler = (code: string, targetKey: 'read' | 'create_delete' | 'none') => {
    let newMenuAuth: {
      read: boolean
      create: boolean
      delete: boolean
    }
    switch (targetKey) {
      case 'read':
        newMenuAuth = {
          read: true,
          create: false,
          delete: false,
        }

        break
      case 'create_delete':
        newMenuAuth = {
          read: true,
          create: true,
          delete: true,
        }
        break
      default:
        newMenuAuth = {
          read: false,
          create: false,
          delete: false,
        }
        break
    }

    let newMenuAuths = changeUserInfo.menuAuth.map((data) => {
      if (code === data.code) {
        return {
          ...data,
          ...newMenuAuth,
        }
      } else return data
    })

    ;(Object.keys(detailMenuLists) as Array<keyof I_detailMenuSet>).forEach((key) => {
      const findCode = detailMenuLists[key].find((find) => find.menuCode === code)
      if (findCode?.list) {
        findCode.list.forEach((data) => {
          newMenuAuths = newMenuAuths.concat([{ code: data.menuCode, ...newMenuAuth }])
        })
      }
    })

    setChangeUserInfo({
      ...changeUserInfo,
      menuAuth: newMenuAuths,
    })
    isCheckChangeMenuAuthAll(newMenuAuths)
  }

  const changeUserNameHandler = (target: string) => {
    if (checkedRegType(target, 'text')) {
      setChangeUserInfo({ ...changeUserInfo, name: target })
      isCheckChangeInfo('name', target)
    }
  }
  const changeUserPhoneHandler = (target: string) => {
    if (checkedRegType(target, 'number')) {
      setChangeUserInfo({ ...changeUserInfo, phone: target })
      isCheckChangeInfo('phone', target)
    }
  }

  // const changeUserEmailHandler = (target: string) => {
  //   setChangeUserInfo({ ...changeUserInfo, email: target })
  //   isCheckChangeInfo('email', target)
  // }

  const changeUserRoleHandler = (target: string | number) => {
    setChangeUserInfo({ ...changeUserInfo, roleCode: target as string })
    isCheckChangeInfo('roleCode', target as string)
  }
  const changeUserDepartmentHandler = (target: string | number) => {
    if (userInfo?.role === 'ROLE_MASTER') {
      setChangeUserInfo({ ...changeUserInfo, department: target as string })
      isCheckChangeInfo('department', target as string)
    }
  }
  const changeUserPositionHandler = (target: string | number) => {
    setChangeUserInfo({ ...changeUserInfo, position: target as string })
    isCheckChangeInfo('position', target as string)
  }

  const changeUserStatusHandler = (target: string | number) => {
    setChangeUserInfo({ ...changeUserInfo, status: target as string })
    isCheckChangeInfo('status', target as string)
  }

  const changeHeaderMenuAuth = (code: string, targetValue: boolean) => {
    const targetDetailMenus =
      getMenuFlat(
        detailMenuLists[headerMenuLists.find((data) => data.menuCode === code)?.link as 'Epic' | 'Steam' | 'AdminManagement' | 'TotalDashBoard'],
      )?.map((data) => {
        if (code === 'ELMU1') {
          return {
            code: data.menuCode,
            read: targetValue,
            create: targetValue,
            delete: targetValue,
          }
        }
        return {
          code: data.menuCode,
          read: false,
          create: false,
          delete: false,
        }
      }) ?? []

    let newMenuAuths = changeUserInfo.menuAuth.map((data) => {
      const childMenuDatas = targetDetailMenus.find((menu) => menu.code === data.code)
      if (childMenuDatas) {
        return childMenuDatas
      } else if (code === data.code) {
        return {
          ...data,
          read: targetValue,
          create: targetValue,
          delete: targetValue,
        }
      } else return data
    })

    targetDetailMenus.forEach((data) => {
      if (!newMenuAuths.find((find) => find.code === data.code))
        newMenuAuths = newMenuAuths.concat([
          {
            ...data,
            read: targetValue,
            create: targetValue,
            delete: targetValue,
          },
        ])
    })

    setChangeUserInfo({ ...changeUserInfo, menuAuth: newMenuAuths })
    isCheckChangeMenuAuth(code, 'read', targetValue)
  }

  const userPasswordResetHandler = () => {
    const userSeq = Number(router.query.id)
    setConfirmModalState({
      alertText: '초기화 하시겠습니까?',
      isOpen: true,
      completeButtonCallback: () => {
        void putMemberReset({ seq: userSeq }).then((response) => {
          if (response.data?.status.code === 'E20000') {
            setAlertModalState({
              ...alertModalState,
              alertText: `초기화 되었습니다. 
                ${
                  JSON.parse(window.sessionStorage.getItem('loginUserInfo') ?? '').email === changeUserInfo.email
                    ? '본인 비밀번호가 초기화되어 로그인화면으로 돌아갑니다.'
                    : ''
                }`,
              isOpen: true,
              clickButtonCallback: () => {
                if (JSON.parse(window.sessionStorage.getItem('loginUserInfo') ?? '').email === changeUserInfo.email) {
                  void router.push('/login')
                }
                return false
              },
            })
          }
        })
      },
    })
  }

  const deleteUserHandler = () => {
    setConfirmModalState({
      alertText: '삭제 하시겠습니까?',
      isOpen: true,
      completeButtonCallback: () => {
        void deleteMember({ seq: Number(router.query.id) }).then((response) => {
          if (response.data?.status.code === 'E20002') {
            setAlertModalState({
              ...alertModalState,
              alertText: '삭제 되었습니다.',
              isOpen: true,
              clickButtonCallback: () => {
                void router.back()
              },
            })
          }
        })
      },
    })
  }

  const changeMeunAuthLoadHandler = (value: 'self' | 'another', type: 'Epic' | 'Steam') => {
    if (type === 'Epic') {
      setEpicMenuAuthCheckType(value)
    } else {
      setSteamMenuAuthCheckType(value)
    }

    if (value === 'another') {
      setLoadAdminModalState({
        isOpen: true,
        type,
      })
    }
  }

  const menuAuthLoadCallbackHandler = (
    result: Array<{
      code: string
      read: boolean
      create: boolean
      delete: boolean
    }>,
  ) => {
    const changeUserMenuAuthForResults = changeUserInfo.menuAuth.map((data) => {
      const targetResult = result.filter((resultData) => {
        return data.code === resultData.code
      })[0]
      if (targetResult) return targetResult
      return data
    })
    setChangeUserInfo((prev) => ({
      ...prev,
      menuAuth: changeUserMenuAuthForResults,
    }))
    isCheckChangeMenuAuthAll(changeUserMenuAuthForResults)
    setLoadAdminModalState((prev) => ({
      ...prev,
      isOpen: false,
    }))
    switch (loadAdminModalState.type) {
      case 'Epic':
        setEpicMenuAuthCheckType('self')
        break

      default:
        setSteamMenuAuthCheckType('self')
        break
    }
  }

  const menuAuthLoadCancelCallbackHandler = (type: 'Epic' | 'Steam') => {
    setLoadAdminModalState((prev) => ({
      ...prev,
      isOpen: false,
    }))
    switch (type) {
      case 'Epic':
        setEpicMenuAuthCheckType('self')
        break

      default:
        setSteamMenuAuthCheckType('self')
        break
    }
  }

  const clickCancelButtonHandler = () => {
    if (isChangeUserInfo || isChangeUserMenuAuth) {
      setConfirmModalState({
        isOpen: true,
        alertText: '변경된 내용이 초기화 됩니다.\n 정말 돌아가시겠습니까?',
        completeButtonCallback: () => {
          void router.back()
        },
      })
    } else {
      void router.back()
    }
  }

  const updateUserHandler = () => {
    if (isCheckedInsertUserInfo()) {
      setConfirmModalState({
        alertText: '수정 하시겠습니까?',
        isOpen: true,
        completeButtonCallback: () => {
          void putMember({ ...changeUserInfo, info: isChangeUserInfo, menu: isChangeUserMenuAuth }).then((response) => {
            if (response.data?.status.code === 'E20002') {
              setAlertModalState({
                ...alertModalState,
                alertText: '수정 되었습니다.',
                isOpen: true,
                clickButtonCallback: () => {
                  void router.back()
                },
              })
            }
          })
        },
      })
    }
  }

  React.useEffect(() => {
    const userInfoData = JSON.parse(window.sessionStorage.getItem('loginUserInfo') as any)
    setUserInfo(userInfoData)

    if (router.query.id) {
      const userSeq = Number(router.query.id)
      void getMemberDetail({ seq: userSeq }).then((response) => {
        if (response.data?.status.code === 'E20000') {
          setChangeUserInfo((prev) => ({
            ...response.data.data,
            menuAuth: prev.menuAuth.map((data) => {
              const filterResponseMenu = response.data.data.menuAuth.filter(
                (menu: { code: string; read: boolean; create: boolean; delete: boolean }) => menu.code === data.code,
              )[0]
              if (filterResponseMenu) return filterResponseMenu
              return data
            }),
          }))
          setTargetUserInfo((prev) => ({
            ...response.data.data,
            menuAuth: prev.menuAuth.map((data) => {
              const filterResponseMenu = response.data.data.menuAuth.filter(
                (menu: { code: string; read: boolean; create: boolean; delete: boolean }) => menu.code === data.code,
              )[0]
              if (filterResponseMenu) return filterResponseMenu
              return data
            }),
          }))
        }
      })
    }
  }, [router])

  return (
    <Grid type="container">
      <Grid type="item">
        <Grid type="container" horizen="center">
          <Grid type="item">
            <Typography fontSize="subtitle1" style={{ fontWeight: '500' }}>
              기본정보
            </Typography>
          </Grid>
          <Typography fontSize="element1" colorWeight="500">
            초기 비밀번호는 이메일 주소를 제외한 아이디와 동일하게 부여됩니다.
          </Typography>
          <Grid type="item" area={2} style={{ marginLeft: '12px' }}>
            <Button type="secondary" color="red" size="minimum" onClick={userPasswordResetHandler}>
              초기화
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid type="item" style={{ marginTop: '24px' }}>
        <Card>
          <Grid type="container" style={{ columnGap: '10%', rowGap: '16px', justifyContent: 'space-between' }}>
            <Grid type="item" area={6}>
              <Typography fontSize="element1" colorWeight="500">
                아이디
              </Typography>
              <Input placeholder="xx.xxx@elwide.com" id="userEmail" value={changeUserInfo?.email || ''} readOnly disabled />
            </Grid>
            <Grid type="item" area={6}>
              <Typography fontSize="element1" colorWeight="500">
                이름
              </Typography>
              <Input
                placeholder="이름"
                value={changeUserInfo?.name || ''}
                onChange={(e) => {
                  changeUserNameHandler(e.target.value)
                }}
                readOnly={checkUserRoleValue(userInfo?.role) > checkUserRoleValue(targetUserInfo.roleCode)}
                disabled={checkUserRoleValue(userInfo?.role) > checkUserRoleValue(targetUserInfo.roleCode)}
              />
            </Grid>
            <Grid type="item" area={6}>
              <Typography fontSize="element1" colorWeight="500">
                전화번호
              </Typography>
              <Input
                placeholder="숫자만 입력해주세요"
                value={changeUserInfo?.phone || ''}
                onChange={(e) => {
                  changeUserPhoneHandler(e.target.value)
                }}
                readOnly={checkUserRoleValue(userInfo?.role) > checkUserRoleValue(targetUserInfo.roleCode)}
                disabled={checkUserRoleValue(userInfo?.role) > checkUserRoleValue(targetUserInfo.roleCode)}
              />
            </Grid>
            <Grid type="item" area={6}>
              <Typography fontSize="element1" colorWeight="500">
                부서
              </Typography>
              <Dropdown onChange={changeUserDepartmentHandler} value={changeUserInfo?.department || ''} readOnly={checkUserRoleValue(userInfo?.role) > 0}>
                {typeInfoState.department.map((data, key) => (
                  <Option value={data.groupId} key={`departmentList_${key}`}>
                    {data.groupName}
                  </Option>
                ))}
              </Dropdown>
            </Grid>
            <Grid type="item" area={6}>
              <Typography fontSize="element1" colorWeight="500">
                직급/직책
              </Typography>
              <Dropdown
                onChange={changeUserPositionHandler}
                value={changeUserInfo?.position || ''}
                readOnly={checkUserRoleValue(userInfo?.role) > checkUserRoleValue(targetUserInfo.roleCode)}
              >
                {typeInfoState.position.map((data, key) => (
                  <Option value={data.positionId} key={`positions${key}`}>
                    {data.positionName}
                  </Option>
                ))}
              </Dropdown>
            </Grid>
            <Grid type="item" area={6}>
              <Typography fontSize="element1" colorWeight="500">
                상태
              </Typography>
              <Dropdown
                onChange={changeUserStatusHandler}
                value={changeUserInfo.status}
                readOnly={checkUserRoleValue(userInfo?.role) > checkUserRoleValue(targetUserInfo.roleCode)}
              >
                <Option value={'Y'}>사용</Option>
                <Option value={'S'}>중지</Option>
              </Dropdown>
            </Grid>
            <Grid type="item" area={6}>
              <Typography fontSize="element1" colorWeight="500">
                유형
              </Typography>
              <Dropdown
                onChange={changeUserRoleHandler}
                value={changeUserInfo?.roleCode || ''}
                readOnly={checkUserRoleValue(userInfo?.role) > checkUserRoleValue(targetUserInfo.roleCode)}
              >
                {(targetUserInfo.roleCode === 'ROLE_MASTER' || userInfo?.role === 'ROLE_MASTER') && <Option value="ROLE_MASTER">Master</Option>}
                <Option value="ROLE_ADMIN">Admin</Option>
                <Option value="ROLE_USER">User</Option>
              </Dropdown>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid type="item" style={{ marginTop: '24px' }}>
        <Grid type="container">
          <Grid type="item">
            <Typography fontSize="subtitle1" style={{ fontWeight: '500' }}>
              권한설정
            </Typography>
          </Grid>
          <Grid type="item">
            <Typography fontSize="element1" colorWeight="500">
              통합 관리자 관리 권한을 On으로 설정하면 관리자 등록이 가능합니다.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid type="item" style={{ marginTop: '24px' }}>
        <Grid type="container">
          <Grid type="item">
            <Card style={{ padding: '0' }}>
              <Grid type="container">
                <Grid
                  type="item"
                  area={4}
                  align="center"
                  color="purple"
                  colorWeight="200"
                  style={{ padding: '12px 4px', borderRight: '1px solid #d6d6d6', borderBottom: '1px solid #d6d6d6' }}
                >
                  <Typography fontSize="body2">통합 대시보드</Typography>
                </Grid>
                <Grid
                  type="item"
                  area={8}
                  align="center"
                  style={{ padding: '12px 34px', borderRight: '0.5px solid #d6d6d6', borderBottom: '1px solid #d6d6d6' }}
                >
                  <Switch
                    value={changeUserInfo.menuAuth.filter((data) => data.code === 'ELMU4')[0].read}
                    onChange={(isChecked) => changeHeaderMenuAuth('ELMU4', isChecked)}
                  />
                </Grid>
                <Grid
                  type="item"
                  area={4}
                  align="center"
                  color="purple"
                  colorWeight="200"
                  style={{ padding: '12px 4px', borderRight: '0.5px solid #d6d6d6', borderBottom: '1px solid #d6d6d6' }}
                >
                  <Typography fontSize="body2">통합 관리자 관리</Typography>
                </Grid>

                <Grid type="item" area={8} align="center" style={{ padding: '12px 34px', borderBottom: '0.5px solid #d6d6d6' }}>
                  <Switch
                    value={changeUserInfo.menuAuth.filter((data) => data.code === 'ELMU1')[0].read}
                    onChange={(isChecked) => changeHeaderMenuAuth('ELMU1', isChecked)}
                  />
                </Grid>
                <Grid type="item" area={4} align="center" color="purple" colorWeight="200" style={{ padding: '12px 4px', borderRight: '0.5px solid #d6d6d6' }}>
                  <Typography fontSize="body2">Epic</Typography>
                </Grid>
                <Grid type="item" area={8} align="center" style={{ padding: '12px 34px', borderRight: '0.5px solid #d6d6d6' }}>
                  <Switch
                    value={changeUserInfo.menuAuth.filter((data) => data.code === 'ELMU2')[0].read}
                    onChange={(isChecked) => changeHeaderMenuAuth('ELMU2', isChecked)}
                  />
                </Grid>
                <Grid type="item" area={4} align="center" color="purple" colorWeight="200" style={{ padding: '12px 4px', borderRight: '0.5px solid #d6d6d6' }}>
                  <Typography fontSize="body2">Steam</Typography>
                </Grid>

                <Grid type="item" area={8} align="center" style={{ padding: '12px 34px' }}>
                  <Switch
                    value={changeUserInfo.menuAuth.filter((data) => data.code === 'ELMU3')[0].read}
                    onChange={(isChecked) => changeHeaderMenuAuth('ELMU3', isChecked)}
                  />
                </Grid>
              </Grid>
            </Card>
            <Grid type="container" style={{ justifyContent: 'space-between', marginTop: '24px' }}>
              <Grid type="item" area={11.8} style={{ padding: '0' }}>
                {changeUserInfo.menuAuth.filter((data) => data.code === 'ELMU2')[0].read && (
                  <Card style={{ padding: '0' }}>
                    <Grid type="item" align="center" color="black" colorWeight="300" style={{ padding: '12px' }}>
                      <Typography>Epic 메뉴 권한 설정</Typography>
                    </Grid>
                    <Grid type="item" style={{ padding: '8px' }}>
                      <Card style={{ padding: '0' }}>
                        <Grid type="container" horizen="center">
                          <Grid type="item" area={6} style={{ padding: '12px' }} align="center" color="purple" colorWeight="200">
                            <Typography fontSize="body2">설정 방법 선택</Typography>
                          </Grid>
                          <Grid type="item" area={18} style={{ paddingLeft: '16px' }}>
                            <Grid type="container" horizen="center">
                              <Grid type="item">
                                <Radio
                                  group="epicMenuSelectType"
                                  label="직접 설정"
                                  size="small"
                                  value={'self'}
                                  checked={epicMenuAuthCheckType === 'self'}
                                  readOnly
                                  onClick={(event) => changeMeunAuthLoadHandler(event.currentTarget.value as 'self' | 'another', 'Epic')}
                                />
                                <Radio
                                  group="epicMenuSelectType"
                                  label="관리자 권한 불러오기"
                                  size="small"
                                  value={'another'}
                                  checked={epicMenuAuthCheckType === 'another'}
                                  readOnly
                                  onClick={(event) => changeMeunAuthLoadHandler(event.currentTarget.value as 'self' | 'another', 'Epic')}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                    <Grid type="item" style={{ padding: '8px' }}>
                      {detailMenuLists.Epic.map((data, index) => {
                        const targetData = changeUserInfo.menuAuth.filter((menuData) => menuData.code === data.menuCode)[0]
                        return (
                          <Card style={{ padding: '0', border: '1px solid #d6d6d6', borderTop: index === 0 ? '' : 'none' }} key={`Epic_${index}`}>
                            <Grid type="container" horizen="center">
                              <Grid type="item" area={6} style={{ padding: '12px' }} align="center" color="purple" colorWeight="200">
                                <Typography fontSize="body2">{data.menuName}</Typography>
                              </Grid>
                              <Grid type="item" area={18} style={{ paddingLeft: '16px' }}>
                                <Grid type="container" horizen="center">
                                  <Grid type="item">
                                    <Radio
                                      group={`Epic_${data.menuCode}_menuSet`}
                                      label="접근"
                                      size="small"
                                      checked={(targetData.read && !targetData.create && !targetData.delete) ?? false}
                                      value={'read'}
                                      onClick={() => changeMenuAuthRadioHandler(data.menuCode, 'read')}
                                      readOnly
                                    />
                                    {index !== 0 && data.menuCode !== 'ELMU9' && (
                                      <Radio
                                        group={`Epic_${data.menuCode}_menuSet`}
                                        label="등록/수정/삭제"
                                        size="small"
                                        checked={(targetData.read && targetData.create && targetData.delete) ?? false}
                                        value="create_delete"
                                        onClick={() => changeMenuAuthRadioHandler(data.menuCode, 'create_delete')}
                                        readOnly
                                      />
                                    )}
                                    <Radio
                                      group={`Epic_${data.menuCode}_menuSet`}
                                      label="권한없음"
                                      size="small"
                                      checked={(!targetData.read && !targetData.create && !targetData.delete) ?? false}
                                      value="none"
                                      onClick={() => changeMenuAuthRadioHandler(data.menuCode, 'none')}
                                      readOnly
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Card>
                        )
                      })}
                    </Grid>
                  </Card>
                )}
              </Grid>
              <Grid type="item" area={11.8} style={{ padding: '0' }}>
                {changeUserInfo.menuAuth.filter((data) => data.code === 'ELMU3')[0].read && (
                  <Card style={{ padding: '0' }}>
                    <Grid type="item" align="center" color="black" colorWeight="300" style={{ padding: '12px' }}>
                      <Typography>Steam 메뉴 권한 설정</Typography>
                    </Grid>
                    <Grid type="item" style={{ padding: '8px' }}>
                      <Card style={{ padding: '0' }}>
                        <Grid type="container" horizen="center">
                          <Grid type="item" area={6} style={{ padding: '12px' }} align="center" color="purple" colorWeight="200">
                            <Typography fontSize="body2">설정 방법 선택</Typography>
                          </Grid>
                          <Grid type="item" area={18} style={{ paddingLeft: '16px' }}>
                            <Grid type="container" horizen="center">
                              <Grid type="item">
                                <Radio
                                  group="steamMenuSelectType"
                                  label="직접 설정"
                                  size="small"
                                  value={'self'}
                                  checked={steamMenuAuthCheckType === 'self'}
                                  readOnly
                                  onClick={(event) => changeMeunAuthLoadHandler(event.currentTarget.value as 'self' | 'another', 'Steam')}
                                />
                                <Radio
                                  group="steamMenuSelectType"
                                  label="관리자 권한 불러오기"
                                  size="small"
                                  value={'another'}
                                  checked={steamMenuAuthCheckType === 'another'}
                                  readOnly
                                  onClick={(event) => changeMeunAuthLoadHandler(event.currentTarget.value as 'self' | 'another', 'Steam')}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                    <Grid type="item" style={{ padding: '12px' }}>
                      {detailMenuLists.Steam.map((data, index) => {
                        const targetData = changeUserInfo.menuAuth.filter((menuData) => menuData.code === data.menuCode)[0]
                        return (
                          <Card style={{ padding: '0', border: '1px solid #d6d6d6', borderTop: index === 0 ? '' : 'none' }} key={`Epic_${index}`}>
                            <Grid type="container" horizen="center">
                              <Grid type="item" area={6} style={{ padding: '12px' }} align="center" color="purple" colorWeight="200">
                                <Typography fontSize="body2">{data.menuName}</Typography>
                              </Grid>
                              <Grid type="item" area={18} style={{ paddingLeft: '16px' }}>
                                <Grid type="container" horizen="center">
                                  <Grid type="item">
                                    <Radio
                                      group={`Steam_${data.menuCode}_menuSet`}
                                      label="접근"
                                      size="small"
                                      checked={(targetData.read && !targetData.create && !targetData.delete) ?? false}
                                      value={'read'}
                                      onClick={() => changeMenuAuthRadioHandler(data.menuCode, 'read')}
                                      readOnly
                                    />
                                    {index !== 0 && (
                                      <Radio
                                        group={`Steam_${data.menuCode}_menuSet`}
                                        label="등록/수정/삭제"
                                        size="small"
                                        checked={(targetData.read && targetData.create && targetData.delete) ?? false}
                                        value="create_delete"
                                        onClick={() => changeMenuAuthRadioHandler(data.menuCode, 'create_delete')}
                                        readOnly
                                      />
                                    )}
                                    <Radio
                                      group={`Steam_${data.menuCode}_menuSet`}
                                      label="권한없음"
                                      size="small"
                                      checked={(!targetData.read && !targetData.create && !targetData.delete) ?? false}
                                      value="none"
                                      onClick={() => changeMenuAuthRadioHandler(data.menuCode, 'none')}
                                      readOnly
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Card>
                        )
                      })}
                    </Grid>
                  </Card>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid type="item" style={{ marginTop: '60px' }}>
        <Grid type="container" align="center" style={{ columnGap: '2%' }}>
          <Grid type="item" area={3}>
            <Button type="secondary" onClick={clickCancelButtonHandler}>
              취소
            </Button>
          </Grid>
          <Grid type="item" area={3}>
            <Button color="red" onClick={deleteUserHandler}>
              삭제
            </Button>
          </Grid>
          <Grid type="item" area={3}>
            <Button
              type={isChangeUserInfo || isChangeUserMenuAuth ? 'primary' : 'disabled'}
              disabled={!(isChangeUserInfo || isChangeUserMenuAuth)}
              onClick={updateUserHandler}
            >
              수정
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <LoadAdministratorModal
        modalState={loadAdminModalState}
        complitButtonCallback={menuAuthLoadCallbackHandler}
        cancelButtonCallback={menuAuthLoadCancelCallbackHandler}
      />
    </Grid>
  )
}

export default AdminAccountUpdate

const menus = headerMenuLists
  .map((data) => {
    return {
      code: data.menuCode,
      read: false,
      create: false,
      delete: false,
    }
  })
  .concat(
    detailMenuLists.Epic.map((data) => ({
      code: data.menuCode,
      read: false,
      create: false,
      delete: false,
    })),
  )
  .concat(
    detailMenuLists.Steam.map((data) => ({
      code: data.menuCode,
      read: false,
      create: false,
      delete: false,
    })),
  )
  .concat(
    detailMenuLists.AdminManagement.map((data) => ({
      code: data.menuCode,
      read: false,
      create: false,
      delete: false,
    })),
  )

const defaultUserInfo: I_userInfo = {
  name: '',
  email: '',
  department: '',
  position: '',
  roleCode: 'ROLE_USER',
  phone: '',
  seq: 0,
  status: 'Y',
  menuAuth: menus,
}

const checkUserRoleValue = (roleCode: string) => {
  switch (roleCode) {
    case 'ROLE_MASTER':
      return 0
    case 'ROLE_ADMIN':
      return 1
    case 'ROLE_USER':
      return 2
    default:
      return 2
  }
}
