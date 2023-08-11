import Button from '@core/components/Button'
import Card from '@core/components/Card'
import Grid from '@core/components/Grid'
import Input from '@core/components/Input'
import Typography from '@core/components/Typography'
import { SearchMarkSvg } from '@core/icons'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import React from 'react'
import { alertModalRecoil } from 'recoil/atom'
import { useRecoilState } from 'recoil'
import TableContainer from '@core/components/Table/TableContainer'
import TableHeader from '@core/components/Table/TableHeader'
import TableBody from '@core/components/Table/TableBody'
import TableRow from '@core/components/Table/TableRow'
import TableCell from '@core/components/Table/TableCell'
import Radio from '@core/components/Radio'
import { getMemberLoginLogs } from 'api/epicApi'
import Pagination from '@core/components/Pagination'

interface I_userInfo {
  memId: number
  memAccountType: 'N' | 'C'
  memProvider: 'Epic' | 'Steam' | 'Google' | 'Naver' | 'Kakao'
  memProviderId: string
  memNickname: string
  memState: string
  gold: number
  gem: number
  memRegistDate: string
  memModifyDateTime: string
  memLastLoginDateTime: string
  memMarketingYn: string
}

interface I_props {
  userInfo?: I_userInfo
}

interface I_loginLogs {
  lastLoginTime: string
  logId: number
  logoutDateTime: string
  playTime: number
  provider: 'Epic' | 'Steam' | 'Google' | 'Naver' | 'Kakao'
}

/**
 *
 */
