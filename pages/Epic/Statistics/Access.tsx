import Button from '@core/components/Button'
import Grid from '@core/components/Grid'
import Input from '@core/components/Input'
import Radio from '@core/components/Radio'
import Tab from '@core/components/Tab'
import TabArea from '@core/components/TabArea'
import Typography from '@core/components/Typography'
import { SearchMarkSvg } from '@core/icons'
import {
  getStatistcsAccessPeriod,
  getStatistcsAccessPeriodRetention,
  getStatisticsAccessPeriodDownload,
  getStatisticsAccessPeriodRetentionDownload,
  getStatisticsAccessYesterDay,
} from 'api/epicApi'
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
import { LABELDAYS, TARGETDATE } from 'utils/epic'
import { chartOption, getLabelDays, getRandomRGB } from 'utils'
import TableContainer from '@core/components/Table/TableContainer'
import TableHeader from '@core/components/Table/TableHeader'
import TableBody from '@core/components/Table/TableBody'
import TableRow from '@core/components/Table/TableRow'
import TableCell from '@core/components/Table/TableCell'
import Cohort from 'components/common/Statistics/Cohort'
import { getToken } from 'api/adminApi'

interface I_accessUserYesterDay {
  dau: {
    today: number
    fluctuation: number
  }
  playTimeAvg: {
    today: number
    fluctuation: number
  }
  intervalAvg: {
    today: number
    fluctuation: number
  }
  concurrentAvg: {
    today: number
    fluctuation: number
  }
}

interface I_accessUserPeriodDau {
  userExistCnt: number
  statisticsDate: string
}

interface I_accessUserPeriodInterval {
  intervalAvg: number
  intervalMax: number
  statisticsDate: string
}

interface I_accessUserPeriodPlay {
  playAvg: number
  playMax: number
  statisticsDate: string
}

interface I_accessUserPeriodConCurrent {
  concurrentMin: number
  concurrentMax: number
  concurrentAvg: number
  statisticsDate: string
}

interface I_accessUserPeriodRetention {
  [index: string]: Array<{
    n: number
    statisticsDay: string
    userActiveCnt: number
    userRetentionCnt: number
  }>
}

/**
 *
 */
