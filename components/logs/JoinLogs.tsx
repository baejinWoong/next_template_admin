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
import { getMemberLoginLogExcelDownload, getMemberLoginLogs, getToken } from 'api/adminApi'
import moment from 'moment'
import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useRecoilState } from 'recoil'
import { alertModalRecoil, typeInfoRecoil } from 'recoil/atom'

interface I_loginLogData {
  logId: number
  registDateTime: string
  email: string
  name: string
  IP: string
  department: number
  menuCode: string
  menuName: string
  contents: string
}

/**
 *
 */
const JoinLogs = () => {
  const [searchStartDate, setSearchStartDate] = React.useState<Date>(new Date(moment().subtract(7, 'day').format('YYYY-MM-DD')))
  const [searchEndDate, setSearchEndDate] = React.useState<Date>(new Date(moment().format('YYYY-MM-DD')))

  const [logs, setLogs] = React.useState<I_loginLogData[]>([])

  const [searchSelectAdminType, setSearchSelectAdminType] = React.useState<'name' | 'email'>('name')
  const [searchAdminKeyword, setSearchAdminKeyword] = React.useState<string>('')
  const [departmentCode, setdepartmentCode] = React.useState<'all' | number>('all')

  const [isSearchInputFocus, setIsSearchInputFocus] = React.useState(false)

  const [, setAlertModalState] = useRecoilState(alertModalRecoil)
  const [typeInfoState] = useRecoilState(typeInfoRecoil)

  const [tableState, setTableState] = React.useState({
    page: 1,
    totalCount: 0,
    rowsPerPage: 20,
  })

  const changeSearchStartDate = (date: Date) => {
    if (moment(date).isAfter(new Date().setDate(new Date().getDate() + 1))) {
      setAlertModalState({
        alertText: '당일까지 선택 가능합니다.',
        isOpen: true,
      })
    } else if (moment(date).isSameOrBefore(searchEndDate)) {
      setSearchStartDate(date)
    } else {
      setAlertModalState({
        alertText: '종료일 이전의 날짜를 입력해 주세요.',
        isOpen: true,
      })
    }
  }

  const changeSearchEndDate = (date: Date) => {
    if (moment(date).isAfter(new Date())) {
      setAlertModalState({
        alertText: '당일까지 선택 가능합니다.',
        isOpen: true,
      })
    } else if (moment(date).isSameOrAfter(searchStartDate)) {
      setSearchEndDate(date)
    } else {
      setAlertModalState({
        alertText: '시작일 이후 날짜를 입력해 주세요.',
        isOpen: true,
      })
    }
  }

  const clickExcelDownloadHandler = () => {
    void getToken().then(() => {
      void getMemberLoginLogExcelDownload({
        startDate: moment(searchStartDate).format('YYYY-MM-DD'),
        endDate: moment(searchEndDate).format('YYYY-MM-DD'),
        adminFilter: searchSelectAdminType,
        adminKeyword: searchAdminKeyword,
        departmentCode,
      }).then((response) => {
        const downloadUrl = window.URL.createObjectURL(response.data)
        const downloadTag = document.createElement('a')
        downloadTag.download = `${moment().format('YYYY_MM_DD')}_어드민접속로그.csv`
        downloadTag.href = downloadUrl
        document.body.appendChild(downloadTag)
        downloadTag.click()
        document.body.removeChild(downloadTag)
        window.URL.revokeObjectURL(downloadUrl)
      })
    })
  }

  const searchLogsHandler = () => {
    void getMemberLoginLogs({
      startDate: moment(searchStartDate).format('YYYY-MM-DD'),
      endDate: moment(searchEndDate).format('YYYY-MM-DD'),
      adminFilter: searchSelectAdminType,
      page: 1,
      pageSize: tableState.rowsPerPage,
      adminKeyword: searchAdminKeyword,
      departmentCode,
    }).then((response) => {
      if (response.data.status.code === 'E20002') {
        setLogs([])
        setTableState({ page: 1, rowsPerPage: tableState.rowsPerPage, totalCount: 0 })
      } else if (response.data.status.code === 'E20000') {
        setLogs(response.data.data.content)
        setTableState((prev) => ({
          ...prev,
          page: 1,
          totalCount: response.data.data.totalElements,
        }))
      }
    })
  }

  const changeTableRowPerPageHandler = (size: number) => {
    void getMemberLoginLogs({
      startDate: moment(searchStartDate).format('YYYY-MM-DD'),
      endDate: moment(searchEndDate).format('YYYY-MM-DD'),
      adminFilter: searchSelectAdminType,
      page: 1,
      pageSize: tableState.rowsPerPage,
      adminKeyword: searchAdminKeyword,
      departmentCode,
    }).then((response) => {
      if (response.data?.status.code === 'E20000') {
        setLogs(response.data.data.content)
        setTableState((prevState) => {
          return {
            ...prevState,
            rowsPerPage: size,
            page: 1,
          }
        })
      }
    })
  }

  const changePageHandler = (page: number) => {
    void getMemberLoginLogs({
      startDate: moment(searchStartDate).format('YYYY-MM-DD'),
      endDate: moment(searchEndDate).format('YYYY-MM-DD'),
      adminFilter: searchSelectAdminType,
      page,
      pageSize: tableState.rowsPerPage,
      adminKeyword: searchAdminKeyword,
      departmentCode,
    }).then((response) => {
      if (response.data.status.code === 'E20000') {
        setLogs(response.data.data.content)
        setTableState((prev) => ({
          ...prev,
          page,
          totalCount: response.data.data.totalElements,
        }))
      }
    })
  }

  const changeSearchAdminType = (type: string | number) => {
    setSearchSelectAdminType(type as 'name' | 'email')
  }

  const changeSearchAdminDepartment = (type: string | number) => {
    setdepartmentCode(type as 'all' | number)
  }

  const changeSearchAdminKeyword = (keyword: string) => {
    setSearchAdminKeyword(keyword)
  }
  const checkedSearchInputFocusHandler = (is: boolean) => {
    setIsSearchInputFocus(is)
  }

  const clickResetHandler = () => {
    setSearchStartDate(new Date(moment().subtract(7, 'day').format('YYYY-MM-DD')))
    setSearchEndDate(new Date(moment().format('YYYY-MM-DD')))
    setSearchSelectAdminType('name')
    setSearchAdminKeyword('')
    setdepartmentCode('all')
  }

  React.useEffect(() => {
    void getMemberLoginLogs({
      startDate: moment(searchStartDate).format('YYYY-MM-DD'),
      endDate: moment(searchEndDate).format('YYYY-MM-DD'),
      adminFilter: 'name',
      page: 1,
      pageSize: tableState.rowsPerPage,
    }).then((response) => {
      if (response.data.status.code === 'E20000') {
        setLogs(response.data.data.content)
        setTableState((prev) => ({
          ...prev,
          page: 1,
          totalCount: response.data.data.totalElements,
        }))
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useIsModalKeyDown(() => {
    if (isSearchInputFocus) searchLogsHandler()
  }, [searchAdminKeyword, isSearchInputFocus])

  return (
    <Grid type="container">
      <Grid type="item">
        <Card>
          <Grid type="container" horizen="center">
            <Grid type="item" area={18}>
              <Grid type="container">
                <Grid type="item" area={8}>
                  <Grid type="container">
                    <Grid type="item" area={4} align="center" horizen="center">
                      <Typography fontSize="body2">기간</Typography>
                    </Grid>
                    <Grid type="item" area={9} align="center" horizen="center">
                      <DatePicker
                        selected={searchStartDate}
                        onChange={changeSearchStartDate}
                        customInput={
                          <div>
                            <Input value={moment(searchStartDate).format('YYYY.MM.DD')} style={{ textAlign: 'center' }} readOnly />
                          </div>
                        }
                        dayClassName={(date) =>
                          moment(date).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD')
                            ? 'custom-day selected-day'
                            : moment(date).isAfter(new Date().setDate(new Date().getDate()))
                            ? 'custom-day react-datepicker__day--disabled'
                            : date.getDay() === 6
                            ? 'custom-day blue-day'
                            : date.getDay() === 0
                            ? 'custom-day red-day'
                            : 'custom-day'
                        }
                      />
                    </Grid>
                    <Grid type="item" area={2} align="center" horizen="center">
                      <Typography colorWeight="500">~</Typography>
                    </Grid>
                    <Grid type="item" area={9} align="center" horizen="center">
                      <DatePicker
                        selected={searchEndDate}
                        onChange={changeSearchEndDate}
                        customInput={
                          <div>
                            <Input value={moment(searchEndDate).format('YYYY.MM.DD')} style={{ textAlign: 'center' }} readOnly />
                          </div>
                        }
                        dayClassName={(date) =>
                          moment(date).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD')
                            ? 'custom-day selected-day'
                            : moment(date).isAfter(new Date().setDate(new Date().getDate()))
                            ? 'custom-day react-datepicker__day--disabled'
                            : date.getDay() === 6
                            ? 'custom-day blue-day'
                            : date.getDay() === 0
                            ? 'custom-day red-day'
                            : 'custom-day'
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid type="item" area={0.5}></Grid>
                <Grid type="item" area={9}>
                  <Grid type="container">
                    <Grid type="item" area={4} align="center" horizen="center">
                      <Typography fontSize="body2">관리자</Typography>
                    </Grid>
                    <Grid type="item" area={8} horizen="center">
                      <Dropdown value={searchSelectAdminType} onChange={changeSearchAdminType}>
                        <Option value={'name'}>이름</Option>
                        <Option value={'email'}>이메일</Option>
                      </Dropdown>
                    </Grid>
                    <Grid type="item" area={12} horizen="center">
                      <Input
                        value={searchAdminKeyword}
                        onChange={(e) => {
                          changeSearchAdminKeyword(e.target.value)
                        }}
                        onFocus={() => checkedSearchInputFocusHandler(true)}
                        onBlur={() => checkedSearchInputFocusHandler(false)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid type="item" area={0.5}></Grid>
                <Grid type="item" area={6}>
                  <Grid type="container">
                    <Grid type="item" area={7} align="center" horizen="center">
                      <Typography fontSize="body2">소속부서</Typography>
                    </Grid>
                    <Grid type="item" area={16} horizen="center">
                      <Dropdown value={departmentCode} onChange={changeSearchAdminDepartment}>
                        <Option value={'all'}>전체</Option>
                        {typeInfoState.department.map((data, idx) => (
                          <Option key={`department_joinLogs_${idx}`} value={data.groupId}>
                            {data.groupName}
                          </Option>
                        ))}
                      </Dropdown>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid type="item" area={6}>
              <Grid type="container" align="right">
                <Grid type="item" area={10}>
                  <Button type="secondary" onClick={clickResetHandler}>
                    초기화
                  </Button>
                </Grid>
                <Grid type="item" area={1} />
                <Grid type="item" area={8}>
                  <Button afterTagNode={SearchMarkSvg} onClick={searchLogsHandler}>
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
            <Dropdown value={tableState.rowsPerPage} type="1" onChange={(state) => changeTableRowPerPageHandler(state as number)}>
              <Option value={10}>10개씩 보기</Option>
              <Option value={20}>20개씩 보기</Option>
              <Option value={50}>50개씩 보기</Option>
              <Option value={100}>100개씩 보기</Option>
            </Dropdown>
          </Grid>
        </Grid>
      </Grid>
      <Grid type="item">
        <TableContainer>
          <TableHeader>
            <TableRow>
              <TableCell align="center">접속일시</TableCell>
              <TableCell align="center">관리자 아이디</TableCell>
              <TableCell align="center">이름</TableCell>
              <TableCell align="center">소속부서</TableCell>
              <TableCell align="center">IP</TableCell>
              <TableCell align="center">처리내용</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length > 0 ? (
              logs.map((row, index) => (
                <TableRow key={`accessUserPeriodDaus_${index}`}>
                  <TableCell align="center">{moment(row.registDateTime).format('YYYY.MM.DD HH:mm:ss')}</TableCell>
                  <TableCell align="center">{row.email}</TableCell>
                  <TableCell align="center">{row.name}</TableCell>
                  <TableCell align="center">{typeInfoState.department.find((data) => data.groupId === row.department)?.groupName}</TableCell>
                  <TableCell align="center">{row.IP}</TableCell>
                  <TableCell align="center">{row.contents}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" rowSpan={3}>
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

export default JoinLogs
