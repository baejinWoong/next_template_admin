import Button from '@core/components/Button'
import Card from '@core/components/Card'
import Grid from '@core/components/Grid'
import Input from '@core/components/Input'
import Radio from '@core/components/Radio'
import Typography from '@core/components/Typography'
import { SearchMarkSvg } from '@core/icons'
import moment from 'moment'
import React from 'react'
import { useRecoilState } from 'recoil'
import { alertModalRecoil } from 'recoil/atom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Dropdown from '@core/components/Dropdown'
import Option from '@core/components/Dropdown/Option'
import TableContainer from '@core/components/Table/TableContainer'
import TableHeader from '@core/components/Table/TableHeader'
import TableRow from '@core/components/Table/TableRow'
import TableCell from '@core/components/Table/TableCell'
import TableBody from '@core/components/Table/TableBody'
import PutRestriction from './PutRestriction'
import { getMemberRestrictionLogs } from 'api/epicApi'
import RestrictionWithdrawModal from 'components/modal/epic/RestrictionWithdrawModal'
import UpdateRestriction from './UpdateRestriction'

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

interface I_restriction {
  contents: string
  endDate: string
  messageId: number
  provider: 'EPIC'
  registDate: string
  registUser: string
  restrictionId: number
  startDate: string
  state: 'Y' | 'D' | 'N'
  withdrawContents: string | undefined
  type: 'D' | 'E'
}

/**
 * @param restrictionSeq 이용제한 정보 시퀀스
 * @param seq 이용제한 유저 시퀀스
 */
interface I_withdraw {
  restrictionSeq: number
  seq: number
}

interface I_props {
  userInfo: I_userInfo
}

/**
 *
 */
