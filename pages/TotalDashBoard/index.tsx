import Grid from '@core/components/Grid'
import MainLayout from 'components/common/layout/MainLayout'
import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'
import Card from '@core/components/Card'
import Typography from '@core/components/Typography'
import moment from 'moment'
import TableContainer from '@core/components/Table/TableContainer'
import TableHeader from '@core/components/Table/TableHeader'
import TableBody from '@core/components/Table/TableBody'
import TableRow from '@core/components/Table/TableRow'
import TableCell from '@core/components/Table/TableCell'
import { getDashBoard } from 'api/dashBoardApi'
import { LABELDAYS, TARGETDATE } from 'utils/epic'
import { chartOption, getLabelDays, getRandomRGB } from 'utils'

interface I_dashBoardData {
  memberCountData: Array<{ date: string; dormantCnt: number; newCnt: number; sanctionsCnt: number; totalCnt: number; withdrewCnt: number }>
  paymentData: Array<{ arppu: number; arpu: number; date: string; total: number }>
  sameTimeUser: Array<{ avg: number; max: number; date: string }>
  realtimePaymentData: { avg: number; total: number; modifyDateTime: string }
  realtimeSignupData: { signupAvg: number; signupCnt: number; modifyDateTime: string }
  retention: {
    [index: string]: { [index: string]: Array<{ n: number; statisticsDay: string; userActiveCnt: number; userRetentionCnt: number }> }
  }
}

/**
 *
 */
