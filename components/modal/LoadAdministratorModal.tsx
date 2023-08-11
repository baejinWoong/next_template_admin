import Button from '@core/components/Button'
import Card from '@core/components/Card'
import Dropdown from '@core/components/Dropdown'
import Option from '@core/components/Dropdown/Option'
import Grid from '@core/components/Grid'
import Input from '@core/components/Input'
import Pagination from '@core/components/Pagination'
import Radio from '@core/components/Radio'
import TableBody from '@core/components/Table/TableBody'
import TableCell from '@core/components/Table/TableCell'
import TableContainer from '@core/components/Table/TableContainer'
import TableHeader from '@core/components/Table/TableHeader'
import TableRow from '@core/components/Table/TableRow'
import Typography from '@core/components/Typography'
import useIsModalKeyDown from '@core/hooks/useIsModalKeyDown'
import Modal from '@core/modal'
import { getMemberAuths, getMemberDetail } from 'api/adminApi'
import { detailMenuLists, headerMenuLists } from 'components/common/Navigation/menuLists'
import React from 'react'
import { useRecoilState } from 'recoil'
import { alertModalRecoil, typeInfoRecoil } from 'recoil/atom'

interface I_loadAdministratorModal {
  modalState: {
    isOpen: boolean
    type: 'Epic' | 'Steam'
  }
  complitButtonCallback: (result: I_menuAuthSet[]) => void
  cancelButtonCallback: (type: 'Epic' | 'Steam') => void
}

interface I_menuAuthSet {
  code: string
  read: boolean
  create: boolean
  delete: boolean
}

interface I_userInfo {
  name: string
  email: string
  department: string
  position: '대표이사' | '이사' | '부장' | '과장' | '대리' | '사원' | '인턴'
  phone: string
  roleCode: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_MASTER'
  seq: number
  status: 'Y' | 'N' | 'S'
  lastLoginTime: string
  registDate: string
  menuList: string[]
}

