import Button from '@core/components/Button'
import Card from '@core/components/Card'
import Dropdown from '@core/components/Dropdown'
import Option from '@core/components/Dropdown/Option'
import Grid from '@core/components/Grid'
import Input from '@core/components/Input'
import Pagination from '@core/components/Pagination'
import TableBody from '@core/components/Table/TableBody'
import TableCell from '@core/components/Table/TableCell'
import TableContainer from '@core/components/Table/TableContainer'
import TableHeader from '@core/components/Table/TableHeader'
import TableRow from '@core/components/Table/TableRow'
import Typography from '@core/components/Typography'
import useIsModalKeyDown from '@core/hooks/useIsModalKeyDown'
import { SearchMarkSvg } from '@core/icons'
import { I_colorType } from '@core/pallettes'
import { getToken } from 'api/adminApi'
import { getMemberExcelDownload, getInActiveMembers } from 'api/epicApi'
import { I_getMemberExcelDownloadProps } from 'api/type/epicInterface'
import moment from 'moment'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

interface I_account {
  seq: number
  accountType: 'N' | 'C'
  provider: 'Epic'
  accountName: string
  nickName: string
  status: string
  gold: number
  gem: number
  registDateTime: string
  lastLoginTime: string
}

const DEFAULTSTATUS: Array<'N' | 'C'> = ['N', 'C']
const DEFAULTSELECT: Array<'Y' | 'N' | 'P' | 'D'> = ['N', 'P']

/**
 *
 */
