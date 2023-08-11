import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getMemberAuths, getAdminAuth, updateMultiAdminAuth } from 'api/adminApi'

import { useRecoilState } from 'recoil'
import { alertModalRecoil, tableRecoil, multiAuthUserInfoRecoil, confirmModalRecoil } from 'recoil/atom'
import Grid from '@core/components/Grid'
import TableBody from '@core/components/Table/TableBody'
import TableCell from '@core/components/Table/TableCell'
import TableContainer from '@core/components/Table/TableContainer'
import TableHeader from '@core/components/Table/TableHeader'
import TableRow from '@core/components/Table/TableRow'
import Card from '../../../@core/components/Card'
import Dropdown from '@core/components/Dropdown'
import Option from '@core/components/Dropdown/Option'
import Input from '@core/components/Input'
import Button from '@core/components/Button'
import useIsModalKeyDown from '@core/hooks/useIsModalKeyDown'
import { SearchMarkSvg, RedXIcon } from '@core/icons'
import Typography from '../../../@core/components/Typography'
import Pagination from '../../../@core/components/Pagination'
import Radio from '../../../@core/components/Radio'
import CheckBox from '../../../@core/components/CheckBox'

import { I_menuNameSet, detailMenuLists, headerMenuLists } from '../../../components/common/Navigation/menuLists'
import { getMenuFlat, getMenuParrentCode, getMenusAll } from 'components/common/Navigation/util'

interface I_userInfo {
  name: string
  email: string
  department: number
  position: number
  phone: string
  roleCode: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_MASTER'
  seq: number
  status: 'Y' | 'N' | 'S'
  lastLoginTime: string
  registDate: string
  menuList: string[]
}

interface I_menuAuth {
  code: string
  read: boolean
  create: boolean
  delete: boolean
}

interface I_resMenuAuth {
  menuCode: string
  menuRead: boolean
  menuCreate: boolean
  menuDelete: boolean
}

/**
 *
 */
