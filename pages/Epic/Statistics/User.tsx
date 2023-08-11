import Button from '@core/components/Button'
import Grid from '@core/components/Grid'
import Input from '@core/components/Input'
import Radio from '@core/components/Radio'
import Tab from '@core/components/Tab'
import TabArea from '@core/components/TabArea'
import Typography from '@core/components/Typography'
import { SearchMarkSvg } from '@core/icons'
import { getStatisticsGameUserPeriod, getStatisticsGameUserPeriodDownload, getStatisticsGameUserYesterDay } from 'api/epicApi'
import ChartBox from 'components/common/Statistics/ChartBox'
import moment from 'moment'
import React from 'react'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useRecoilState } from 'recoil'
import { alertModalRecoil } from 'recoil/atom'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'
import Card from '@core/components/Card'
import { chartOption, getLabelDays, getRandomRGB } from 'utils'
import { TARGETDATE } from 'utils/epic'
import TableContainer from '@core/components/Table/TableContainer'
import TableHeader from '@core/components/Table/TableHeader'
import TableRow from '@core/components/Table/TableRow'
import TableCell from '@core/components/Table/TableCell'
import TableBody from '@core/components/Table/TableBody'
import { getToken } from 'api/adminApi'

interface I_gameUserYesterDay {
  downloadCnt: {
    today: number
    fluctuation: number
  }
  installCnt: {
    today: number
    fluctuation: number
  }
  userDormantCnt: {
    today: number
    fluctuation: number
  }
  userExistCnt: {
    today: number
    fluctuation: number
  }
  userNewCnt: {
    today: number
    fluctuation: number
  }
  userSanctionsCnt: {
    today: number
    fluctuation: number
  }
  userWithdrewCnt: {
    today: number
    fluctuation: number
  }
}

interface I_gameUserPeriod {
  downloadCnt: number
  installCnt: number
  statisticsDate: string
  userDormantCnt: number
  userExistCnt: number
  userNewCnt: number
  userSanctionsCnt: number
  userWithdrewCnt: number
}

/**
 *
 */