const Index: NextPage<{ page: number; size: number }> = (props: { page: number; size: number }) => {
  const { page, size } = props

  const [accounts, setAccounts] = React.useState<I_account[]>([])

  const [tableState, setTableState] = React.useState({
    page,
    totalCount: 0,
    rowsPerPage: size,
  })

  const [isSearchInputFocus, setIsSearchInputFocus] = React.useState(false)
  const [searchStatusSelect, setSearchStatusSelect] = React.useState<'A' | 'Y' | 'N' | 'P' | 'D'>('A')
  const [searchStatusSelectList, setSearchStatusSelectList] = React.useState<Array<'Y' | 'N' | 'P' | 'D'>>(DEFAULTSELECT)
  const [searchValue, setSearchValue] = React.useState('')
  const [currentSearchStatusSelectList, setCurrentSearchStatusSelectList] = React.useState<Array<'Y' | 'N' | 'P' | 'D'>>(DEFAULTSELECT)
  const [currentSearchValue, setCurrentSearchValue] = React.useState('')

  const router = useRouter()

  const clickAccountDetailHandler = (data: string) => {
    void router.push(`${router.pathname}/${data}`)
  }

  const changeTableRowPerPageHandler = (size: number) => {
    void getInActiveMembers(
      searchValue
        ? {
            page: 1,
            pageSize: size,
            keyword: currentSearchValue,
            type: DEFAULTSTATUS,
            state: currentSearchStatusSelectList,
          }
        : {
            page: 1,
            pageSize: size,
            type: DEFAULTSTATUS,
            state: currentSearchStatusSelectList,
          },
    ).then((response) => {
      if (response.data?.status.code === 'E20000') {
        setAccounts(response.data.data.content)
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

  const changePageHandler = (page: number) => {
    void getInActiveMembers(
      searchValue
        ? {
            page,
            pageSize: tableState.rowsPerPage,
            keyword: currentSearchValue,
            type: DEFAULTSTATUS,
            state: currentSearchStatusSelectList,
          }
        : {
            page,
            pageSize: tableState.rowsPerPage,
            type: DEFAULTSTATUS,
            state: currentSearchStatusSelectList,
          },
    ).then((response) => {
      if (response.data?.status.code === 'E20000') {
        setAccounts(response.data?.data.content)
        setTableState((prevState) => {
          return {
            ...prevState,
            page,
            totalCount: response.data?.data.totalElements,
          }
        })
      }
    })
    void router.push(`${router.pathname}?pages=${page}&sizes=${tableState.rowsPerPage}`)
  }

  const changeSearchValueHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
  }

  const changeSearchStatusHandler = (value: string | number) => {
    setSearchStatusSelect(value as 'A' | 'Y' | 'N' | 'P' | 'D')
    if (value === 'A') {
      setSearchStatusSelectList(['N', 'P'])
    } else {
      setSearchStatusSelectList([value as 'Y' | 'N' | 'P' | 'D'])
    }
  }

  const searchUserHandler = () => {
    setCurrentSearchStatusSelectList(searchStatusSelectList)
    setCurrentSearchValue(searchValue)
    void getInActiveMembers({ keyword: searchValue, page: 1, pageSize: tableState.rowsPerPage, type: DEFAULTSTATUS, state: searchStatusSelectList }).then(
      (response) => {
        if (response.data?.status.code === 'E20002') {
          setAccounts([])
          setTableState({ page: 1, rowsPerPage: tableState.rowsPerPage, totalCount: 0 })
        } else if (response.data?.status.code === 'E20000') {
          setAccounts(response.data?.data.content)
          setTableState({ ...tableState, page: 1, totalCount: response.data?.data.totalElements })
        }
      },
    )
  }

  const checkedSearchInputFocusHandler = (is: boolean) => {
    setIsSearchInputFocus(is)
  }

  const clickExcelDownloadHandler = () => {
    const params: I_getMemberExcelDownloadProps = searchValue
      ? {
          keyword: searchValue,
          state: searchStatusSelectList,
          type: DEFAULTSTATUS,
        }
      : {
          state: searchStatusSelectList,
          type: DEFAULTSTATUS,
        }

    void getToken().then(() => {
      void getMemberExcelDownload(params).then((response) => {
        const downloadUrl = window.URL.createObjectURL(response.data)
        const downloadTag = document.createElement('a')
        downloadTag.download = `${moment().format('YYYY_MM_DD')}_EPIC회사계정목록.csv`
        downloadTag.href = downloadUrl
        document.body.appendChild(downloadTag)
        downloadTag.click()
        document.body.removeChild(downloadTag)
        window.URL.revokeObjectURL(downloadUrl)
      })
    })
  }

  React.useEffect(() => {
    if (router.isReady)
      void getInActiveMembers({
        page,
        pageSize: size,
        type: DEFAULTSTATUS,
        state: DEFAULTSELECT,
      }).then((response) => {
        if (response.data?.status.code === 'E20000') {
          setAccounts(response.data?.data.content)
          setTableState((privateState) => {
            return {
              totalCount: response.data?.data.totalElements,
              page,
              rowsPerPage: size,
            }
          })
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query])

  useIsModalKeyDown(() => {
    if (isSearchInputFocus) searchUserHandler()
  }, [searchValue, isSearchInputFocus])

  return (
    <Grid type="container">
      <Grid type="item">
        <Card>
          <Grid type="container" style={{ justifyContent: 'space-between' }}>
            <Grid type="item" area={4} horizen="center">
              <Grid type="container">
                <Grid type="item" area={8} horizen="center" align="center">
                  <Typography>상태</Typography>
                </Grid>
                <Grid type="item" area={16}>
                  <Dropdown value={searchStatusSelect} onChange={changeSearchStatusHandler}>
                    <Option value="A">전체</Option>
                    <Option value="N">탈퇴</Option>
                    <Option value="P">제재</Option>
                  </Dropdown>
                </Grid>
              </Grid>
            </Grid>
            <Grid type="item" area={16}>
              <Grid type="container" style={{ justifyContent: 'space-between' }}>
                <Grid type="item" area={16}>
                  <Input
                    onChange={changeSearchValueHandler}
                    value={searchValue}
                    onFocus={() => checkedSearchInputFocusHandler(true)}
                    onBlur={() => checkedSearchInputFocusHandler(false)}
                    placeholder="닉네임 검색"
                  />
                </Grid>
                <Grid type="item" area={4}>
                  <Button size="middum" fontSize="body2" onClick={searchUserHandler} afterTagNode={SearchMarkSvg}>
                    검색
                  </Button>
                </Grid>
              </Grid>
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
        <TableContainer>
          <TableHeader>
            <TableRow>
              <TableCell align="center">번호</TableCell>
              <TableCell align="center">유형</TableCell>
              <TableCell align="center">플랫폼</TableCell>
              <TableCell align="center">닉네임</TableCell>
              <TableCell align="center">상태</TableCell>
              <TableCell align="center">보유 재화</TableCell>
              <TableCell align="center">가입일시</TableCell>
              <TableCell align="center">최근 접속일시</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.length > 0 ? (
              accounts.map((data, index) => {
                return (
                  <TableRow key={`accounts_${index}`} hover onClick={() => clickAccountDetailHandler(data.seq.toString())}>
                    <TableCell align="center">
                      <Typography fontSize="element1">{data.seq}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontSize="element1">{data.accountType === 'N' ? '일반계정' : '회사계정'}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontSize="element1">{data.provider}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontSize="element1">{data.nickName}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontSize="element1" color={convertStatus[data.status].color}>
                        {convertStatus[data.status].name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography wrap="p" fontSize="element2">
                        Gem:&nbsp;{data.gem ?? 0}
                      </Typography>
                      <Typography wrap="p" fontSize="element2">
                        gold:&nbsp;{data.gold ?? 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{data.registDateTime ? moment(data.registDateTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</TableCell>
                    <TableCell align="center">{data.lastLoginTime ? moment(data.lastLoginTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center" rowSpan={3}>
                  검색결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableContainer>
      </Grid>
      <Grid type="item" style={{ marginTop: '12px', padding: '0' }}>
        <Grid type="container" horizen="center">
          <Grid type="item" area={8}>
            <Grid type="container">
              <Grid type="item" area={8}>
                <Button color="excel" onClick={clickExcelDownloadHandler}>
                  엑셀 다운로드
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid type="item" area={8} style={{ padding: '0' }}>
            <Pagination
              page={tableState.page}
              pageLabelNumber={5}
              rowPerPage={tableState.rowsPerPage}
              totalNumber={tableState.totalCount}
              onPageChange={changePageHandler}
              align="center"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

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

export default Index

const convertStatus: {
  [index: string]: { name: string; color: I_colorType['color']; colorWeight: I_colorType['colorWeight'] }
} = {
  Y: { name: '정상', color: 'black', colorWeight: '700' },
  N: { name: '탈퇴', color: 'red', colorWeight: '700' },
  D: { name: '휴면', color: 'black', colorWeight: '500' },
  P: { name: '제재', color: 'yellow', colorWeight: '700' },
}