const Edit = () => {
  const [tableState, setTableState] = useRecoilState(tableRecoil)
  const [alertState, setAlertState] = useRecoilState(alertModalRecoil)
  const [, setConfirmState] = useRecoilState(confirmModalRecoil)
  const [multiAuthUserInfoState, setMultiAuthUserInfoState] = useRecoilState(multiAuthUserInfoRecoil)

  const [isSearchInputFocus, setIsSearchInputFocus] = React.useState(false)
  const [searchSelect, setSearchSelect] = React.useState('all')
  const [searchValue, setSearchValue] = React.useState('')
  const [members, setMembers] = React.useState<I_userInfo[]>([])
  const [selectedAdminInfo, setSelectedAdminInfo] = useState<I_userInfo | undefined>(undefined)
  const [selectedAdminMenu, setSelectedAdminMenu] = useState<I_resMenuAuth[]>([])
  const [selectedParentCode, setSelectedParentCode] = useState<{ [string: string]: boolean }>({})

  const [, setPageAuth] = React.useState({
    menuRead: false,
    menuCreate: false,
    menuDelete: false,
  })

  const router = useRouter()

  const searchAdminHandler = () => {
    if (searchSelect !== 'all' && !searchValue) {
      setAlertState({
        ...alertState,
        alertText: '검색어를 입력해 주세요.',
        isOpen: true,
      })
      return false
    }
    void getMemberAuths({ keyword: searchValue, page: 1, pageSize: tableState.rowsPerPage, type: searchSelect, status: 'all' }).then((response) => {
      if (response.data?.status.code === 'E20002') {
        setMembers([])
        setTableState({ page: 1, rowsPerPage: 20, totalCount: 0 })
      } else if (response.data?.status.code === 'E20000') {
        setMembers(response.data?.data.content)
        setTableState({ ...tableState, page: 1, totalCount: response.data?.data?.totalElements })
      }
    })
  }

  const searchSelectChangeHandler = (event: string | number) => {
    setSearchSelect(event as string)
  }

  const searchInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
  }

  const checkedSearchInputFocusHandler = (is: boolean) => {
    setIsSearchInputFocus(is)
  }

  const changeSelectedAdminHandler = (userInfo: I_userInfo) => {
    setSelectedAdminInfo(userInfo)

    const resultObject: { [index: string]: boolean } = {}

    userInfo.menuList.forEach((item: string) => {
      resultObject[item] = false
    })

    setSelectedParentCode(resultObject)
  }

  const changePageHandler = (page: number) => {
    void getMemberAuths({
      page,
      pageSize: tableState.rowsPerPage,
    }).then((response) => {
      if (response.data?.status.code === 'E20000') {
        setMembers(response.data?.data.content)
        setTableState((prevState) => {
          return {
            ...prevState,
            page,
          }
        })
      }
    })
  }

  const clickDeleteUserHandler = (user: I_userInfo) => {
    setMultiAuthUserInfoState(
      multiAuthUserInfoState.filter((item, index) => {
        return item.seq !== user.seq
      }),
    )
  }

  const clickMultiAuthApplyHandler = () => {
    let parrentMenuCodes: string[] = []
    let resultArray: I_menuAuth[] = []

    setConfirmState({
      isOpen: true,
      alertText: '설정을 적용하시겠습니까?',
      completeButtonCallback: () => {
        const selectedParentMenu = Object.keys(selectedParentCode).filter((key) => selectedParentCode[key])

        selectedParentMenu.forEach((menu) => {
          const parrentMenu = headerMenuLists.find((find) => find.menuCode === menu)
          parrentMenuCodes = parrentMenuCodes.concat([menu])

          const parrentObjectForSelectAdminMenu = selectedAdminMenu.find((find) => find.menuCode === menu)
          if (parrentObjectForSelectAdminMenu) {
            resultArray = resultArray.concat([
              {
                code: parrentObjectForSelectAdminMenu.menuCode,
                create: parrentObjectForSelectAdminMenu.menuCreate,
                delete: parrentObjectForSelectAdminMenu.menuDelete,
                read: parrentObjectForSelectAdminMenu.menuRead,
              },
            ])
          } else if (parrentMenu) {
            resultArray = resultArray.concat([
              {
                code: parrentMenu.menuCode,
                create: false,
                delete: false,
                read: false,
              },
            ])
          }

          if (parrentMenu) {
            const parrentMenuName = parrentMenu.link
            getMenusAll(detailMenuLists[parrentMenuName])?.forEach((data) => {
              if (data.list) {
                parrentMenuCodes = parrentMenuCodes.concat([data.menuCode])
              }
            })
            getMenuFlat(detailMenuLists[parrentMenuName])?.forEach((data) => {
              const parrentCode = getMenuParrentCode(detailMenuLists[parrentMenuName], data.menuCode)
              const temp = selectedAdminMenu.find((find) => find.menuCode === data.menuCode)
              const parrentTemp = selectedAdminMenu.find((find) => find.menuCode === parrentCode)

              if (parrentTemp) {
                resultArray = resultArray.concat([
                  {
                    code: data.menuCode,
                    create: parrentTemp.menuCreate,
                    delete: parrentTemp.menuDelete,
                    read: parrentTemp.menuRead,
                  },
                ])
              } else if (temp) {
                resultArray = resultArray.concat([
                  {
                    code: temp.menuCode,
                    create: temp.menuCreate,
                    delete: temp.menuDelete,
                    read: temp.menuRead,
                  },
                ])
              } else {
                resultArray = resultArray.concat([
                  {
                    code: data.menuCode,
                    create: false,
                    delete: false,
                    read: false,
                  },
                ])
              }
            })
          }
        })

        const data = {
          seqList: multiAuthUserInfoState.map((user) => user.seq),
          parentMenu: parrentMenuCodes,
          menuAuth: resultArray,
        }

        void updateMultiAdminAuth(data).then((response) => {
          if (response.data.status.code === 'E20002')
            setAlertState({
              ...alertState,
              alertText: '적용이 완료되었습니다',
              isOpen: true,
              clickButtonCallback: () => {
                void router.push(`/AdminManagement/MultiAuthorized`)
              },
            })
        })
      },
    })
  }

  const clickMenuHandler = (menuCode: string) => {
    setSelectedParentCode({ ...selectedParentCode, [`${menuCode}`]: !selectedParentCode[`${menuCode}`] })
  }

  const convertMenuAuth = (menuCode: string) => {
    let resultText = ''

    const menu = selectedAdminMenu.filter((menu) => menu.menuCode.includes(menuCode))[0]

    if (menu?.menuRead) resultText += '접근'
    if (menu?.menuCreate) resultText += ', 등록, 수정'
    if (menu?.menuDelete) resultText += ', 삭제'

    return resultText === '' ? '권한 없음' : resultText
  }

  const clickRemoveAllUserHandler = () => {
    setConfirmState({
      isOpen: true,
      alertText: '모든 관리자를 목록에서 제외하시겠습니까?',
      completeButtonCallback: () => {
        setMultiAuthUserInfoState([])
      },
    })
  }

  const convertMenuCodeToMenuName = (menuCode: string) => {
    return headerMenuLists.filter((item) => {
      return item.menuCode === menuCode
    })[0].menuName
  }

  useEffect(() => {
    if (selectedAdminInfo !== undefined) {
      void getAdminAuth(selectedAdminInfo.seq).then((response) => {
        if (response.data?.status.code === 'E20000') {
          setSelectedAdminMenu(response.data.data)
        }
      })
    }
  }, [selectedAdminInfo])

  useEffect(() => {
    if (multiAuthUserInfoState.length === 0) {
      setAlertState({
        ...alertState,
        alertText: '선택된 관리자가 존재하지 않아\n권한 선택 및 설정이 취소되었습니다',
        isOpen: true,
        clickButtonCallback: () => {
          void router.push(`/AdminManagement/MultiAuthorized`)
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiAuthUserInfoState])

  React.useEffect(() => {
    const { pages, sizes } = router.query
    setTableState({
      ...tableState,
      page: parseInt(pages as string) || 1,
      totalCount: 0,
    })
    if (router.isReady)
      void getMemberAuths({
        page: parseInt(pages as string) || 1,
        pageSize: parseInt(sizes as string) || tableState.rowsPerPage,
      }).then((response) => {
        if (response.data?.status.code === 'E20000') {
          setMembers(response.data?.data.content)
          setTableState((privateState) => {
            return {
              page: parseInt(pages as string) || 1,
              totalCount: response.data?.data.totalElements,
              rowsPerPage: parseInt(sizes as string) || privateState.rowsPerPage,
            }
          })
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query])

  React.useEffect(() => {
    const userInfoData = JSON.parse(window.sessionStorage.getItem('loginUserInfo') ?? '{}')
    setPageAuth(
      userInfoData.menuAuth.menuAuth.filter((data: { menuCode: string }) => {
        return data.menuCode === 'ELMU1'
      })[0],
    )
  }, [])

  useIsModalKeyDown(() => {
    if (isSearchInputFocus) searchAdminHandler()
  }, [searchValue, searchSelect, isSearchInputFocus])

  return (
    <Grid type="container">
      <Grid type="item">
        <Grid type="container">
          <Grid type="item">
            <Typography>선택된 관리자 계정</Typography>
          </Grid>
          <Grid type="item">
            <Grid type="container">
              <Grid type="item" area={21}>
                <Grid type="container">
                  <Typography style={{ marginRight: '3px' }}>총</Typography>
                  <Typography color="red" colorWeight="default">
                    {multiAuthUserInfoState.length}
                  </Typography>
                  <Typography style={{ marginLeft: '3px' }}>건</Typography>
                </Grid>
              </Grid>
              <Grid type="item" area={3}>
                <Grid type="container" align="right">
                  <Button size="middum" widthSize="middum" onClick={clickRemoveAllUserHandler}>
                    전체 삭제
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid type="container">
              {multiAuthUserInfoState.map((item, index) => {
                return (
                  <div
                    key={item.seq}
                    style={{
                      border: '2px solid rgb(109, 104, 203)',
                      borderRadius: '20px',
                      height: '40px',
                      lineHeight: '40px',
                      padding: '0px 20px',
                      marginRight: '15px',
                      marginBottom: '15px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {item.name} ({item.email})
                    <span
                      style={{ marginLeft: '10px', cursor: 'pointer' }}
                      onClick={() => {
                        clickDeleteUserHandler(item)
                      }}
                    >
                      <i>{RedXIcon}</i>
                    </span>
                  </div>
                )
              })}
            </Grid>
          </Grid>

          <Grid type="item">
            <Grid type="container" style={{ borderTop: '1px solid black', margin: '30px 0px' }} />
          </Grid>

          <Grid type="item">
            <Typography style={{ fontWeight: 'bold' }}>설정할 관리자 권한 선택</Typography>
            <Card color="purple" colorWeight="500">
              <Typography fontSize="element1">
                위에 선택한 관리자 계정에 동일한 권한을 부여하기 위해 관리자를 검색 후, 선택하세요 <br />
                선택한 관리자의 플랫폼별 권한을 확인하여 필요한 플랫폼 권한을 선택하세요 <br />
                설정할 권한 선택이 완료되면 적용하기 버튼을 클릭하면 선택한 플랫폼 권한이 적용됩니다
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid type="container" style={{ padding: '5px', justifyContent: 'space-between', width: '100%' }}>
        <Grid type="item" style={{ border: '1px solid #D6D6D6', padding: '0px', background: '#FFFFFF', height: 'fit-content' }} area={11.8}>
          <Grid type="container">
            <Grid type="item" style={{ padding: '10px', background: '#edecf9' }}>
              <Typography fontSize="body1">관리자 검색</Typography>
            </Grid>
          </Grid>
          <Grid type="container" style={{ padding: '10px' }}>
            <Grid type="item">
              <Grid type="container">
                <Grid type="item">
                  <Grid type="container">
                    <Grid type="item" area={6}>
                      <Dropdown value={searchSelect} onChange={searchSelectChangeHandler}>
                        <Option value="all">전체</Option>
                        <Option value="name">이름</Option>
                        <Option value="email">이메일</Option>
                        <Option value="department">소속부서</Option>
                      </Dropdown>
                    </Grid>
                    <Grid type="item" area={10}>
                      <Input
                        id="search_input"
                        value={searchValue}
                        onChange={searchInputChangeHandler}
                        placeholder="검색"
                        onFocus={() => checkedSearchInputFocusHandler(true)}
                        onBlur={() => checkedSearchInputFocusHandler(false)}
                      />
                    </Grid>
                    <Grid type="item" area={6}>
                      <Button type="primary" size="middum" widthSize="middum" afterTagNode={SearchMarkSvg} onClick={searchAdminHandler}>
                        검색
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid type="item" style={{ margin: '10px 0px' }}>
                  <Typography fontSize="body2" style={{ marginRight: '3px' }}>
                    총
                  </Typography>
                  <Typography color="red" colorWeight="default" fontSize="body2">
                    {tableState.totalCount}
                  </Typography>
                  <Typography fontSize="body2" style={{ marginLeft: '3px' }}>
                    건
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid type="item">
              <Grid type="container">
                <Grid type="item">
                  <TableContainer>
                    <TableHeader>
                      <TableRow>
                        <TableCell align="center">선택</TableCell>
                        <TableCell align="center">이름(아이디)</TableCell>
                        <TableCell align="center">유형</TableCell>
                        <TableCell align="center">플랫폼 권한</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">
                            <Radio
                              group="selectAdmin"
                              size="small"
                              onChange={() => {
                                changeSelectedAdminHandler(row)
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            {row.name}({row.email})
                          </TableCell>
                          <TableCell align="center" width="20%">
                            {row.roleCode === 'ROLE_MASTER' ? 'MASTER' : row.roleCode === 'ROLE_ADMIN' ? 'ADMIN' : 'USER'}
                          </TableCell>
                          <TableCell align="center">
                            {row.menuList.length > 0
                              ? row.menuList
                                  .sort((a, b) => {
                                    if (!a) return -1
                                    else if (!b) return 1
                                    else return a > b ? -1 : 1
                                  })
                                  .map((data, idx) =>
                                    idx < row.menuList.length - 1
                                      ? `${headerMenuLists.filter((filter) => filter.menuCode === data)[0].menuName}, `
                                      : `${headerMenuLists.filter((filter) => filter.menuCode === data)[0].menuName}`,
                                  )
                              : '없음'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </TableContainer>
                </Grid>
                <Grid type="item" style={{ marginTop: '24px' }}>
                  <Pagination
                    page={tableState.page}
                    pageLabelNumber={5}
                    rowPerPage={tableState.rowsPerPage}
                    totalNumber={tableState.totalCount}
                    onPageChange={changePageHandler}
                    align="right"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid type="item" style={{ border: '1px solid #D6D6D6', padding: '0px', background: '#FFFFFF', height: 'fit-content' }} area={11.8}>
          <Grid type="container">
            <Grid type="item" style={{ padding: '10px', background: '#edecf9' }}>
              <Typography fontSize="body1">선택한 관리자 권한</Typography>
            </Grid>
          </Grid>

          {selectedAdminInfo === undefined && (
            <Grid type="container" style={{ height: '300px' }}>
              <Typography fontSize="body2" style={{ lineHeight: '300px', margin: '0 auto' }}>
                선택된 관리자가 없습니다
              </Typography>
            </Grid>
          )}

          {selectedAdminInfo !== undefined && (
            <Grid type="container" style={{ padding: '10px', justifyContent: 'space-between' }}>
              <Grid type="item" area={11} style={{ border: '1px solid #D6D6D6', borderBottom: '0px', padding: '0px' }}>
                <TableContainer>
                  <TableHeader>
                    <TableRow>
                      <TableCell>
                        <CheckBox
                          onChange={() => {
                            clickMenuHandler('ELMU4')
                          }}
                          checked={selectedParentCode.ELMU4}
                        />
                        통합 대시보드
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {selectedAdminMenu.filter((menu) => menu.menuCode === 'ELMU4')[0]?.menuCreate &&
                        selectedAdminMenu.filter((menu) => menu.menuCode === 'ELMU4')[0]?.menuDelete &&
                        selectedAdminMenu.filter((menu) => menu.menuCode === 'ELMU4')[0]?.menuRead
                          ? '권한 있음'
                          : '권한 없음'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </TableContainer>
              </Grid>

              <Grid type="item" area={11} style={{ border: '1px solid #D6D6D6', borderBottom: '0px', padding: '0px' }}>
                <TableContainer>
                  <TableHeader>
                    <TableRow>
                      <TableCell>
                        <CheckBox
                          onChange={() => {
                            clickMenuHandler('ELMU1')
                          }}
                          checked={selectedParentCode.ELMU1}
                        />
                        통합 관리자 관리
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {selectedAdminMenu.filter((menu) => menu.menuCode === 'ELMU1')[0]?.menuCreate &&
                        selectedAdminMenu.filter((menu) => menu.menuCode === 'ELMU1')[0]?.menuDelete &&
                        selectedAdminMenu.filter((menu) => menu.menuCode === 'ELMU1')[0]?.menuRead
                          ? '권한 있음'
                          : '권한 없음'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </TableContainer>
              </Grid>

              {Object.keys(selectedParentCode)
                .sort()
                .map((menuCode) => {
                  if (menuCode === 'ELMU4' || menuCode === 'ELMU1') return null

                  return (
                    <Grid key={menuCode} type="item" style={{ border: '1px solid #D6D6D6', marginTop: '20px', padding: '0px' }}>
                      <TableContainer>
                        <TableHeader>
                          <TableRow>
                            <TableCell>
                              <CheckBox
                                onChange={() => {
                                  clickMenuHandler(menuCode)
                                }}
                                checked={selectedParentCode[`${menuCode}`]}
                              />
                              {convertMenuCodeToMenuName(menuCode)} 권한
                            </TableCell>
                            <TableCell>
                              <div />
                            </TableCell>
                          </TableRow>
                        </TableHeader>
                      </TableContainer>
                      <div style={{ padding: '20px' }}>
                        <div style={{ border: '1px solid #D6D6D6' }}>
                          {detailMenuLists[`${convertMenuCodeToMenuName(menuCode) as I_menuNameSet['link']}`].map(
                            (item: { menuCode: string; menuName: string; link: string }) => {
                              return (
                                <div key={`Epic${item.menuCode}`} style={{ display: 'flex', borderBottom: '1px solid #D6D6D6' }}>
                                  <div style={{ width: '30%', borderRight: '1px solid #D6D6D6', textAlign: 'center', background: '#f6f6fc', padding: '10px' }}>
                                    {item.menuName}
                                  </div>
                                  <div style={{ width: '70%', padding: '10px' }}>{convertMenuAuth(item.menuCode)}</div>
                                </div>
                              )
                            },
                          )}
                        </div>
                      </div>
                    </Grid>
                  )
                })}
            </Grid>
          )}
        </Grid>
      </Grid>

      <Grid type="item">
        <Grid type="container" style={{ borderTop: '1px solid black', margin: '30px 0px' }} />
      </Grid>

      <Grid type="item" area={4} style={{ margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
        <Grid type="container">
          <Button
            type="secondary"
            size="middum"
            onClick={() => {
              void router.push(`/AdminManagement/MultiAuthorized`)
            }}
          >
            취소
          </Button>
        </Grid>
        <Grid type="container">
          <Button size="middum" onClick={clickMultiAuthApplyHandler}>
            적용하기
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Edit
