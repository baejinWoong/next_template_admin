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

/**
 *
 */
const GoodsInfo = () => {
  const [searchStartDate, setSearchStartDate] = React.useState<Date>(new Date(moment().subtract(7, 'day').format('YYYY-MM-DD')))
  const [searchEndDate, setSearchEndDate] = React.useState<Date>(new Date(moment().format('YYYY-MM-DD')))
  const [searchDateForm, setSearchDateForm] = React.useState<string | number>(7)

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
      setSearchEndDate(new Date(moment().subtract(1, 'day').format('YYYY-MM-DD')))
      setSearchStartDate(new Date(moment().subtract(event.currentTarget.value, 'day').format('YYYY-MM-DD')))
    }
  }

  return (
    <Grid type="container">
      <Grid type="item" style={{ marginTop: '20px' }}>
        <Grid type="container">
          <Grid type="item" area={12}>
            <Typography style={{ fontWeight: '500' }}>보유 재화</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid type="item">
        <Grid type="container" horizen="center">
          <Grid type="item" area={11.8}>
            <Grid type="container">
              <Grid type="item" area={12}>
                <Typography fontSize="body2">Gem 현황</Typography>
              </Grid>
              <Grid type="item" area={12} align="right" horizen="bottom">
                <Typography fontSize="element1" colorWeight="500">
                  {moment().subtract(1, 'day').format('YYYY.MM.DD')} 기준
                </Typography>
              </Grid>
            </Grid>
            <Card style={{ padding: '0' }}>
              <Grid
                type="container"
                style={{
                  height: '100%',
                }}
              >
                <Grid type="item" align="center" color="purple" colorWeight="200" style={{ padding: '16px 24px' }}>
                  <Grid type="container">
                    <Grid type="item" area={8} align="left">
                      <Typography fontSize="body2">현재 보유량</Typography>
                    </Grid>
                    <Grid type="item" area={8} align="center">
                      <Typography fontSize="body2">누적 적립량</Typography>
                    </Grid>
                    <Grid type="item" area={8} align="right">
                      <Typography fontSize="body2">누적 사용량</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid type="item" align="center" style={{ borderBottom: '0.5px solid #d6d6d6', padding: '20px 24px' }}>
                  <Grid type="container">
                    <Grid type="item" area={8} align="left">
                      <Typography fontSize="body2">현재 보유량</Typography>
                    </Grid>
                    <Grid type="item" area={8} align="center">
                      <Typography fontSize="body2">누적 적립량</Typography>
                    </Grid>
                    <Grid type="item" area={8} align="right">
                      <Typography fontSize="body2">누적 사용량</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid type="item" area={0.4} />
          <Grid type="item" area={11.8}>
            <Grid type="container">
              <Grid type="item" area={12}>
                <Typography fontSize="body2">Gold 현황</Typography>
              </Grid>
              <Grid type="item" area={12} align="right" horizen="bottom">
                <Typography fontSize="element1" colorWeight="500">
                  {moment().subtract(1, 'day').format('YYYY.MM.DD')} 기준
                </Typography>
              </Grid>
            </Grid>
            <Card style={{ padding: '0' }}>
              <Grid
                type="container"
                style={{
                  height: '100%',
                }}
              >
                <Grid type="item" align="center" color="purple" colorWeight="200" style={{ padding: '16px 24px' }}>
                  <Grid type="container">
                    <Grid type="item" area={8} align="left">
                      <Typography fontSize="body2">현재 보유량</Typography>
                    </Grid>
                    <Grid type="item" area={8} align="center">
                      <Typography fontSize="body2">누적 적립량</Typography>
                    </Grid>
                    <Grid type="item" area={8} align="right">
                      <Typography fontSize="body2">누적 사용량</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid type="item" align="center" style={{ borderBottom: '0.5px solid #d6d6d6', padding: '20px 24px' }}>
                  <Grid type="container">
                    <Grid type="item" area={8} align="left">
                      <Typography fontSize="body2">현재 보유량</Typography>
                    </Grid>
                    <Grid type="item" area={8} align="center">
                      <Typography fontSize="body2">누적 적립량</Typography>
                    </Grid>
                    <Grid type="item" area={8} align="right">
                      <Typography fontSize="body2">누적 사용량</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid type="item">
        <Grid type="container">
          <Grid type="item">
            <Card style={{ padding: '14px 10px' }}>
              <Grid type="container">
                <Grid type="item" area={4} horizen="center">
                  <Typography>재화 지급</Typography>
                </Grid>
                <Grid type="item" area={6} horizen="center" align="center">
                  <Radio label="Gem" group="goodType" size="large" value={7} defaultChecked />
                  <Radio label="Gold" group="goodType" size="large" value={14} />
                </Grid>
                <Grid type="item" area={6} horizen="center">
                  <Input placeholder="지급할 수량을 입력하세요" />
                </Grid>
                <Grid type="item" area={0.5} horizen="center" />
                <Grid type="item" area={2} horizen="center">
                  <Button>지급</Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid type="item" style={{ marginTop: '20px' }}>
        <Grid type="container">
          <Grid type="item" area={12}>
            <Typography style={{ fontWeight: '500' }}>보유 재화 적립/사용내역</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid type="item">
        <Grid type="container" horizen="center" color="black" colorWeight="300" style={{ padding: '14px 10px' }}>
          <Grid type="item" area={16}>
            <Grid type="container">
              <Grid type="item" area={12} horizen="center" align="center">
                <Radio label="7일" group="goodInfoSearchDate" size="large" value={7} onChange={changeSearchDateFormHandler} defaultChecked />
                <Radio label="14일" group="goodInfoSearchDate" size="large" value={14} onChange={changeSearchDateFormHandler} />
                <Radio label="30일" group="goodInfoSearchDate" size="large" value={30} onChange={changeSearchDateFormHandler} />
                <Radio label="90일" group="goodInfoSearchDate" size="large" value={90} onChange={changeSearchDateFormHandler} />
                <Radio label="직접입력" group="goodInfoSearchDate" size="large" value="manual" onChange={changeSearchDateFormHandler} />
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
                <Dropdown>
                  <Option value={1}>Gem</Option>
                  <Option value={2}>Gold</Option>
                </Dropdown>
              </Grid>
            </Grid>
          </Grid>
          <Grid type="item" area={8}>
            <Grid type="container" align="right">
              <Grid type="item" area={6}></Grid>
              <Grid type="item" area={6}>
                <Button afterTagNode={SearchMarkSvg}>검색</Button>
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
              10
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
            <TableRow>
              <TableCell align="center">플랫폼</TableCell>
              <TableCell align="center">로그인</TableCell>
              <TableCell align="center">로그아웃</TableCell>
              <TableCell align="center">플레이 타임</TableCell>
            </TableRow>
          </TableBody>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

export default GoodsInfo