interface I_selectUserInfo {
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

/**
 *
 */
const LoadAdministratorModal = (props: I_loadAdministratorModal) => {
  const { modalState, complitButtonCallback, cancelButtonCallback } = props

  const [searchSelect, setSearchSelect] = React.useState('name')
  const [searchValue, setSearchValue] = React.useState('')
  const [currentSearchSelect, setCurrentSearchSelect] = React.useState('name')
  const [currentSearchValue, setCurrentSearchValue] = React.useState('')
  const [isSearchInputFocus, setIsSearchInputFocus] = React.useState(false)

  const [members, setMembers] = React.useState<I_userInfo[]>([])
  const [selectMembers, setSelectMembers] = React.useState<I_selectUserInfo>()

  const [tableState, setTableState] = React.useState({
    page: 1,
    totalCount: 0,
    rowsPerPage: 5,
  })
  const [alertState, setAlertState] = useRecoilState(alertModalRecoil)
  const [typeInfoState] = useRecoilState(typeInfoRecoil)

  const changeSelectUserHandler = (seq: number) => {
    void getMemberDetail({ seq }).then((response) => {
      if (response.data?.status.code === 'E20000') {
        setSelectMembers({ ...response.data.data })
      }
    })
  }

  const changeSearchSelect = (value: string | number) => {
    setSearchSelect(value as string)
  }

  const changeSearchValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.currentTarget.value)
  }

  const checkedSearchInputFocusHandler = (is: boolean) => {
    setIsSearchInputFocus(is)
  }

  const searchAdminHandler = () => {
    if (!searchValue && searchSelect !== 'name') {
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
        setTableState({ page: 1, rowsPerPage: tableState.rowsPerPage, totalCount: 0 })
      } else if (response.data?.status.code === 'E20000') {
        setMembers(response.data?.data.content)
        setTableState({ ...tableState, page: 1, totalCount: response.data?.data.totalElements })
      }
      setCurrentSearchSelect(searchSelect)
      setCurrentSearchValue(searchValue)
    })
  }

  const changePageHandler = (page: number) => {
    void getMemberAuths({
      page,
      pageSize: tableState.rowsPerPage,
      keyword: currentSearchValue,
      type: currentSearchSelect,
      status: 'all',
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

  const closeModalHandler = () => {
    setSelectMembers(undefined)
    setMembers([])
    setSearchSelect('name')
    setSearchValue('')
    cancelButtonCallback(modalState.type)
  }

  const complitHandler = () => {
    const menus = detailMenuLists[modalState.type].map((data) => {
      const targetUserMenu = selectMembers?.menuAuth.filter((menu) => data.menuCode === menu.code)[0]
      if (targetUserMenu) return targetUserMenu
      return {
        code: data.menuCode,
        read: false,
        create: false,
        delete: false,
      }
    })
    if (selectMembers) complitButtonCallback(menus)
    setSelectMembers(undefined)
  }

  React.useEffect(() => {
    if (modalState.isOpen) {
      void getMemberAuths({
        page: 1,
        pageSize: 5,
        status: 'all',
      }).then((response) => {
        if (response.data?.status.code === 'E20000') {
          setMembers(response.data?.data.content)
          setTableState((privateState) => {
            return {
              page: 1,
              totalCount: response.data.data.totalElements,
              rowsPerPage: 5,
            }
          })
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState.isOpen])

  useIsModalKeyDown(() => {
    if (isSearchInputFocus) searchAdminHandler()
  }, [isSearchInputFocus, searchValue])

  return (
    <Modal open={modalState.isOpen}>
      <Card style={{ minWidth: '60vw' }}>
        <Grid type="container" style={{ marginBottom: '8px' }}>
          <Grid type="item">
            <Typography fontSize="subtitle2" style={{ fontWeight: '700' }}>
              관리자 권한 불러오기
            </Typography>
          </Grid>
        </Grid>
        <Grid type="container" horizen="center" align="center">
          <Grid type="item" area={3}>
            <Dropdown value={searchSelect} onChange={changeSearchSelect}>
              <Option value="name">이름</Option>
              <Option value="email">아이디</Option>
            </Dropdown>
          </Grid>
          <Grid type="item" area={12}>
            <Input
              onChange={changeSearchValue}
              value={searchValue}
              onFocus={() => checkedSearchInputFocusHandler(true)}
              onBlur={() => checkedSearchInputFocusHandler(false)}
              placeholder="검색"
            />
          </Grid>
          <Grid type="item" area={3}>
            <Button onClick={searchAdminHandler}>검색</Button>
          </Grid>
        </Grid>
        <Grid type="container">
          <Grid type="item" area={14}>
            <Grid type="container">
              <Grid type="item" area={21}>
                <Typography style={{ marginRight: '3px' }}>총</Typography>
                <Typography color="red" colorWeight="default">
                  {tableState.totalCount.toLocaleString()}
                </Typography>
                <Typography style={{ marginLeft: '3px' }}>건</Typography>
              </Grid>
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
                    {members.length > 0 ? (
                      members.map((row, index) => (
                        <TableRow key={`member_${index}`}>
                          <TableCell align="center">
                            <Radio group="selectAdmin" onClick={() => changeSelectUserHandler(row.seq)} readOnly checked={selectMembers?.seq === row.seq} />
                          </TableCell>
                          <TableCell align="center">
                            {row.name}({row.email})
                          </TableCell>
                          <TableCell align="center">{typeInfoState.role.find((data) => data.roleCode === row.roleCode)?.roleName}</TableCell>
                          <TableCell align="center">
                            {row.menuList.filter((filter) => filter !== 'ELMU4' && filter !== 'ELMU1').length > 0
                              ? row.menuList
                                  .filter((filter) => filter !== 'ELMU4' && filter !== 'ELMU1')
                                  .map((data) => headerMenuLists.find((filter) => filter.menuCode === data)?.menuName)
                                  .sort((a, b) => {
                                    if (!a) return -1
                                    else if (!b) return 1
                                    else return a > b ? -1 : 1
                                  })
                                  .toString()
                              : '없음'}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center" rowSpan={3}>
                          검색결과가 없습니다.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </TableContainer>
              </Grid>
              <Grid type="item" style={{ marginTop: '12px' }}>
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
          <Grid type="item" area={10}>
            <Grid type="container">
              <Grid type="item">
                <Typography>&nbsp;</Typography>
              </Grid>
              <Grid type="item">
                <Card>
                  <Grid type="container">
                    <Grid type="item">
                      <Typography fontSize="body2">선택한 관리자 권한</Typography>
                    </Grid>
                    <Grid type="item">
                      <Card style={{ padding: '0' }}>
                        <Grid type="item" align="center" color="black" colorWeight="300" style={{ padding: '4px' }}>
                          <Typography>{modalState.type} 권한</Typography>
                        </Grid>
                        <Grid type="item" style={{ padding: '8px' }}>
                          {detailMenuLists[modalState.type].map((data, index) => {
                            return (
                              <Card style={{ padding: '0', border: '1px solid #d6d6d6', borderTop: index === 0 ? '' : 'none' }} key={`Epic_${index}`}>
                                <Grid type="container" horizen="center">
                                  <Grid type="item" area={6} style={{ padding: '4px' }} align="center" color="purple" colorWeight="200">
                                    <Typography fontSize="element2">{data.menuName}</Typography>
                                  </Grid>
                                  <Grid type="item" area={18} style={{ paddingLeft: '16px' }}>
                                    <Grid type="container" horizen="center">
                                      <Grid type="item">
                                        {selectMembers && selectMembers.menuAuth.filter((menu) => menu.code === data.menuCode).length > 0 ? (
                                          <>
                                            <Typography fontSize="element2">
                                              {selectMembers?.menuAuth.filter((menu) => menu.code === data.menuCode)[0].read ? '접근' : ''}
                                            </Typography>
                                            <Typography fontSize="element2">
                                              {selectMembers?.menuAuth.filter((menu) => menu.code === data.menuCode)?.[0].create ? ', 등록, 수정' : ''}
                                            </Typography>
                                            <Typography fontSize="element2">
                                              {selectMembers?.menuAuth.filter((menu) => menu.code === data.menuCode)?.[0].delete ? ', 삭제' : ''}
                                            </Typography>
                                          </>
                                        ) : (
                                          <Typography fontSize="element2">권한 없음</Typography>
                                        )}
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Card>
                            )
                          })}
                        </Grid>
                      </Card>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid type="container" align="center" style={{ marginTop: '14px' }}>
          <Grid type="item" area={12}>
            <Grid type="container" style={{ justifyContent: 'space-between' }}>
              <Grid type="item" area={10}>
                <Button type="secondary" onClick={closeModalHandler}>
                  취소
                </Button>
              </Grid>
              <Grid type="item" area={10}>
                <Button onClick={complitHandler} disabled={!selectMembers} type={!selectMembers ? 'disabled' : 'primary'}>
                  적용하기
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Modal>
  )
}

export default LoadAdministratorModal