const User = () => {
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

  const [gameUserYesterDay, setGameUserYesterDay] = React.useState<I_gameUserYesterDay>()
  const [gameUserPeriods, setGameUserPeriods] = React.useState<I_gameUserPeriod[]>([])

  const [activeMenu, setActiveMenu] = React.useState<string>('UserCount')

  const [searchStartDate, setSearchStartDate] = React.useState<Date>(new Date(moment(TARGETDATE).subtract(8, 'day').format('YYYY-MM-DD')))
  const [searchEndDate, setSearchEndDate] = React.useState<Date>(new Date(moment(TARGETDATE).subtract(1, 'day').format('YYYY-MM-DD')))

  const [currentSearchStartDate, setCurrentSearchStartDate] = React.useState<Date>(new Date(moment(TARGETDATE).subtract(8, 'day').format('YYYY-MM-DD')))
  const [currentSearchEndDate, setCurrentSearchEndDate] = React.useState<Date>(new Date(moment(TARGETDATE).subtract(1, 'day').format('YYYY-MM-DD')))

  const [searchDateForm, setSearchDateForm] = React.useState<string | number>(7)

  const [, setAlertModalState] = useRecoilState(alertModalRecoil)

  const changeSearchStartDate = (date: Date) => {
    if (moment(date).isAfter(new Date(moment().subtract(1, 'day').format('YYYY-MM-DD')))) {
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
    if (moment(date).isAfter(new Date(moment().subtract(1, 'day').format('YYYY-MM-DD')))) {
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
      setSearchEndDate(new Date(moment().subtract(1, 'day').format('YYYY-MM-DD')))
      setSearchStartDate(new Date(moment().subtract(event.currentTarget.value, 'day').format('YYYY-MM-DD')))
    }
  }

  const changeTabHandler = (target: string) => {
    setActiveMenu(target)
  }

  const userChartData = () => {
    if (!gameUserPeriods || gameUserPeriods.length < 1) {
      return {
        labels: getLabelDays('MM.DD', currentSearchEndDate, currentSearchStartDate),
        datasets: [],
      }
    }
    const keys = (Object.keys(gameUserPeriods[0]) as Array<keyof I_gameUserPeriod>).filter(
      (data) => data !== 'downloadCnt' && data !== 'installCnt' && data !== 'statisticsDate',
    )
    const datasets = keys.map((key, index) => {
      const color = getRandomRGB()
      return {
        label: convert[key],
        data: getLabelDays('YYYY-MM-DD', currentSearchEndDate, currentSearchStartDate)
          .map((data) => {
            return gameUserPeriods.filter((filter) => {
              return filter.statisticsDate === data
            })[0]
          })
          .map((data) => data?.[key] ?? undefined),
        borderColor: color,
        backgroundColor: color,

        pointBackgroundColor: '#FFFFFF',
      }
    })

    return {
      labels: getLabelDays('MM.DD', currentSearchEndDate, currentSearchStartDate),
      datasets,
    }
  }

  const installChartData = () => {
    if (!gameUserPeriods || gameUserPeriods.length < 1) {
      return {
        labels: getLabelDays('MM.DD', currentSearchEndDate, currentSearchStartDate),
        datasets: [],
      }
    } else {
      const keys = (Object.keys(gameUserPeriods[0]) as Array<keyof I_gameUserPeriod>).filter((data) => data === 'downloadCnt' || data === 'installCnt')
      const datasets = keys.map((key, index) => {
        const color = getRandomRGB()
        return {
          label: convert[key],
          data: getLabelDays('YYYY-MM-DD', currentSearchEndDate, currentSearchStartDate)
            .map((data) => {
              return gameUserPeriods.filter((filter) => {
                return filter.statisticsDate === data
              })[0]
            })
            .map((data) => data?.[key] ?? undefined),
          borderColor: color,
          backgroundColor: color,

          pointBackgroundColor: '#FFFFFF',
        }
      })

      return {
        labels: getLabelDays('MM.DD', currentSearchEndDate, currentSearchStartDate),
        datasets,
      }
    }
  }

  const searchAccessStatisticsHandler = () => {
    void getStatisticsGameUserPeriod({
      endDate: moment(searchEndDate).format('YYYY-MM-DD'),
      startDate: moment(searchStartDate).format('YYYY-MM-DD'),
    }).then((response) => {
      if (response.data.status.code === 'E20000') {
        setGameUserPeriods(response.data.data)
      } else {
        setGameUserPeriods([])
      }

      setCurrentSearchStartDate(searchStartDate)
      setCurrentSearchEndDate(searchEndDate)
    })
  }

  const clickExcelDownloadHandler = () => {
    void getToken().then(() => {
      void getStatisticsGameUserPeriodDownload({
        endDate: moment(currentSearchEndDate).format('YYYY-MM-DD'),
        startDate: moment(currentSearchStartDate).format('YYYY-MM-DD'),
      }).then((response) => {
        const downloadUrl = window.URL.createObjectURL(response.data)
        const downloadTag = document.createElement('a')
        downloadTag.download = `${moment().format('YYYY_MM_DD')}기간별회원통계.csv`
        downloadTag.href = downloadUrl
        document.body.appendChild(downloadTag)
        downloadTag.click()
        document.body.removeChild(downloadTag)
        window.URL.revokeObjectURL(downloadUrl)
      })
    })
  }

  React.useEffect(() => {
    void getStatisticsGameUserYesterDay({
      date: moment(searchEndDate).format('YYYY-MM-DD'),
    }).then((response) => {
      if (response.data.status.code === 'E20000') {
        setGameUserYesterDay(response.data.data)
      }
    })

    void getStatisticsGameUserPeriod({
      endDate: moment(searchEndDate).format('YYYY-MM-DD'),
      startDate: moment(searchStartDate).format('YYYY-MM-DD'),
    }).then((response) => {
      if (response.data.status.code === 'E20000') {
        setGameUserPeriods(response.data.data)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid type="container">
      <Grid type="item">
        <Grid type="container" style={{ justifyContent: 'space-between' }}>
          <Typography fontSize="body2" style={{ fontWeight: '700' }}>
            전일 회원 통계(기준일 기준)
          </Typography>
          <Typography fontSize="element1" style={{ fontWeight: '500' }}>
            {moment(TARGETDATE).subtract(1, 'day').format('YYYY년MM월DD일')} 기준
          </Typography>
        </Grid>
      </Grid>

      <Grid type="item">
        <Grid type="container" style={{ justifyContent: 'space-between' }}>
          <Grid type="item" area={4}>
            <ChartBox
              title="신규 가입자"
              chartDefaultValue={gameUserYesterDay?.userNewCnt?.today}
              chartDiffValue={gameUserYesterDay?.userNewCnt?.fluctuation}
            />
          </Grid>
          <Grid type="item" area={4}>
            <ChartBox
              title="휴면 회원"
              chartDefaultValue={gameUserYesterDay?.userDormantCnt?.today}
              chartDiffValue={gameUserYesterDay?.userDormantCnt?.fluctuation}
            />
          </Grid>
          <Grid type="item" area={4}>
            <ChartBox
              title="탈퇴 회원"
              chartDefaultValue={gameUserYesterDay?.userWithdrewCnt?.today}
              chartDiffValue={gameUserYesterDay?.userWithdrewCnt?.fluctuation}
            />
          </Grid>
          <Grid type="item" area={4}>
            <ChartBox
              title="총 회원수"
              chartDefaultValue={gameUserYesterDay?.userExistCnt?.today}
              chartDiffValue={gameUserYesterDay?.userExistCnt?.fluctuation}
            />
          </Grid>
          <Grid type="item" area={4}>
            <ChartBox
              title="누적 다운로드"
              chartDefaultValue={gameUserYesterDay?.downloadCnt?.today}
              chartDiffValue={gameUserYesterDay?.downloadCnt?.fluctuation}
            />
          </Grid>
          <Grid type="item" area={4}>
            <ChartBox
              title="누적 설치완료"
              chartDefaultValue={gameUserYesterDay?.installCnt?.today}
              chartDiffValue={gameUserYesterDay?.installCnt?.fluctuation}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid type="item" style={{ marginTop: '20px' }}>
        <Grid type="container">
          <Grid type="item" area={12}>
            <Typography style={{ fontWeight: '500' }}>기간별 회원 통계</Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid type="item">
        <Grid type="container" horizen="center" color="black" colorWeight="300" style={{ padding: '14px 10px' }}>
          <Grid type="item" area={16}>
            <Grid type="container">
              <Grid type="item" area={12} horizen="center" align="center">
                <Radio label="7일" group="userInfoSearchDate" size="large" value={7} onChange={changeSearchDateFormHandler} defaultChecked />
                <Radio label="14일" group="userInfoSearchDate" size="large" value={14} onChange={changeSearchDateFormHandler} />
                <Radio label="30일" group="userInfoSearchDate" size="large" value={30} onChange={changeSearchDateFormHandler} />
                <Radio label="90일" group="userInfoSearchDate" size="large" value={90} onChange={changeSearchDateFormHandler} />
                <Radio label="직접입력" group="userInfoSearchDate" size="large" value="manual" onChange={changeSearchDateFormHandler} />
              </Grid>
              <Grid type="item" area={2} />
              <Grid type="item" area={3} align="center" horizen="center">
                <ReactDatePicker
                  selected={searchStartDate}
                  onChange={changeSearchStartDate}
                  customInput={
                    <div style={{ display: searchDateForm === 'manual' ? '' : 'none' }}>
                      <Input value={moment(searchStartDate).format('YYYY.MM.DD')} style={{ textAlign: 'center' }} readOnly />
                    </div>
                  }
                  dayClassName={(date) =>
                    moment(date).isSameOrAfter(moment(new Date()).format('YYYY-MM-DD'))
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
                <ReactDatePicker
                  selected={searchEndDate}
                  onChange={changeSearchEndDate}
                  customInput={
                    <div style={{ display: searchDateForm === 'manual' ? '' : 'none' }}>
                      <Input value={moment(searchEndDate).format('YYYY.MM.DD')} style={{ textAlign: 'center' }} readOnly />
                    </div>
                  }
                  dayClassName={(date) =>
                    moment(date).isSameOrAfter(moment(new Date()).format('YYYY-MM-DD'))
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
              <Grid type="item" area={6}>
                <Button afterTagNode={SearchMarkSvg} onClick={searchAccessStatisticsHandler}>
                  검색
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid type="item" style={{ marginTop: '24px' }}>
          <Tab tabs={tabs} onChange={changeTabHandler} />
        </Grid>
        <TabArea isActive={activeMenu === 'UserCount'}>
          <Grid type="item" style={{ marginTop: '24px' }}>
            <Card style={{ boxShadow: 'rgba(91, 71, 188, 0.3) 0px 0px 11px 0px' }}>
              <Grid type="container">
                <Grid type="item">
                  <Line
                    options={{
                      ...chartOption,
                      scales: {
                        y: {
                          afterDataLimits: (scale) => {
                            scale.max = scale.max * 1.1 < 100 ? 100 : scale.max * 1.1
                          },
                          min: 0,
                          ticks: {
                            stepSize: 10,
                            callback: (value, index, ticks) => {
                              return `${value}${index === ticks.length - 1 ? ' (명) ' : '       '}`
                            },
                          },
                        },
                      },
                    }}
                    data={userChartData()}
                    style={{
                      height: '400px',
                      width: '100%',
                    }}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </TabArea>
        <TabArea isActive={activeMenu === 'InstallCount'}>
          <Grid type="item" style={{ marginTop: '24px' }}>
            <Card style={{ boxShadow: 'rgba(91, 71, 188, 0.3) 0px 0px 11px 0px' }}>
              <Grid type="container">
                <Grid type="item">
                  <Line
                    options={{
                      ...chartOption,
                      scales: {
                        y: {
                          afterDataLimits: (scale) => {
                            scale.max = scale.max * 1.1 < 100 ? 100 : scale.max * 1.1
                          },
                          min: 0,
                          ticks: {
                            stepSize: 10,
                            callback: (value, index, ticks) => {
                              return `${value}${index === ticks.length - 1 ? ' (건) ' : '       '}`
                            },
                          },
                        },
                      },
                    }}
                    data={installChartData()}
                    style={{
                      height: '400px',
                      width: '100%',
                    }}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </TabArea>
        <Grid type="item" style={{ marginTop: '24px' }}>
          <Grid type="container">
            <Grid type="item">
              <TableContainer>
                <TableHeader>
                  <TableRow>
                    <TableCell align="center">날짜</TableCell>
                    <TableCell align="center">신규 가입자수(명)</TableCell>
                    <TableCell align="center">휴면 회원수(명)</TableCell>
                    <TableCell align="center">탈퇴 회원수(명)</TableCell>
                    <TableCell align="center">총 회원수(명)</TableCell>
                    <TableCell align="center">다운로드 수(건)</TableCell>
                    <TableCell align="center">설치완료 수(건)</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gameUserPeriods.length > 0 ? (
                    getLabelDays('YYYY-MM-DD', currentSearchEndDate, currentSearchStartDate)?.map((data, index) => {
                      const targetData = gameUserPeriods?.find((find) => find.statisticsDate === data)
                      return (
                        <TableRow key={`accessStatisticsTable_${index}`}>
                          <TableCell align="center">{data}</TableCell>
                          <TableCell align="center">{targetData?.userNewCnt ?? '-'}</TableCell>
                          <TableCell align="center">{targetData?.userSanctionsCnt ?? '-'}</TableCell>
                          <TableCell align="center">{targetData?.userWithdrewCnt ?? '-'}</TableCell>
                          <TableCell align="center">{targetData?.userExistCnt ?? '-'}</TableCell>
                          <TableCell align="center">{targetData?.downloadCnt ?? '-'}</TableCell>
                          <TableCell align="center">{targetData?.installCnt ?? '-'}</TableCell>
                        </TableRow>
                      )
                    })
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
          </Grid>
        </Grid>
        <Grid type="item" style={{ marginTop: '24px' }}>
          <Grid type="container">
            <Grid type="item" area={4}>
              <Button color="excel" onClick={clickExcelDownloadHandler}>
                엑셀 다운로드
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default User

const tabs = [
  {
    name: '회원수',
    key: 'UserCount',
  },
  {
    name: '다운로드/설치완료',
    key: 'InstallCount',
  },
]

const convert = {
  downloadCnt: '다운로드 수',
  installCnt: '설치완료 수',
  userDormantCnt: '휴면 회원수',
  userExistCnt: '총 회원수',
  userNewCnt: '신규 회원수',
  userSanctionsCnt: '제재 회원수',
  userWithdrewCnt: '탈퇴 회원수',
  statisticsDate: 'string',
}
