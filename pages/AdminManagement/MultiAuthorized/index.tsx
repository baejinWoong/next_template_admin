import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { getMultiAuthorizedUsers } from 'api/adminApi'

import { useRecoilState } from 'recoil'
import { alertModalRecoil, tableRecoil, multiAuthUserInfoRecoil, typeInfoRecoil } from 'recoil/atom'
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
import { SearchMarkSvg } from '@core/icons'
import Typography from '../../../@core/components/Typography'
import CheckBox from '../../../@core/components/CheckBox'

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

/**
 *
 */
const MultiAuthorized = () => {
  const [tableState, setTableState] = useRecoilState(tableRecoil)
  const [alertState, setAlertState] = useRecoilState(alertModalRecoil)
  const [, setMultiAuthUserInfoState] = useRecoilState(multiAuthUserInfoRecoil)
  const [typeInfoState] = useRecoilState(typeInfoRecoil)

  const [userLastId, setUserLastId] = useState(0)
  const [isSearchInputFocus, setIsSearchInputFocus] = React.useState(false)
  const [searchSelect, setSearchSelect] = React.useState('all')
  const [searchValue, setSearchValue] = React.useState('')
  const [members, setMembers] = React.useState<I_userInfo[]>([])
  const [selectedUserInfo, setSelectedUserInfo] = useState<I_userInfo[]>([])
  const [isMore, setIsMore] = React.useState<boolean>(false)

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
    void getMultiAuthorizedUsers({ keyword: searchValue, pageSize: tableState.rowsPerPage, type: searchSelect }).then((response) => {
      if (response.data?.status.code === 'E20002') {
        setMembers([])
        setUserLastId(0)
        setTableState({ page: 1, rowsPerPage: 20, totalCount: 0 })
      } else if (response.data?.status.code === 'E20000') {
        setMembers(response.data?.data)
        setTableState({ ...tableState, page: 1, totalCount: response.data?.data.length })

        if (response.data?.data.length < 20) setIsMore(false)
        else if (response.data?.data.length >= 20) {
          setUserLastId(response.data?.data.at(-1).seq)
          setIsMore(true)
        }
      }
    })
  }

  const clickMoreHandler = () => {
    void getMultiAuthorizedUsers({ keyword: searchValue, pageSize: tableState.rowsPerPage, type: searchSelect, lastId: userLastId }).then((response) => {
      if (response.data?.status.code === 'E20002') {
        setUserLastId(-9999)
      } else if (response.data?.status.code === 'E20000') {
        setMembers(members.concat(response.data?.data))
        setTableState({ ...tableState, page: 1, totalCount: response.data?.data.length })

        if (response.data?.data.length < 20) setUserLastId(-9999)
        else if (response.data?.data.length >= 20) setUserLastId(response.data?.data.at(-1).seq)
      }
    })
  }

  const clickMultiAuthorizedHandler = () => {
    setMultiAuthUserInfoState(selectedUserInfo)
    void router.push(`MultiAuthorized/edit`)
  }

  // const updateUserInfoHandler = (tagetUserSeq: number) => {
  //   void router.push(`AdminManagement/${tagetUserSeq}`)
  // }
  //
  // const addUserHandler = () => {
  //   void router.push(`AdminManagement/AdminAccountAdd`)
  // }

  const searchSelectChangeHandler = (event: string | number) => {
    setSearchSelect(event as string)
  }

  const searchInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
  }

  const checkedSearchInputFocusHandler = (is: boolean) => {
    setIsSearchInputFocus(is)
  }

  const checkedUserHandler = (event: React.ChangeEvent<HTMLInputElement>, userInfo: I_userInfo) => {
    if (event.target.checked) setSelectedUserInfo(selectedUserInfo.concat(userInfo))
    else {
      setSelectedUserInfo(
        selectedUserInfo.filter((value) => {
          return value.seq !== userInfo.seq
        }),
      )
    }
  }

  const checkedChangeAllUserHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.checked) {
      setSelectedUserInfo(members)
    } else {
      setSelectedUserInfo([])
    }
  }

  React.useEffect(() => {
    const { pages, sizes } = router.query
    setTableState({
      ...tableState,
      page: parseInt(pages as string) || 1,
      totalCount: 0,
    })
    if (router.isReady)
      void getMultiAuthorizedUsers({
        pageSize: parseInt(sizes as string) || tableState.rowsPerPage,
      }).then((response) => {
        if (response.data?.status.code === 'E20000') {
          setMembers(response.data?.data)
          setTableState((privateState) => {
            return {
              page: parseInt(pages as string) || 1,
              totalCount: response.data?.data.length,
              rowsPerPage: parseInt(sizes as string) || privateState.rowsPerPage,
            }
          })

          if (response.data?.data.length < 20) setIsMore(false)
          else if (response.data?.data.length >= 20) {
            setUserLastId(response.data?.data.at(-1).seq)
            setIsMore(true)
          }
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
        <Card>
          <Grid type="container">
            <Grid type="item" area={3}>
              <Dropdown value={searchSelect} onChange={searchSelectChangeHandler}>
                <Option value="all">전체</Option>
                <Option value="name">이름</Option>
                <Option value="email">이메일</Option>
                <Option value="department">소속부서</Option>
              </Dropdown>
            </Grid>
            <Grid type="item" area={12}>
              <Input
                id="search_input"
                value={searchValue}
                onChange={searchInputChangeHandler}
                placeholder="검색"
                onFocus={() => checkedSearchInputFocusHandler(true)}
                onBlur={() => checkedSearchInputFocusHandler(false)}
              />
            </Grid>
            <Grid type="item" area={3}>
              <Button type="primary" size="middum" widthSize="middum" afterTagNode={SearchMarkSvg} onClick={searchAdminHandler}>
                검색
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid>
        <Card color="purple" colorWeight="500" style={{ marginTop: '24px' }}>
          <Typography fontSize="element1">다수의 관리자를 선택하여 다른 관리자의 권한을 복사하여 동일하게 설정할 수 있습니다</Typography>
        </Card>
      </Grid>
      <Grid type="item" style={{ marginTop: '24px' }}>
        <Grid type="container">
          <Grid type="item" area={21}>
            <Typography style={{ marginRight: '3px' }}>총</Typography>
            <Typography color="red" colorWeight="default">
              {tableState.totalCount}
            </Typography>
            <Typography style={{ marginLeft: '3px' }}>건</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid type="item" style={{ marginTop: '12px' }}>
        <Grid type="container">
          <Grid type="item">
            <TableContainer>
              <TableHeader>
                <TableRow>
                  <TableCell align="center">
                    <CheckBox onChange={checkedChangeAllUserHandler} />
                  </TableCell>
                  <TableCell align="center">아이디</TableCell>
                  <TableCell align="center">전화번호</TableCell>
                  <TableCell align="center">사용자명</TableCell>
                  <TableCell align="center">통합관리자 유형</TableCell>
                  <TableCell align="center">소속부서</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.length > 0 ? (
                  members.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">
                        <CheckBox
                          checked={!!selectedUserInfo.find((find) => find.seq === row.seq)}
                          onChange={(event) => {
                            checkedUserHandler(event, row)
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">{row.email}</TableCell>
                      <TableCell align="center">{row.phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)}</TableCell>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.roleCode === 'ROLE_MASTER' ? 'MASTER' : row.roleCode === 'ROLE_ADMIN' ? 'ADMIN' : 'USER'}</TableCell>
                      <TableCell align="center">{typeInfoState.department.find((data) => data.groupId === row.department)?.groupName}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" rowSpan={7}>
                      검색결과가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </TableContainer>
          </Grid>
          {isMore && (
            <Button type="secondary" size="middum" widthSize="fullwide" onClick={clickMoreHandler}>
              더 보기
            </Button>
          )}
          <Grid type="item" style={{ marginTop: 50 }}>
            <Grid type="container" align="center">
              <Grid type="item" area={4}>
                <Button
                  type={selectedUserInfo.length !== 0 ? 'primary' : 'disabled'}
                  disabled={selectedUserInfo.length === 0}
                  size="middum"
                  onClick={clickMultiAuthorizedHandler}
                >
                  선택 계정 권한 설정하기
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default MultiAuthorized
