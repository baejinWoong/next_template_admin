import Grid from '@core/components/Grid'
import TableBody from '@core/components/Table/TableBody'
import TableCell from '@core/components/Table/TableCell'
import TableContainer from '@core/components/Table/TableContainer'
import TableHeader from '@core/components/Table/TableHeader'
import TableRow from '@core/components/Table/TableRow'
import React from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import { getInActiveMembers } from 'api/adminApi'

import { useRecoilState } from 'recoil'
import { alertModalRecoil, typeInfoRecoil } from 'recoil/atom'
import Pagination from '@core/components/Pagination'
import Dropdown from '@core/components/Dropdown'
import Option from '@core/components/Dropdown/Option'
import Input from '@core/components/Input'
import Button from '@core/components/Button'
import useIsModalKeyDown from '@core/hooks/useIsModalKeyDown'
import { SearchMarkSvg } from '@core/icons'
import Typography from '@core/components/Typography'
import { I_colorType } from '@core/pallettes'
import { headerMenuLists } from 'components/common/Navigation/menuLists'
import { NextPage } from 'next'
import Card from '@core/components/Card'

interface I_userInfo {
  name: string
  email: string
  department: number
  position: number
  phone: string
  roleCode: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_MASTER'
  seq: number
  status: 'Y' | 'N' | 'S' | 'C'
  lastLoginTime: string
  registDate: string
  menuList: string[]
}

/**
 *
 */