const Restriction = (props: I_props) => {
  const { userInfo } = props

  const [searchStartDate, setSearchStartDate] = React.useState<Date>(new Date(moment().subtract(7, 'day').format('YYYY-MM-DD')))
  const [searchEndDate, setSearchEndDate] = React.useState<Date>(new Date(moment().format('YYYY-MM-DD')))

  const [searchDateForm, setSearchDateForm] = React.useState<string | number>('7')
  const [searchSelectType, setSearchSelectType] = React.useState<'A' | 'Y' | 'D' | 'N'>('A')

  const [restrictions, setRestrictions] = React.useState<I_restriction[]>([])

  const [isOpenWithdrawModal, setIsOpenWithdrawModal] = React.useState<boolean>(false)
  const [targetWithdrawData, setTargetWithdrawData] = React.useState<I_withdraw>({
    restrictionSeq: 0,
    seq: 0,
  })

  const [targetRestrictionData, setTargetRestrictionData] = React.useState<I_restriction>()

  const [tableState, setTableState] = React.useState({
    page: 1,
    totalCount: 0,
    rowsPerPage: 20,
  })

  const [, setAlertModalState] = useRecoilState(alertModalRecoil)

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
    setSearchDateForm(event.currentTarget.value)
    if (Number(event.currentTarget.value)) {
      setSearchEndDate(new Date(moment().format('YYYY-MM-DD')))
      setSearchStartDate(new Date(moment().subtract(Number(event.currentTarget.value), 'day').format('YYYY-MM-DD')))
    }
  }

  const changeSearchSelectTypeHandler = (value: string | number) => {
    setSearchSelectType(value as 'Y' | 'D' | 'N' | 'A')
  }

  const searchRestrictionLogs = () => {
    void getMemberRestrictionLogs({
      page: 1,
      pageSize: tableState.rowsPerPage,
      seq: userInfo.memId,
      type: searchSelectType,
      startDate: moment(searchStartDate).format('YYYY-MM-DD'),
      endDate: moment(searchEndDate).format('YYYY-MM-DD'),
    }).then((response) => {
      if (response.data.status.code === 'E20000') {
        setRestrictions(response.data.data.content)
        setTableState({ ...tableState, page: 1, totalCount: response.data?.data.totalElements })
      } else {
        setRestrictions([])
      }
    })
  }

  const openWithdrawModalHaendler = (data: I_restriction) => {
    setTargetWithdrawData({
      restrictionSeq: data.restrictionId,
      seq: userInfo.memId,
    })
    setIsOpenWithdrawModal(true)
  }

  const selectUpdateRestrictionHandler = (data: I_restriction) => {
    setTargetRestrictionData(data)
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight)
    }, 10)
  }

  React.useEffect(() => {
    void getMemberRestrictionLogs({
      page: 1,
      pageSize: tableState.rowsPerPage,
      seq: userInfo.memId,
      type: 'A',
      startDate: moment(searchStartDate).format('YYYY-MM-DD'),
      endDate: moment(searchEndDate).format('YYYY-MM-DD'),
    }).then((response) => {
      if (response.data.status.code === 'E20000') {
        setRestrictions(response.data.data.content)
        setTableState({ ...tableState, page: 1, totalCount: response.data?.data.totalElements })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo])

  return (
    <Grid type="container">
      <Grid type="item" style={{ marginTop: '20px' }}>
        <Card color="purple" colorWeight="500" style={{ padding: '20px' }}>
          <Typography wrap="p" fontSize="element1" colorWeight="default">
            회원이 이용약관을 위반하거나 해킹 등의 외부 요인으로 피해가 발생할 우려가 있는 경우, 회원 계정에 대한 이용을 제한할 수 있습니다
          </Typography>
          <Typography wrap="p" fontSize="element1" colorWeight="default">
            이용제한을 설정할 경우, 회원이 등록한 이메일로 이용제한 내용이 발송됩니다.
          </Typography>
          <Typography wrap="p" fontSize="element1" colorWeight="default">
            이용제한 수정을 선택하면 하단의 이용제한 설정 폼에 이전 설정한 이용제한 내용이 표시되며 적용하기 버튼을 클릭하여 수정할 수 있습니다.
          </Typography>
        </Card>
      </Grid>
      <Grid type="item" style={{ marginTop: '20px' }}>
        <Grid type="container">
          <Grid type="item" area={12}>
            <Typography style={{ fontWeight: '500' }}>이용 제한 내역</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid type="item">
        <Grid type="container" horizen="center" color="black" colorWeight="300" style={{ padding: '14px 10px' }}>
          <Grid type="item" area={16}>
            <Grid type="container">
              <Grid type="item" area={12} horizen="center" align="center">
                <Radio label="7일" group="searchDate" size="large" value="7" onChange={changeSearchDateFormHandler} defaultChecked />
                <Radio label="14일" group="searchDate" size="large" value="14" onChange={changeSearchDateFormHandler} />
                <Radio label="30일" group="searchDate" size="large" value="30" onChange={changeSearchDateFormHandler} />
                <Radio label="90일" group="searchDate" size="large" value="90" onChange={changeSearchDateFormHandler} />
                <Radio label="직접입력" group="searchDate" size="large" value="manual" onChange={changeSearchDateFormHandler} />
              </Grid>
              <Grid type="item" area={1} />
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
              <Grid type="item" area={1} />
              <Grid type="item" area={3}>
                <Dropdown value={searchSelectType} onChange={changeSearchSelectTypeHandler}>
                  <Option value="A">전체</Option>
                  <Option value="Y">제한중</Option>
                  <Option value="N">철회</Option>
                  <Option value="D">종료</Option>
                </Dropdown>
              </Grid>
            </Grid>
          </Grid>
          <Grid type="item" area={8}>
            <Grid type="container" align="right">
              <Grid type="item" area={6}></Grid>
              <Grid type="item" area={6}>
                <Button afterTagNode={SearchMarkSvg} onClick={searchRestrictionLogs}>
                  검색
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid type="item" style={{ marginTop: '24px' }}>
        <Grid type="container">
          <Grid type="item">
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
              <TableCell align="center">제한 기간</TableCell>
              <TableCell align="center">사유</TableCell>
              <TableCell align="center">상태</TableCell>
              <TableCell align="center">담당자</TableCell>
              <TableCell align="center">등록일</TableCell>
              <TableCell align="center">수정/철회</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {restrictions.length > 0 ? (
              restrictions.map((data, idx) => (
                <TableRow key={`limits_${idx}`}>
                  <TableCell align="center">
                    {data.type === 'D' ? (
                      <>
                        <Typography wrap="p" fontSize="element1">
                          {(moment(data.endDate).diff(data.startDate, 'day') + 1).toLocaleString()}일 제한
                        </Typography>
                        <Typography wrap="p" fontSize="element1">
                          {moment(data.startDate).format('YYYY-MM-DD')} ~ {moment(data.endDate).format('YYYY-MM-DD')}
                        </Typography>
                      </>
                    ) : (
                      <Typography wrap="p" fontSize="element1">
                        영구 제한
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Typography fontSize="element1" style={{ whiteSpace: 'pre-line' }}>
                      {data.withdrawContents ?? data.contents}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography fontSize="element1">{stateConvert[data.state]}</Typography>
                  </TableCell>
                  <TableCell align="center">{data.registUser}</TableCell>
                  <TableCell align="center">{data.registDate}</TableCell>
                  <TableCell align="center">
                    <Grid type="container" style={{ rowGap: '14px' }} align="center">
                      <Grid type="item" area={20}>
                        <Button
                          size="minimum"
                          type={data.state === 'Y' ? 'secondary' : 'disabled'}
                          onClick={() => selectUpdateRestrictionHandler(data)}
                          disabled={data.state !== 'Y'}
                        >
                          수정
                        </Button>
                      </Grid>
                      <Grid type="item" area={20}>
                        <Button
                          size="minimum"
                          type={data.state === 'Y' ? 'secondary' : 'disabled'}
                          disabled={data.state !== 'Y'}
                          color="red"
                          onClick={() => openWithdrawModalHaendler(data)}
                        >
                          철회
                        </Button>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" rowSpan={3}>
                  검색결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableContainer>
      </Grid>
      {!(restrictions.filter((data) => data.state === 'Y').length > 0) ? (
        <PutRestriction userInfo={userInfo} searchRestrictionLogs={searchRestrictionLogs} />
      ) : (
        <UpdateRestriction userInfo={userInfo} searchRestrictionLogs={searchRestrictionLogs} data={targetRestrictionData} setData={setTargetRestrictionData} />
      )}
      <RestrictionWithdrawModal
        isOpen={isOpenWithdrawModal}
        setIsOpen={setIsOpenWithdrawModal}
        data={targetWithdrawData}
        confirmCallback={searchRestrictionLogs}
      />
    </Grid>
  )
}

export default Restriction

const stateConvert = {
  A: '전체',
  Y: '제한중',
  N: '철회',
  D: '종료',
  W: '대기중',
  F: '실패',
}