const Index = () => {
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

  const [data, setData] = React.useState<I_dashBoardData>({
    memberCountData: [],
    paymentData: [],
    sameTimeUser: [],
    realtimePaymentData: { avg: 0, total: 0, modifyDateTime: '' },
    realtimeSignupData: { signupAvg: 0, signupCnt: 0, modifyDateTime: '' },
    retention: { none: { [`${moment(TARGETDATE).subtract(LABELDAYS, 'day').format('YYYY-MM-DD')}`]: [] } },
  })

  const chartData = () => {
    const datasets = Object.keys(data.retention).map((keys) => {
      const color = getRandomRGB()
      return {
        label: keys,
        data: data.retention[keys][moment(TARGETDATE).subtract(LABELDAYS, 'day').format('YYYY-MM-DD')].map((data) =>
          Math.floor((data.userActiveCnt / data.userRetentionCnt) * 100),
        ),
        borderColor: color,
        backgroundColor: color,

        pointBackgroundColor: '#FFFFFF',
      }
    })

    return {
      labels: getLabelDays(
        'MM.DD',
        new Date(moment(TARGETDATE).subtract(1, 'day').format('YYYY-MM-DD')),
        new Date(moment(TARGETDATE).subtract(LABELDAYS, 'day').format('YYYY-MM-DD')),
      ),
      datasets,
    }
  }

  React.useEffect(() => {
    void getDashBoard({
      // startDate: moment().subtract(7, 'day').format('YYYY-MM-DD'),
      // endDate: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      startDate: moment(TARGETDATE).subtract(LABELDAYS, 'day').format('YYYY-MM-DD'),
      endDate: moment(TARGETDATE).subtract(1, 'day').format('YYYY-MM-DD'),
    }).then((response) => {
      if (response.data.status.code === 'E20000') setData(response.data.data)
    })
  }, [])

  return (
    <Grid type="container">
      <Grid type="item" style={{ marginBottom: '16px', borderBottom: '1px solid' }}>
        <Grid type="container">
          <Grid type="item">
            <Typography style={{ fontWeight: '700' }}>통합 대시보드</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid type="item">
        <Grid type="container">
          <Grid type="item" area={12} align="left">
            <Typography fontSize="element1">7-Day Retention</Typography>
          </Grid>
          <Grid type="item" area={12} align="right">
            <Typography fontSize="element1" colorWeight="500">
              {moment(TARGETDATE).subtract(LABELDAYS, 'day').format('YYYY.MM.DD')} ~ {moment(TARGETDATE).subtract(1, 'day').format('YYYY.MM.DD')}
            </Typography>
          </Grid>
        </Grid>
        <Grid type="container">
          <Grid type="item">
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
                              return `${value}%`
                            },
                          },
                        },
                      },
                    }}
                    data={chartData()}
                    style={{
                      height: '400px',
                      width: '100%',
                    }}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid type="item" style={{ marginTop: '24px' }}>
        <Grid type="container" style={{ columnGap: '4%', justifyContent: 'space-between' }}>
          <Grid type="item" area={11.5}>
            <Grid type="container">
              <Grid type="item" area={12}>
                <Typography>회원 통계</Typography>
              </Grid>
              <Grid type="item" area={12} align="right" horizen="bottom">
                <Typography fontSize="body2" colorWeight="500">
                  단위: (명)
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid type="item" area={11.5}>
            <Grid type="container">
              <Grid type="item" area={12}>
                <Typography>실시간 통계</Typography>
              </Grid>
              <Grid type="item" area={12} align="right" horizen="bottom">
                <Typography fontSize="body2" colorWeight="500">
                  {data.realtimeSignupData.modifyDateTime
                    ? moment(data.realtimeSignupData.modifyDateTime).format('MM월 DD일 HH시 기준')
                    : '00시 00일 00시 기준'}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid type="container" style={{ columnGap: '4%', justifyContent: 'space-between' }}>
          <Grid type="item" area={11.5}>
            <Grid type="container">
              <Grid type="item">
                <TableContainer style={{ boxShadow: 'rgba(91, 71, 188, 0.3) 0px 0px 11px 0px' }}>
                  <TableHeader>
                    <TableRow>
                      <TableCell align="center">날짜</TableCell>
                      <TableCell align="center">신규 회원수</TableCell>
                      <TableCell align="center">제재 회원수</TableCell>
                      <TableCell align="center">휴면 회원수</TableCell>
                      <TableCell align="center">탈퇴 회원수</TableCell>
                      <TableCell align="center">전체 회원수</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getLabelDays(
                      'YYYY-MM-DD',
                      new Date(moment(TARGETDATE).subtract(1, 'day').format('YYYY-MM-DD')),
                      new Date(moment(TARGETDATE).subtract(LABELDAYS, 'day').format('YYYY-MM-DD')),
                    ).map((map, index) => {
                      const findData = data.memberCountData.find((find) => find.date === map)
                      return (
                        <TableRow key={`accountStatistics_${map}`}>
                          <TableCell align="center">{moment(map).format('YYYY.MM.DD')}</TableCell>
                          <TableCell align="center">{findData?.newCnt.toLocaleString() ?? '-'}</TableCell>
                          <TableCell align="center">{findData?.withdrewCnt.toLocaleString() ?? '-'}</TableCell>
                          <TableCell align="center">{findData?.sanctionsCnt.toLocaleString() ?? '-'}</TableCell>
                          <TableCell align="center">{findData?.dormantCnt.toLocaleString() ?? '-'}</TableCell>
                          <TableCell align="center">{findData?.totalCnt.toLocaleString() ?? '-'}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </TableContainer>
              </Grid>
            </Grid>
          </Grid>
          <Grid type="item" area={11.5}>
            <Grid type="container" style={{ height: '100%', minHeight: '400px', alignContent: 'space-between' }}>
              <Grid type="item">
                <Card style={{ padding: '0', boxShadow: 'rgba(91, 71, 188, 0.3) 0px 0px 11px 0px' }}>
                  <Grid
                    type="container"
                    style={{
                      height: '100%',
                    }}
                  >
                    <Grid type="item" area={12} align="center" color="purple" colorWeight="200" style={{ padding: '12px' }}>
                      <Typography fontSize="body2">실시간 가입자수(전체 플랫폼)</Typography>
                    </Grid>
                    <Grid type="item" area={12} align="center" color="purple" colorWeight="200" style={{ padding: '12px' }}>
                      <Typography fontSize="body2">시간당 평균 가입자 수(전체 플랫폼)</Typography>
                    </Grid>
                    <Grid type="item" area={12} align="center" style={{ padding: '30px 12px' }}>
                      <Typography fontSize="subtitle1">{data.realtimeSignupData.signupCnt.toLocaleString()} 명</Typography>
                    </Grid>
                    <Grid type="item" area={12} align="center" style={{ padding: '30px 12px' }}>
                      <Typography fontSize="subtitle1">{data.realtimeSignupData.signupAvg.toLocaleString()} 명</Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              <Grid type="item">
                <Grid type="container">
                  <Grid type="item" align="right" horizen="bottom">
                    <Typography fontSize="body2" colorWeight="500">
                      {data.realtimePaymentData.modifyDateTime
                        ? moment(data.realtimePaymentData.modifyDateTime).format('MM월 DD일 HH시 기준')
                        : moment(data.realtimeSignupData.modifyDateTime).format('MM월 DD일 HH시 기준')}
                    </Typography>
                  </Grid>
                </Grid>
                <Card style={{ padding: '0', boxShadow: 'rgba(91, 71, 188, 0.3) 0px 0px 11px 0px' }}>
                  <Grid type="container">
                    <Grid type="item" area={12} align="center" color="purple" colorWeight="200" style={{ padding: '12px' }}>
                      <Typography fontSize="body2">실시간 매출(전체 플랫폼)</Typography>
                    </Grid>
                    <Grid type="item" area={12} align="center" color="purple" colorWeight="200" style={{ padding: '12px' }}>
                      <Typography fontSize="body2">시간당 평균 매출 (전체 플랫폼)</Typography>
                    </Grid>
                    <Grid type="item" area={12} align="center" style={{ padding: '30px 12px' }}>
                      <Typography fontSize="subtitle1">₩ {data.realtimePaymentData.total.toLocaleString()}</Typography>
                    </Grid>
                    <Grid type="item" area={12} align="center" style={{ padding: '30px 12px' }}>
                      <Typography fontSize="subtitle1">₩ {data.realtimePaymentData.avg.toLocaleString()}</Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid type="item" style={{ marginTop: '24px' }}>
        <Grid type="container">
          <Grid type="item" area={12}>
            <Typography>일자별 동시접속자 평균 통계</Typography>
          </Grid>
          <Grid type="item" area={12} align="right" horizen="bottom">
            <Typography fontSize="body2" colorWeight="500">
              단위: (명)
            </Typography>
          </Grid>
        </Grid>
        <Grid type="container">
          <Grid type="item">
            <Card style={{ padding: '0', boxShadow: 'rgba(91, 71, 188, 0.3) 0px 0px 11px 0px' }}>
              <Grid type="container">
                <Grid
                  type="item"
                  area={24 / (LABELDAYS + 1)}
                  align="center"
                  color="purple"
                  colorWeight="200"
                  style={{ padding: '6px 4px', border: '0.5px solid #d6d6d6' }}
                >
                  <Typography fontSize="body2">날짜</Typography>
                </Grid>
                {getLabelDays(
                  'YYYY-MM-DD',
                  new Date(moment(TARGETDATE).subtract(1, 'day').format('YYYY-MM-DD')),
                  new Date(moment(TARGETDATE).subtract(LABELDAYS, 'day').format('YYYY-MM-DD')),
                ).map((map, index) => {
                  return (
                    <Grid
                      type="item"
                      area={24 / (LABELDAYS + 1)}
                      key={`concurrent_date_${map}`}
                      align="center"
                      color="purple"
                      colorWeight="200"
                      style={{ padding: '6px 4px', border: '0.5px solid #d6d6d6' }}
                    >
                      <Typography colorWeight="500" fontSize="body2">
                        {moment(map).format('YYYY.MM.DD')}
                      </Typography>
                    </Grid>
                  )
                })}
                <Grid
                  type="item"
                  area={24 / (LABELDAYS + 1)}
                  align="center"
                  color="purple"
                  colorWeight="200"
                  style={{ padding: '6px 4px', border: '0.5px solid #d6d6d6' }}
                >
                  <Typography fontSize="body2">동시접속자 평균</Typography>
                </Grid>
                {getLabelDays(
                  'YYYY-MM-DD',
                  new Date(moment(TARGETDATE).subtract(1, 'day').format('YYYY-MM-DD')),
                  new Date(moment(TARGETDATE).subtract(LABELDAYS, 'day').format('YYYY-MM-DD')),
                ).map((map) => {
                  const findData = data.sameTimeUser.find((find) => find.date === map)
                  return (
                    <Grid
                      type="item"
                      area={24 / (LABELDAYS + 1)}
                      key={`concurrent_date_${map}`}
                      align="center"
                      style={{ padding: '6px 4px', border: '0.5px solid #d6d6d6' }}
                    >
                      <Typography fontSize="body2">{findData?.avg.toLocaleString() ?? '-'}</Typography>
                    </Grid>
                  )
                })}
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid type="item" style={{ marginTop: '24px' }}>
        <Grid type="container">
          <Grid type="item" area={12}>
            <Typography>일자별 매출 통계</Typography>
          </Grid>
        </Grid>
        <Grid type="container">
          <Grid type="item">
            <Card style={{ padding: '0', boxShadow: 'rgba(91, 71, 188, 0.3) 0px 0px 11px 0px' }}>
              <Grid type="container">
                <Grid
                  type="item"
                  area={24 / (LABELDAYS + 1)}
                  align="center"
                  color="purple"
                  colorWeight="200"
                  style={{ padding: '6px 4px', border: '0.5px solid #d6d6d6' }}
                >
                  <Typography fontSize="body2">날짜</Typography>
                </Grid>
                {getLabelDays(
                  'YYYY-MM-DD',
                  new Date(moment(TARGETDATE).subtract(1, 'day').format('YYYY-MM-DD')),
                  new Date(moment(TARGETDATE).subtract(LABELDAYS, 'day').format('YYYY-MM-DD')),
                ).map((map, index) => {
                  return (
                    <Grid
                      type="item"
                      area={24 / (LABELDAYS + 1)}
                      key={`concurrent_date_${map}`}
                      align="center"
                      color="purple"
                      colorWeight="200"
                      style={{ padding: '6px 4px', border: '0.5px solid #d6d6d6' }}
                    >
                      <Typography colorWeight="500" fontSize="body2">
                        {moment(map).format('YYYY.MM.DD')}
                      </Typography>
                    </Grid>
                  )
                })}
                <Grid
                  type="item"
                  area={24 / (LABELDAYS + 1)}
                  align="center"
                  color="purple"
                  colorWeight="200"
                  style={{ padding: '6px 4px', border: '0.5px solid #d6d6d6' }}
                >
                  <Typography fontSize="body2">매출액(₩)</Typography>
                </Grid>
                {getLabelDays(
                  'YYYY-MM-DD',
                  new Date(moment(TARGETDATE).subtract(1, 'day').format('YYYY-MM-DD')),
                  new Date(moment(TARGETDATE).subtract(LABELDAYS, 'day').format('YYYY-MM-DD')),
                ).map((map) => {
                  const findData = data.paymentData.find((find) => find.date === map)
                  return (
                    <Grid
                      type="item"
                      area={24 / (LABELDAYS + 1)}
                      key={`concurrent_date_${map}`}
                      align="center"
                      style={{ padding: '6px 4px', border: '0.5px solid #d6d6d6' }}
                    >
                      <Typography fontSize="body2">{findData?.total.toLocaleString() ?? '-'}</Typography>
                    </Grid>
                  )
                })}
                <Grid
                  type="item"
                  area={24 / (LABELDAYS + 1)}
                  align="center"
                  color="purple"
                  colorWeight="200"
                  style={{ padding: '6px 4px', border: '0.5px solid #d6d6d6' }}
                >
                  <Typography fontSize="body2">ARPU(₩)</Typography>
                </Grid>
                {getLabelDays(
                  'YYYY-MM-DD',
                  new Date(moment(TARGETDATE).subtract(1, 'day').format('YYYY-MM-DD')),
                  new Date(moment(TARGETDATE).subtract(LABELDAYS, 'day').format('YYYY-MM-DD')),
                ).map((map) => {
                  const findData = data.paymentData.find((find) => find.date === map)
                  return (
                    <Grid
                      type="item"
                      area={24 / (LABELDAYS + 1)}
                      key={`concurrent_date_${map}`}
                      align="center"
                      style={{ padding: '6px 4px', border: '0.5px solid #d6d6d6' }}
                    >
                      <Typography fontSize="body2">{findData?.arpu.toLocaleString() ?? '-'}</Typography>
                    </Grid>
                  )
                })}
                <Grid
                  type="item"
                  area={24 / (LABELDAYS + 1)}
                  align="center"
                  color="purple"
                  colorWeight="200"
                  style={{ padding: '6px 4px', border: '0.5px solid #d6d6d6' }}
                >
                  <Typography fontSize="body2">ARPPU(₩)</Typography>
                </Grid>
                {getLabelDays(
                  'YYYY-MM-DD',
                  new Date(moment(TARGETDATE).subtract(1, 'day').format('YYYY-MM-DD')),
                  new Date(moment(TARGETDATE).subtract(LABELDAYS, 'day').format('YYYY-MM-DD')),
                ).map((map) => {
                  const findData = data.paymentData.find((find) => find.date === map)
                  return (
                    <Grid
                      type="item"
                      area={24 / (LABELDAYS + 1)}
                      key={`concurrent_date_${map}`}
                      align="center"
                      style={{ padding: '6px 4px', border: '0.5px solid #d6d6d6' }}
                    >
                      <Typography fontSize="body2">{findData?.arppu.toLocaleString() ?? '-'}</Typography>
                    </Grid>
                  )
                })}
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

Index.getLayout = (page: React.ReactNode) => <MainLayout>{page}</MainLayout>

export default Index