const Access = () => {
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

  const [accessUserYesterDay, setAccessUserYesterDay] = React.useState<I_accessUserYesterDay>()

  const [accessUserPeriodDaus, setAccessUserPeriodDaus] = React.useState<I_accessUserPeriodDau[]>([])
  const [accessUserPeriodIntervals, setAccessUserPeriodIntervals] = React.useState<I_accessUserPeriodInterval[]>([])
  const [accessUserPeriodPlays, setAccessUserPeriodPlays] = React.useState<I_accessUserPeriodPlay[]>([])
  const [accessUserPeriodCurrents, setAccessUserPeriodCurrents] = React.useState<I_accessUserPeriodConCurrent[]>([])
  const [accessUserPeriodRetentions, setAccessUserPeriodRetentions] = React.useState<I_accessUserPeriodRetention>()

  const [activeMenu, setActiveMenu] = React.useState<string>(tabs[0].key)

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
      setSearchStartDate(
        new Date(
          moment()
            .subtract(Number(event.currentTarget.value) + 1, 'day')
            .format('YYYY-MM-DD'),
        ),
      )
    }
  }

  const changeTabHandler = (target: string) => {
    setActiveMenu(target)
  }

  const userDauChartData = () => {
    if (!accessUserPeriodDaus || accessUserPeriodDaus.length < 1)
      return {
        labels: getLabelDays('MM.DD', currentSearchEndDate, currentSearchStartDate),
        datasets: [],
      }
    const keys = (Object.keys(accessUserPeriodDaus[0]) as Array<keyof I_accessUserPeriodDau>).filter((data) => data !== 'statisticsDate')
    const datasets = keys.map((key, index) => {
      const color = getRandomRGB()
      return {
        label: convert[key],
        data: getLabelDays('YYYY-MM-DD', currentSearchEndDate, currentSearchStartDate)
          .map((data) => {
            return accessUserPeriodDaus.filter((filter) => {
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

  const userPlayChartData = () => {
    if (!accessUserPeriodPlays || accessUserPeriodPlays.length < 1)
      return {
        labels: getLabelDays('MM.DD', currentSearchEndDate, currentSearchStartDate),
        datasets: [],
      }
    const keys = (Object.keys(accessUserPeriodPlays[0]) as Array<keyof I_accessUserPeriodPlay>).filter((data) => data !== 'statisticsDate')
    const datasets = keys.map((key, index) => {
      const color = getRandomRGB()
      const result = {
        label: convert[key],
        data: getLabelDays('YYYY-MM-DD', currentSearchEndDate, currentSearchStartDate)
          .map((data) => {
            return accessUserPeriodPlays.filter((filter) => {
              return filter.statisticsDate === data
            })[0]
          })
          .map((data) => data?.[key] ?? undefined),
        borderColor: color,
        backgroundColor: color,
        pointBackgroundColor: '#FFFFFF',
      }
      return result
    })

    return {
      labels: getLabelDays('MM.DD', currentSearchEndDate, currentSearchStartDate),
      datasets,
    }
  }

  const userConCurrentChartData = () => {
    if (!accessUserPeriodCurrents || accessUserPeriodCurrents.length < 1)
      return {
        labels: getLabelDays('MM.DD', currentSearchEndDate, currentSearchStartDate),
        datasets: [],
      }
    const keys = (Object.keys(accessUserPeriodCurrents[0]) as Array<keyof I_accessUserPeriodConCurrent>).filter((data) => data !== 'statisticsDate')
    const datasets = keys.map((key, index) => {
      const color = getRandomRGB()
      return {
        label: convert[key],
        data: getLabelDays('YYYY-MM-DD', currentSearchEndDate, currentSearchStartDate)
          .map((data) => {
            return accessUserPeriodCurrents.filter((filter) => {
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

  const userIntervalChartData = () => {
    if (!accessUserPeriodIntervals || accessUserPeriodIntervals.length < 1)
      return {
        labels: getLabelDays('MM.DD', currentSearchEndDate, currentSearchStartDate),
        datasets: [],
      }
    const keys = (Object.keys(accessUserPeriodIntervals[0]) as Array<keyof I_accessUserPeriodInterval>).filter((data) => data !== 'statisticsDate')
    const datasets = keys.map((key, index) => {
      const color = getRandomRGB()
      return {
        label: convert[key],
        data: getLabelDays('YYYY-MM-DD', currentSearchEndDate, currentSearchStartDate)
          .map((data) => {
            return accessUserPeriodIntervals.find((filter) => {
              return filter.statisticsDate === data
            })
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

  const userRetentionChartData = () => {
    if (!accessUserPeriodRetentions)
      return {
        labels: getLabelDays('MM.DD', currentSearchEndDate, currentSearchStartDate),
        datasets: [],
      }
    const keys = (Object.keys(accessUserPeriodRetentions) as Array<keyof I_accessUserPeriodRetention>)
      .filter((data) => data !== 'statisticsDate')
      .sort((a, b) => moment(a as string).diff(b))
    const datasets = keys.map((key) => {
      const color = getRandomRGB()
      return {
        label: key as string,
        data: accessUserPeriodRetentions[key].map((data) => Math.floor((data.userActiveCnt / data.userRetentionCnt) * 100) ?? {}),
        borderColor: color,
        backgroundColor: color,

        pointBackgroundColor: '#FFFFFF',
      }
    })

    const labelDays = () => {
      const result = []
      for (let i = 0; i < LABELDAYS; i++) {
        result.push(`Day ${i}`)
      }
      return result
    }

    return {
      labels: labelDays(),
      datasets,
    }
  }

  const userRetentionCohortData = () => {
    if (!accessUserPeriodRetentions) return {}
    const result: {
      [index: string]: Array<string | number>
    } = {}
    Object.keys(accessUserPeriodRetentions)
      .sort((a, b) => moment(a).diff(b))
      .map((data) => {
        result[data] = accessUserPeriodRetentions[data].map((data) => data.userActiveCnt)
        return null
      })
    return result
  }

  const searchAccessStatisticsHandler = () => {
    void getStatistcsAccessPeriod({
      endDate: moment(searchEndDate).format('YYYY-MM-DD'),
      startDate: moment(searchStartDate).format('YYYY-MM-DD'),
    }).then((response) => {
      if (response.data.status.code === 'E20000') {
        setAccessUserPeriodDaus(response.data.data.activeUserStatisticsDto)
        setAccessUserPeriodPlays(response.data.data.playTimeStatisticsDto)
        setAccessUserPeriodCurrents(response.data.data.periodDateConcurrentDayStatisticsDto)
        setAccessUserPeriodIntervals(response.data.data.periodDateIntervalDayStatisticsDto)
        setCurrentSearchStartDate(searchStartDate)
        setCurrentSearchEndDate(searchEndDate)
      } else {
        setAccessUserPeriodDaus([])
        setAccessUserPeriodPlays([])
        setAccessUserPeriodCurrents([])
        setAccessUserPeriodIntervals([])
      }
    })

    void getStatistcsAccessPeriodRetention({
      endDate: moment(searchEndDate).format('YYYY-MM-DD'),
      startDate: moment(searchStartDate).format('YYYY-MM-DD'),
    }).then((response) => {
      if (response.data.status.code === 'E20000') {
        setAccessUserPeriodRetentions(response.data.data)
        setCurrentSearchStartDate(searchStartDate)
        setCurrentSearchEndDate(searchEndDate)
      } else {
        setAccessUserPeriodRetentions(undefined)
      }
    })
  }

  React.useEffect(() => {
    void getStatisticsAccessYesterDay({
      date: moment(TARGETDATE).subtract(1, 'day').format('YYYY-MM-DD'),
    }).then((response) => {
      if (response.data.status.code === 'E20000') {
        setAccessUserYesterDay(response.data.data)
      }
    })

    void getStatistcsAccessPeriod({
      endDate: moment(TARGETDATE).subtract(1, 'day').format('YYYY-MM-DD'),
      startDate: moment(TARGETDATE).subtract(LABELDAYS, 'day').format('YYYY-MM-DD'),
    }).then((response) => {
      if (response.data.status.code === 'E20000') {
        setAccessUserPeriodDaus(response.data.data.activeUserStatisticsDto)
        setAccessUserPeriodPlays(response.data.data.playTimeStatisticsDto)
        setAccessUserPeriodCurrents(response.data.data.periodDateConcurrentDayStatisticsDto)
        setAccessUserPeriodIntervals(response.data.data.periodDateIntervalDayStatisticsDto)
      }
    })

    void getStatistcsAccessPeriodRetention({
      endDate: moment(TARGETDATE).subtract(1, 'day').format('YYYY-MM-DD'),
      startDate: moment(TARGETDATE).subtract(LABELDAYS, 'day').format('YYYY-MM-DD'),
    }).then((response) => {
      if (response.data.status.code === 'E20000') {
        setAccessUserPeriodRetentions(response.data.data)
      }
    })
  }, [])

  const clickExcelDownloadHandler = () => {
    void getToken().then(() => {
      void getStatisticsAccessPeriodDownload({
        endDate: moment(searchEndDate).format('YYYY-MM-DD'),
        startDate: moment(searchStartDate).format('YYYY-MM-DD'),
      }).then((response) => {
        const downloadUrl = window.URL.createObjectURL(response.data)
        const downloadTag = document.createElement('a')
        downloadTag.download = `${moment().format('YYYY_MM_DD')}기간별접속통계.csv`
        downloadTag.href = downloadUrl
        document.body.appendChild(downloadTag)
        downloadTag.click()
        document.body.removeChild(downloadTag)
        window.URL.revokeObjectURL(downloadUrl)
      })
    })
  }

  const clickRetentionExcelDownloadHandler = () => {
    void getToken().then(() => {
      void getStatisticsAccessPeriodRetentionDownload({
        endDate: moment(searchEndDate).format('YYYY-MM-DD'),
        startDate: moment(searchStartDate).format('YYYY-MM-DD'),
      }).then((response) => {
        const downloadUrl = window.URL.createObjectURL(response.data)
        const downloadTag = document.createElement('a')
        downloadTag.download = `${moment().format('YYYY_MM_DD')}기간별재방문통계.csv`
        downloadTag.href = downloadUrl
        document.body.appendChild(downloadTag)
        downloadTag.click()
        document.body.removeChild(downloadTag)
        window.URL.revokeObjectURL(downloadUrl)
      })
    })
  }

  return (
    <Grid type="container">
      <Grid type="item">
        <Grid type="container" style={{ justifyContent: 'space-between' }}>
          <Typography fontSize="body2" style={{ fontWeight: '700' }}>
            전일 접속 통계(기준일 기준)
          </Typography>
          <Typography fontSize="element1" style={{ fontWeight: '500' }}>
            {moment(TARGETDATE).subtract(1, 'day').format('YYYY년MM월DD일')} 기준
          </Typography>
        </Grid>
      </Grid>

      <Grid type="item">
        <Grid type="container" style={{ justifyContent: 'space-between' }}>
          <Grid type="item" area={6}>
            <ChartBox title="활성사용자(DAU)" chartDefaultValue={accessUserYesterDay?.dau.today} chartDiffValue={accessUserYesterDay?.dau.fluctuation} />
          </Grid>
          <Grid type="item" area={6}>
            <ChartBox
              title="평균 플레이타임"
              chartDefaultValue={accessUserYesterDay?.playTimeAvg.today}
              chartDiffValue={accessUserYesterDay?.playTimeAvg.fluctuation}
            />
          </Grid>
          <Grid type="item" area={6}>
            <ChartBox
              title="평균 세션 인터벌"
              chartDefaultValue={accessUserYesterDay?.intervalAvg.today}
              chartDiffValue={accessUserYesterDay?.intervalAvg.fluctuation}
            />
          </Grid>
          <Grid type="item" area={6}>
            <ChartBox
              title="평균 동시접속자"
              chartDefaultValue={accessUserYesterDay?.concurrentAvg.today}
              chartDiffValue={accessUserYesterDay?.concurrentAvg.fluctuation}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid type="item" style={{ marginTop: '20px' }}>
        <Grid type="container">
          <Grid type="item" area={12}>
            <Typography style={{ fontWeight: '500' }}>기간별 접속 통계</Typography>
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
        <TabArea isActive={activeMenu === 'Dau'}>
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
                    data={userDauChartData()}
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
        <TabArea isActive={activeMenu === 'PlayTime'}>
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
                            scale.max = scale.max * 1.1 < 120 ? 120 : scale.max * 1.1
                          },
                          min: 0,
                          ticks: {
                            stepSize: 60,
                            callback: (value, index, ticks) => {
                              return `${value}${index === ticks.length - 1 ? ' (분) ' : '       '}`
                            },
                          },
                        },
                      },
                    }}
                    data={userPlayChartData()}
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
        <TabArea isActive={activeMenu === 'SessionInterval'}>
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
                            scale.max = scale.max * 1.1 < 120 ? 120 : scale.max * 1.1
                          },
                          min: 0,
                          ticks: {
                            stepSize: 60,
                            callback: (value, index, ticks) => {
                              return `${value}${index === ticks.length - 1 ? ' (분) ' : '       '}`
                            },
                          },
                        },
                      },
                    }}
                    data={userIntervalChartData()}
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
        <TabArea isActive={activeMenu === 'ConCurrent'}>
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
                    data={userConCurrentChartData()}
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
        <TabArea isActive={activeMenu === 'Retention'}>
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
                            scale.max = 100
                          },
                          min: 0,
                          ticks: {
                            callback: function (value) {
                              return `${value}% `
                            },
                          },
                        },
                      },
                    }}
                    data={userRetentionChartData()}
                    style={{
                      height: '400px',
                      width: '100%',
                    }}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid type="item" style={{ marginTop: '24px' }}>
            {Object.keys(userRetentionCohortData()).length > 0 ? (
              <Cohort data={userRetentionCohortData()} customHeader={['날짜', '사용자']} />
            ) : (
              <Card style={{ padding: '13px' }}>
                <Grid type="item" align="center">
                  <Typography fontSize="element1">검색결과가 없습니다.</Typography>
                </Grid>
              </Card>
            )}
          </Grid>
          <Grid type="item" style={{ marginTop: '24px' }}>
            <Grid type="container">
              <Grid type="item" area={4}>
                <Button color="excel" onClick={clickRetentionExcelDownloadHandler}>
                  엑셀 다운로드
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </TabArea>
        <TabArea isActive={activeMenu !== 'Retention'}>
          <Grid type="item" style={{ marginTop: '24px' }}>
            <Grid type="container">
              <Grid type="item">
                <TableContainer>
                  <TableHeader>
                    <TableRow>
                      <TableCell align="center">DATE</TableCell>
                      <TableCell align="center">DAU(명)</TableCell>
                      <TableCell align="center">평균 플레이타임(분)</TableCell>
                      <TableCell align="center">최대 플레이타임(분)</TableCell>
                      <TableCell align="center">평균 세션인터벌(분)</TableCell>
                      <TableCell align="center">최대 세션인터벌(분)</TableCell>
                      <TableCell align="center">평균 동시접속(명)</TableCell>
                      <TableCell align="center">최소 동시접속(명)</TableCell>
                      <TableCell align="center">최대 동시접속(명)</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessUserPeriodDaus?.length > 0 ||
                    accessUserPeriodIntervals?.length > 0 ||
                    accessUserPeriodPlays?.length > 0 ||
                    accessUserPeriodCurrents?.length > 0 ? (
                      getLabelDays('YYYY-MM-DD', currentSearchEndDate, currentSearchStartDate)?.map((data, index) => {
                        const dauData = accessUserPeriodDaus?.find((find) => find.statisticsDate === data)
                        const intervalData = accessUserPeriodIntervals?.find((find) => find.statisticsDate === data)
                        const playData = accessUserPeriodPlays?.find((find) => find.statisticsDate === data)
                        const currentData = accessUserPeriodCurrents?.find((find) => find.statisticsDate === data)
                        return (
                          <TableRow key={`accessStatisticsTable_${index}`}>
                            <TableCell align="center">{data}</TableCell>
                            <TableCell align="center">{dauData?.userExistCnt ?? '-'}</TableCell>
                            <TableCell align="center">{intervalData?.intervalAvg ?? '-'}</TableCell>
                            <TableCell align="center">{intervalData?.intervalMax ?? '-'}</TableCell>
                            <TableCell align="center">{playData?.playAvg ?? '-'}</TableCell>
                            <TableCell align="center">{playData?.playMax ?? '-'}</TableCell>
                            <TableCell align="center">{currentData?.concurrentAvg ?? '-'}</TableCell>
                            <TableCell align="center">{currentData?.concurrentMin ?? '-'}</TableCell>
                            <TableCell align="center">{currentData?.concurrentMax ?? '-'}</TableCell>
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
        </TabArea>
      </Grid>
    </Grid>
  )
}

export default Access

const tabs = [
  {
    name: '활성 사용자',
    key: 'Dau',
  },
  {
    name: '플레이 타임',
    key: 'PlayTime',
  },
  {
    name: '세션 인터벌',
    key: 'SessionInterval',
  },
  {
    name: '동시 접속자',
    key: 'ConCurrent',
  },
  {
    name: '재방문',
    key: 'Retention',
  },
]

const convert = {
  userExistCnt: '활성사용자 수',
  intervalAvg: '평균 세션인터벌',
  intervalMax: '최대 세션인터벌',
  playAvg: '평균 플레이타임',
  playMax: '최대 플레이타임',
  concurrentMin: '최소 동시접속',
  concurrentMax: '최대 동시접속',
  concurrentAvg: '평균 동시접속',
  statisticsDate: '',
}