const Index: NextPage<{ page: number; size: number }> = (props: { page: number; size: number }) => {
  const { page, size } = props
  const [alertState, setAlertState] = useRecoilState(alertModalRecoil)
  const [typeInfoState] = useRecoilState(typeInfoRecoil)

  const [tableState, setTableState] = React.useState({
    page,
    totalCount: 0,
    rowsPerPage: size,
  })

  const [isSearchInputFocus, setIsSearchInputFocus] = React.useState(false)
  const [searchStateSelect, setSearchStateSelect] = React.useState<'s,n' | 's' | 'n'>('s,n')
  const [searchSelect, setSearchSelect] = React.useState('all')
  const [searchValue, setSearchValue] = React.useState('')
  const [currentSearchStateSelect, setcurrentSearchStateSelect] = React.useState<'s,n' | 's' | 'n'>('s,n')
  const [currentSearchSelect, setcurrentSearchSelect] = React.useState('all')
  const [currentSearchValue, setcurrentSearchValue] = React.useState('')
  const [members, setMembers] = React.useState<I_userInfo[]>([])

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
    void getInActiveMembers({ keyword: searchValue, page: 1, pageSize: tableState.rowsPerPage, type: searchSelect, status: searchStateSelect }).then(
      (response) => {
        setcurrentSearchStateSelect(searchStateSelect)
        setcurrentSearchSelect(searchSelect)
        setcurrentSearchValue(searchValue)
        if (response.data?.status.code === 'E20002') {
          setMembers([])
          setTableState({ page: 1, rowsPerPage: tableState.rowsPerPage, totalCount: 0 })
        } else if (response.data?.status.code === 'E20000') {
          setMembers(response.data?.data.content)
          setTableState({ ...tableState, page: 1, totalCount: response.data?.data.totalElements })
        }
      },
    )
  }

  const changePageHandler = (page: number) => {
    void getInActiveMembers(
      currentSearchValue
        ? {
            page,
            pageSize: tableState.rowsPerPage,
            keyword: currentSearchValue,
            type: currentSearchSelect,
            status: currentSearchStateSelect,
          }
        : {
            page,
            pageSize: tableState.rowsPerPage,
            status: currentSearchStateSelect,
          },
    ).then((response) => {
      if (response.data?.status.code === 'E20000') {
        setMembers(response.data?.data.content)
        setTableState((prevState) => {
          return {
            ...prevState,
            page,
            totalCount: response.data?.data.totalElements,
          }
        })
        void router.push(`${router.pathname}?pages=${page}&sizes=${tableState.rowsPerPage}`)
      }
    })
  }

  const updateUserInfoHandler = (tagetUserSeq: number) => {
    void router.push(`${router.pathname}/${tagetUserSeq}`)
  }

  const searchSelectChangeHandler = (event: string | number) => {
    setSearchSelect(event as string)
  }

  const searchStateSelectChangeHandler = (event: string | number) => {
    setSearchStateSelect(event as 's,n' | 'n' | 's')
  }

  const searchInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
  }

  const checkedSearchInputFocusHandler = (is: boolean) => {
    setIsSearchInputFocus(is)
  }

  const changeTableRowPerPageHandler = (size: number) => {
    void getInActiveMembers({ keyword: searchValue, page: 1, pageSize: size, type: searchSelect, status: searchStateSelect }).then((response) => {
      if (response.data?.status.code === 'E20000') {
        setMembers(response.data.data.content)
        setTableState((prevState) => {
          return {
            rowsPerPage: size,
            page: 1,
            totalCount: response.data?.data.totalElements,
          }
        })
      }
    })

    void router.push(`${router.pathname}?pages=1&sizes=${size}`)
  }

  React.useEffect(() => {
    if (router.isReady)
      void getInActiveMembers({
        page,
        pageSize: size,
        status: 'n,s',
      }).then((response) => {
        if (response.data?.status.code === 'E20000') {
          setMembers(response.data?.data.content)
          setTableState({
            totalCount: response.data?.data.totalElements,
            page,
            rowsPerPage: size,
          })
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query])

  useIsModalKeyDown(() => {
    if (isSearchInputFocus) searchAdminHandler()
  }, [searchValue, searchSelect, isSearchInputFocus])

  return (
    <Grid type="container">
      <Grid type="item">
        <Card>
          <Grid type="container">
            <Grid type="item" area={3}>
              <Dropdown value={searchStateSelect} onChange={searchStateSelectChangeHandler}>
                <Option value="s,n">전체</Option>
                <Option value="s">중지</Option>
                <Option value="n">삭제</Option>
              </Dropdown>
            </Grid>
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
      <Grid type="item" style={{ marginTop: '24px' }}>
        <Grid type="container">
          <Grid type="item" area={21}>
            <Typography style={{ marginRight: '3px' }}>총</Typography>
            <Typography color="red" colorWeight="default">
              {tableState.totalCount.toLocaleString()}
            </Typography>
            <Typography style={{ marginLeft: '3px' }}>건</Typography>
          </Grid>
          <Grid type="item" area={3}>
            <Dropdown value={size} type="1" onChange={(state) => changeTableRowPerPageHandler(state as number)}>
              <Option value={10}>10개씩 보기</Option>
              <Option value={20}>20개씩 보기</Option>
              <Option value={50}>50개씩 보기</Option>
              <Option value={100}>100개씩 보기</Option>
            </Dropdown>
          </Grid>
        </Grid>
      </Grid>
      <Grid type="item" style={{ marginTop: '12px' }}>
        <Grid type="container">
          <Grid type="item">
            <TableContainer>
              <TableHeader>
                <TableRow>
                  <TableCell align="center">관리자 아이디</TableCell>
                  <TableCell align="center">휴대폰 번호</TableCell>
                  <TableCell align="center">이름</TableCell>
                  <TableCell align="center">유형</TableCell>
                  <TableCell align="center">접근 권한</TableCell>
                  <TableCell align="center">소속 부서</TableCell>
                  <TableCell align="center">상태</TableCell>
                  <TableCell align="center">중지/삭제일시</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.length > 0 ? (
                  members.map((row, index) => (
                    <TableRow
                      key={index}
                      hover={row.status !== 'N'}
                      onClick={() => {
                        row.status !== 'N' && updateUserInfoHandler(row.seq)
                      }}
                    >
                      <TableCell align="center">
                        <Typography fontSize="element1" color={convertStatus[row.status].rowColor} colorWeight={convertStatus[row.status].rowColorWeight}>
                          {row.email}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography fontSize="element1" color={convertStatus[row.status].rowColor} colorWeight={convertStatus[row.status].rowColorWeight}>
                          {row.phone?.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography fontSize="element1" color={convertStatus[row.status].rowColor} colorWeight={convertStatus[row.status].rowColorWeight}>
                          {row.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography fontSize="element1" color={convertStatus[row.status].rowColor} colorWeight={convertStatus[row.status].rowColorWeight}>
                          {typeInfoState.role.filter((filter) => filter.roleCode === row.roleCode)[0]?.roleName}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography fontSize="element1" color={convertStatus[row.status].rowColor} colorWeight={convertStatus[row.status].rowColorWeight}>
                          {row.menuList
                            .sort((a, b) => {
                              if (!a) return -1
                              else if (!b) return 1
                              else return a > b ? 1 : -1
                            })
                            .map((data, idx) =>
                              idx < row.menuList.length - 1
                                ? `${headerMenuLists.filter((filter) => filter.menuCode === data)[0].menuName}, `
                                : `${headerMenuLists.filter((filter) => filter.menuCode === data)[0].menuName}`,
                            )}
                        </Typography>
                      </TableCell>
                      {/* <TableCell align="center">
                        <Typography fontSize="element1" color={convertStatus[row.status].color} colorWeight={convertStatus[row.status].colorWeight}>
                          {convertStatus[row.status].name}
                        </Typography>
                      </TableCell> */}
                      <TableCell align="center">
                        <Typography fontSize="element1" color={convertStatus[row.status].rowColor} colorWeight={convertStatus[row.status].rowColorWeight}>
                          {typeInfoState.department.filter((data) => data.groupId === row.department)[0]?.groupName}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography fontSize="element1" color={convertStatus[row.status].rowColor} colorWeight={convertStatus[row.status].rowColorWeight}>
                          {convertStatus[row.status].name}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography fontSize="element1" color={convertStatus[row.status].rowColor} colorWeight={convertStatus[row.status].rowColorWeight}>
                          {row.registDate ? moment(row.registDate).format('YYYY-MM-DD HH:mm:ss') : '-'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} align="center" rowSpan={3}>
                      검색결과가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
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
  )
}

export default Index

Index.getInitialProps = async (ctx) => {
  const { query } = ctx
  if (query.pages && query.sizes)
    return {
      page: Number(query.pages),
      size: Number(query.sizes),
    }
  return {
    page: 1,
    size: 20,
  }
}

const convertStatus: {
  [index: string]: {
    name: string
    color: I_colorType['color']
    colorWeight: I_colorType['colorWeight']
    rowColor: I_colorType['color']
    rowColorWeight: I_colorType['colorWeight']
  }
} = {
  Y: { name: '정상', color: 'black', colorWeight: '700', rowColor: 'black', rowColorWeight: '700' },
  C: { name: '정상', color: 'black', colorWeight: '700', rowColor: 'black', rowColorWeight: '700' },
  S: { name: '차단', color: 'red', colorWeight: '500', rowColor: 'black', rowColorWeight: '700' },
  N: { name: '삭제', color: 'red', colorWeight: '700', rowColor: 'black', rowColorWeight: '500' },
}