const UserInfo = (props: I_props) => {
  const { userInfo } = props
  const [searchStartDate, setSearchStartDate] = React.useState<Date>(new Date(moment().subtract(7, 'day').format('YYYY-MM-DD')))
  const [searchEndDate, setSearchEndDate] = React.useState<Date>(new Date(moment().format('YYYY-MM-DD')))
  const [searchDateForm, setSearchDateForm] = React.useState<string | number>(7)

  const [loginLogs, setLoginLogs] = React.useState<I_loginLogs[]>([])

  const [, setAlertModalState] = useRecoilState(alertModalRecoil)
  const [tableState, setTableState] = React.useState({
    page: 1,
    totalCount: 0,
    rowsPerPage: 20,
  })

  const changeSearchStartDate = (date: Date) => {
    if (moment(date).isAfter(new Date().setDate(new Date().getDate()))) {
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

  const changeSearchDateFormHandler = (event: React.FormEvent<HTMLInputElement>) => {
    if (Number(event.currentTarget.value)) {
      setSearchDateForm(Number(event.currentTarget.value))
      setSearchEndDate(new Date(moment().subtract(1, 'day').format('YYYY-MM-DD')))
      setSearchStartDate(new Date(moment().subtract(event.currentTarget.value, 'day').format('YYYY-MM-DD')))
    } else {
      setSearchDateForm(event.currentTarget.value)
    }
  }

  const changePageHandler = (page: number) => {
    if (userInfo) {
      void getMemberLoginLogs({
        seq: userInfo.memId,
        page,
        pageSize: tableState.rowsPerPage,
        endDate: moment(searchEndDate).format('YYYY-MM-DD'),
        startDate: moment(searchStartDate).format('YYYY-MM-DD'),
      }).then((response) => {
        if (response.data?.status.code === 'E20000') {
          setLoginLogs(response.data.data.content)
          setTableState((prevState) => {
            return {
              ...prevState,
              page,
            }
          })
        }
      })
    }
  }

  const searchLoginLogsHandler = () => {
    if (userInfo) {
      void getMemberLoginLogs({
        seq: userInfo.memId,
        page: 1,
        pageSize: tableState.rowsPerPage,
        endDate: moment(searchEndDate).format('YYYY-MM-DD'),
        startDate: moment(searchStartDate).format('YYYY-MM-DD'),
      }).then((response) => {
        if (response.data?.status.code === 'E20000') {
          setLoginLogs(response.data.data.content)
          setTableState({ ...tableState, page: 1, totalCount: response.data?.data.totalElements })
        } else {
          setLoginLogs([])
        }
      })
    }
  }

  const clickResetHandler = () => {
    setSearchStartDate(new Date(moment().subtract(7, 'day').format('YYYY-MM-DD')))
    setSearchEndDate(new Date(moment().format('YYYY-MM-DD')))
    setSearchDateForm(7)
  }

  React.useEffect(() => {
    if (userInfo) {
      void getMemberLoginLogs({
        seq: userInfo.memId,
        page: 1,
        pageSize: 20,
        endDate: moment(searchEndDate).format('YYYY-MM-DD'),
        startDate: moment(searchStartDate).format('YYYY-MM-DD'),
      }).then((response) => {
        if (response.data.status.code === 'E20000') {
          setLoginLogs(response.data.data.content)
          setTableState({ ...tableState, page: 1, totalCount: response.data?.data.totalElements })
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo])

  return (
    <Grid type="container">
      <Grid type="item" style={{ marginTop: '20px' }}>
        <Grid type="container">
          <Grid type="item" area={12}>
            <Typography style={{ fontWeight: '500' }}>회원 기본 정보</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid type="item">
        <Card>
          <Grid type="container">
            <Grid type="item" area={12}>
              <Typography fontSize="body2" wrap="p" colorWeight="500">
                이름
              </Typography>
              <Typography wrap="p">{userInfo?.memNickname}</Typography>
            </Grid>
            <Grid type="item" area={12}>
              <Typography fontSize="body2" wrap="p" colorWeight="500">
                닉네임
              </Typography>
              <Typography wrap="p">{userInfo?.memNickname}</Typography>
            </Grid>
          </Grid>
          <Grid type="container" style={{ marginTop: '16px' }}>
            <Grid type="item" area={12}>
              <Typography fontSize="body2" wrap="p" colorWeight="500">
                유형
              </Typography>
              <Typography wrap="p">{userInfo?.memAccountType === 'N' ? '일반계정' : '회사계정'}</Typography>
            </Grid>
            <Grid type="item" area={12}>
              <Typography fontSize="body2" wrap="p" colorWeight="500">
                플랫폼
              </Typography>
              <Typography wrap="p">{userInfo?.memProvider}</Typography>
            </Grid>
          </Grid>
          <Grid type="container" style={{ marginTop: '16px' }}>
            <Grid type="item" area={12}>
              <Typography fontSize="body2" wrap="p" colorWeight="500">
                가입일
              </Typography>
              <Typography wrap="p">{moment(userInfo?.memRegistDate).format('YYYY-MM-DD HH:mm:ss')}</Typography>
            </Grid>
            <Grid type="item" area={12}>
              <Typography fontSize="body2" wrap="p" colorWeight="500">
                최근 접속일
              </Typography>
              <Typography wrap="p">{moment(userInfo?.memLastLoginDateTime).format('YYYY-MM-DD HH:mm:ss')}</Typography>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid type="item" style={{ marginTop: '20px' }}>
        <Grid type="container">
          <Grid type="item" area={12}>
            <Typography style={{ fontWeight: '500' }}>접속 내역</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid type="item">
        <Grid type="container" horizen="center" color="black" colorWeight="300" style={{ padding: '14px 10px' }}>
          <Grid type="item" area={16}>
            <Grid type="container">
              <Grid type="item" area={12} horizen="center" align="center">
                <Radio
                  label="7일"
                  group="userInfoSearchDate"
                  size="large"
                  value={7}
                  onChange={changeSearchDateFormHandler}
                  checked={searchDateForm === 7}
                  readOnly
                />
                <Radio
                  label="14일"
                  group="userInfoSearchDate"
                  size="large"
                  value={14}
                  onChange={changeSearchDateFormHandler}
                  checked={searchDateForm === 14}
                  readOnly
                />
                <Radio
                  label="30일"
                  group="userInfoSearchDate"
                  size="large"
                  value={30}
                  onChange={changeSearchDateFormHandler}
                  checked={searchDateForm === 30}
                  readOnly
                />
                <Radio
                  label="90일"
                  group="userInfoSearchDate"
                  size="large"
                  value={90}
                  onChange={changeSearchDateFormHandler}
                  checked={searchDateForm === 90}
                  readOnly
                />
                <Radio
                  label="직접입력"
                  group="userInfoSearchDate"
                  size="large"
                  value="manual"
                  onChange={changeSearchDateFormHandler}
                  checked={searchDateForm === 'manual'}
                  readOnly
                />
              </Grid>
              <Grid type="item" area={2} />
              <Grid type="item" area={3} align="center" horizen="center">
                <DatePicker
                  selected={searchStartDate}
                  onChange={changeSearchStartDate}
                  customInput={
                    <div style={{ display: searchDateForm === 'manual' ? '' : 'none' }}>
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
              <Grid type="item" area={1} align="center" horizen="center">
                <Typography colorWeight="500" style={{ display: searchDateForm === 'manual' ? '' : 'none' }}>
                  ~
                </Typography>
              </Grid>
              <Grid type="item" area={3} align="center" horizen="center">
                <DatePicker
                  selected={searchEndDate}
                  onChange={changeSearchEndDate}
                  customInput={
                    <div style={{ display: searchDateForm === 'manual' ? '' : 'none' }}>
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
          <Grid type="item" area={8}>
            <Grid type="container" align="right">
              <Grid type="item" area={8}>
                <Button type="secondary" onClick={clickResetHandler}>
                  초기화
                </Button>
              </Grid>
              <Grid type="item" area={1} />
              <Grid type="item" area={6}>
                <Button afterTagNode={SearchMarkSvg} onClick={searchLoginLogsHandler}>
                  검색
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid type="item">
        <Grid type="container">
          <Grid type="item" area={21}>
            <Typography style={{ marginRight: '3px' }}>총</Typography>
            <Typography color="red" colorWeight="default">
              {tableState.totalCount.toLocaleString()}
            </Typography>
            <Typography style={{ marginLeft: '3px' }}>건</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid type="item">
        <TableContainer>
          <TableHeader>
            <TableRow>
              <TableCell align="center">플랫폼</TableCell>
              <TableCell align="center">로그인</TableCell>
              <TableCell align="center">로그아웃</TableCell>
              <TableCell align="center">플레이 타임</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loginLogs.length > 0 ? (
              loginLogs.map((data, index) => (
                <TableRow key={`login_logs_${index}`}>
                  <TableCell align="center">{data.provider}</TableCell>
                  <TableCell align="center">{moment(data.lastLoginTime).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                  <TableCell align="center">{data.logoutDateTime ? moment(data.logoutDateTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</TableCell>
                  <TableCell align="center">{data.playTime}</TableCell>
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

      <Grid type="item">
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
  )
}

export default UserInfo
