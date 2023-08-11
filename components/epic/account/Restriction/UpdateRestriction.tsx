import Button from '@core/components/Button'
import Card from '@core/components/Card'
import Grid from '@core/components/Grid'
import Radio from '@core/components/Radio'
import Typography from '@core/components/Typography'
import moment from 'moment'
import React from 'react'
import Dropdown from '@core/components/Dropdown'
import Option from '@core/components/Dropdown/Option'
import TextArea from '@core/components/TextArea'
import { alertModalRecoil, confirmModalRecoil } from 'recoil/atom'
import { useRecoilState } from 'recoil'
import { getRestrictionMessages, putMemberRestrictionInfo } from 'api/epicApi'
import { getDateForMonthSet, getMonthSet } from './util'

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

interface I_props {
  userInfo?: I_userInfo
  searchRestrictionLogs: () => void
  data?: I_restriction
  setData: React.Dispatch<React.SetStateAction<I_restriction | undefined>>
}

/**
 *
 */
const UpdateRestriction = (props: I_props) => {
  const { userInfo, searchRestrictionLogs, data, setData } = props
  const [restrictionType, setRestrictionType] = React.useState<'D' | 'E'>('D')
  const [restrictionStatus, setRestrictionStatus] = React.useState<number>(10)
  const [restrictionText, setRestrictionText] = React.useState<string>('')
  const [restrictionTextTypes, setRestrictionTextTypes] = React.useState<
    Array<{
      id: number
      contents: string
    }>
  >([])

  const [, setConfirmState] = useRecoilState(confirmModalRecoil)
  const [, setAlertModalState] = useRecoilState(alertModalRecoil)

  const [restrictionDateSet, setRestrictionDateSet] = React.useState<{
    startYears: number[]
    startMonths: number[]
    startDates: number[]
    endYears: number[]
    endMonths: number[]
    endDates: number[]
  }>({
    startYears: [],
    startMonths: [],
    startDates: [],
    endYears: [],
    endMonths: [],
    endDates: [],
  })

  const [restrictionStartDateForm, setRestrictionStartDateForm] = React.useState({
    year: new Date(data?.startDate ?? new Date()).getFullYear(),
    month: new Date(data?.startDate ?? new Date()).getMonth() + 1,
    date: new Date(data?.startDate ?? new Date()).getDate(),
  })

  const [restrictionEndDateForm, setRestrictionEndDateForm] = React.useState({
    year: new Date(data?.endDate ?? new Date()).getFullYear(),
    month: new Date(data?.endDate ?? new Date()).getMonth() + 1,
    date: new Date(data?.endDate ?? new Date()).getDate(),
  })

  const yearDropDownSet = (type: 'start' | 'end', startYear?: number) => {
    const defaultYear = new Date(data?.startDate ?? new Date()).getFullYear()
    const results = []
    if (type === 'start') {
      for (let i = 9; i > -1; i--) {
        results.push(defaultYear + i)
      }
    } else {
      for (let i = 9; i > -1; i--) {
        if (defaultYear + i >= (startYear ?? restrictionStartDateForm.year)) results.push(defaultYear + i)
      }
    }
    return results
  }

  const changeRestrictionCompoActive = () => {
    setData(undefined)
  }

  const changeRestrictionStartDateFormHandler = (data: string | number, type: 'year' | 'month' | 'date') => {
    let dateCheckByType
    switch (type) {
      case 'year':
        dateCheckByType = moment(`${Number(data)}-${restrictionStartDateForm.month}-${restrictionStartDateForm.date}`).isAfter(
          `${restrictionEndDateForm.year}-${restrictionEndDateForm.month}-${restrictionEndDateForm.date}`,
        )
        setRestrictionDateSet((prev) => ({
          ...prev,
          endYears: yearDropDownSet('end', Number(data)),
          endMonths: getMonthSet('end', restrictionStartDateForm, restrictionEndDateForm),
          endDates: getDateForMonthSet('end', restrictionStartDateForm, restrictionEndDateForm),
        }))
        break
      case 'month':
        dateCheckByType = moment(`${restrictionStartDateForm.year}-${Number(data)}-${restrictionStartDateForm.date}`).isAfter(
          `${restrictionEndDateForm.year}-${restrictionEndDateForm.month}-${restrictionEndDateForm.date}`,
        )
        setRestrictionDateSet((prev) => ({
          ...prev,
          startDates: getDateForMonthSet('start', restrictionStartDateForm, restrictionEndDateForm),
          endMonths: getMonthSet('end', restrictionStartDateForm, restrictionEndDateForm),
          endDates: getDateForMonthSet('end', restrictionStartDateForm, restrictionEndDateForm),
        }))
        break
      default:
        dateCheckByType = moment(`${restrictionStartDateForm.year}-${restrictionStartDateForm.month}-${Number(data)}`).isAfter(
          `${restrictionEndDateForm.year}-${restrictionEndDateForm.month}-${restrictionEndDateForm.date}`,
        )
        setRestrictionDateSet((prev) => ({ ...prev, endDates: getDateForMonthSet('end', restrictionStartDateForm, restrictionEndDateForm) }))
        break
    }

    if (dateCheckByType) {
      setRestrictionEndDateForm((prev) => ({ ...restrictionStartDateForm, [type]: Number(data) }))
    }
    setRestrictionStartDateForm((prev) => ({ ...prev, [type]: Number(data) }))
  }

  const changeRestrictionEndDateFormHandler = (data: string | number, type: 'year' | 'month' | 'date') => {
    switch (type) {
      case 'year':
        if (type) {
          const targetDateForm = { ...restrictionEndDateForm, year: data as number }
          const getTargetMonths = getMonthSet('end', restrictionStartDateForm, targetDateForm, data as number)
          const getTargetFirstMonthDate = getDateForMonthSet('end', restrictionStartDateForm, targetDateForm, getTargetMonths[0])
          setRestrictionDateSet((prev) => ({
            ...prev,
            endMonths: getTargetMonths,
            endDates: getDateForMonthSet(
              'end',
              restrictionStartDateForm,
              restrictionEndDateForm,
              getMonthSet('end', restrictionStartDateForm, targetDateForm, targetDateForm.month)[0],
            ),
          }))
          if (Number(data) === restrictionStartDateForm.year) {
            if (targetDateForm.month <= restrictionStartDateForm.month) {
              setRestrictionEndDateForm((prev) => ({ ...prev, month: getTargetMonths[0] }))
              setRestrictionEndDateForm((prev) => ({ ...prev, date: getTargetFirstMonthDate[0] }))
            }
          }
        }
        break
      case 'month':
        setRestrictionDateSet((prev) => ({ ...prev, endDates: getDateForMonthSet('end', restrictionStartDateForm, restrictionEndDateForm, data as number) }))
        if (getDateForMonthSet('end', restrictionStartDateForm, restrictionEndDateForm, data as number)[0] > restrictionEndDateForm.date)
          setRestrictionEndDateForm((prev) => ({
            ...prev,
            date: getDateForMonthSet('end', restrictionStartDateForm, restrictionEndDateForm, data as number)[0],
          }))
        if (restrictionEndDateForm.date > getDateForMonthSet('end', restrictionStartDateForm, restrictionEndDateForm, data as number).slice(-1)[0])
          setRestrictionEndDateForm((prev) => ({
            ...prev,
            date: getDateForMonthSet('end', restrictionStartDateForm, restrictionEndDateForm, data as number).slice(-1)[0],
          }))
        break
      default:
        setRestrictionDateSet((prev) => ({ ...prev, endDates: getDateForMonthSet('end', restrictionStartDateForm, restrictionEndDateForm) }))
        break
    }
    setRestrictionEndDateForm((prev) => ({ ...prev, [type]: Number(data) }))
  }

  const changeResrictionStatusHandler = (data: string | number) => {
    setRestrictionStatus(Number(data))
    setRestrictionText('')
  }

  const changeResrictionTypeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setRestrictionType(event.currentTarget.value as 'D' | 'E')
  }

  const changeResrictionTextHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRestrictionText(event.currentTarget.value)
  }

  const clickRestrictionAddHandler = () => {
    if (userInfo) {
      setConfirmState({
        isOpen: true,
        alertText: '이용제한을 수정 하시겠습니까?',
        completeButtonCallback: () => {
          if (data) {
            void putMemberRestrictionInfo({
              restrictionSeq: data.restrictionId,
              contents: restrictionText,
              endDate: moment(`${restrictionEndDateForm.year}-${restrictionEndDateForm.month}-${restrictionEndDateForm.date}`).format('YYYY-MM-DD'),
              startDate: moment(`${restrictionStartDateForm.year}-${restrictionStartDateForm.month}-${restrictionStartDateForm.date}`).format('YYYY-MM-DD'),
              seq: userInfo.memId,
              messageId: restrictionStatus,
              status: 'W',
              type: restrictionType,
            }).then((response) => {
              if (response.data.status.code === 'E20002') {
                setAlertModalState({
                  isOpen: true,
                  alertText: '수정 되었습니다.',
                  clickButtonCallback: () => {
                    searchRestrictionLogs()
                    setData(undefined)
                  },
                })
              }
            })
          }
        },
      })
    }
  }

  const clickResetHandler = () => {
    setConfirmState({
      isOpen: true,
      alertText: '기존 내용이 모두 초기화 됩니다.\n 정말 초기화 하시겠습니까?',
      completeButtonCallback: () => {
        setRestrictionDateSet({
          startYears: yearDropDownSet('start'),
          startMonths: getMonthSet('start', restrictionStartDateForm, restrictionEndDateForm),
          startDates: getDateForMonthSet('start', restrictionStartDateForm, restrictionEndDateForm),
          endYears: yearDropDownSet('end'),
          endMonths: getMonthSet('end', restrictionStartDateForm, restrictionEndDateForm),
          endDates: getDateForMonthSet('end', restrictionStartDateForm, restrictionEndDateForm),
        })

        setRestrictionStartDateForm({
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          date: new Date().getDate(),
        })

        setRestrictionEndDateForm({
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          date: new Date().getDate(),
        })

        setRestrictionText('')

        setRestrictionType('D')

        setRestrictionStatus(10)
      },
    })
  }

  React.useEffect(() => {
    setRestrictionDateSet({
      startYears: yearDropDownSet('start'),
      startMonths: getMonthSet('start', restrictionStartDateForm, restrictionEndDateForm),
      startDates: getDateForMonthSet('start', restrictionStartDateForm, restrictionEndDateForm),
      endYears: yearDropDownSet('end'),
      endMonths: getMonthSet('end', restrictionStartDateForm, restrictionEndDateForm),
      endDates: getDateForMonthSet('end', restrictionStartDateForm, restrictionEndDateForm, new Date(data?.endDate ?? new Date()).getMonth() + 1),
    })

    setRestrictionText(data?.contents ?? '')
    setRestrictionStatus(data?.messageId ?? 10)
    setRestrictionType(data?.type ?? 'D')

    setRestrictionStartDateForm({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      date: new Date().getDate(),
    })

    setRestrictionEndDateForm({
      year: new Date(data?.endDate ?? new Date()).getFullYear(),
      month: new Date(data?.endDate ?? new Date()).getMonth() + 1,
      date: new Date(data?.endDate ?? new Date()).getDate(),
    })

    void getRestrictionMessages().then((response) => {
      if (response.data.status.code === 'E20000') {
        setRestrictionTextTypes(response.data.data)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <Grid type="item" style={{ marginTop: '24px' }}>
      <Card style={{ padding: '12px 16px' }}>
        <Grid type="container">
          <Grid type="item" area={21} horizen="center">
            <Typography>이용 제한 설정</Typography>
          </Grid>
          <Grid type="item" area={3}>
            <Button type={data ? 'secondary' : 'disabled'} onClick={changeRestrictionCompoActive} disabled={!data}>
              수정 취소
            </Button>
          </Grid>
        </Grid>
      </Card>
      {data && (
        <Card style={{ padding: '0', borderTop: '0' }}>
          <Grid type="container">
            <Grid type="item" area={4} color="black" colorWeight="200" style={{ padding: '14px', borderRight: '1px solid #d6d6d6' }}>
              <Typography fontSize="body2">제한 기간 설정</Typography>
            </Grid>
            <Grid type="item" area={20} style={{ padding: '0' }}>
              <Grid type="container">
                <Grid type="item" style={{ padding: '14px', borderBottom: '1px solid #d6d6d6' }}>
                  <Radio group="setting" value="D" label="직접 설정" size="large" checked={restrictionType === 'D'} onChange={changeResrictionTypeHandler} />
                  <Radio group="setting" value="E" label="영구 제한" size="large" checked={restrictionType === 'E'} onChange={changeResrictionTypeHandler} />
                </Grid>
                <Grid type="item" style={{ padding: '14px' }}>
                  <Grid type="container">
                    <Grid type="item" area={11}>
                      <Typography fontSize="body2">시작일시</Typography>
                    </Grid>
                    <Grid type="item" area={2}></Grid>
                    {restrictionType === 'D' && (
                      <Grid type="item" area={11}>
                        <Typography fontSize="body2">종료일시</Typography>
                      </Grid>
                    )}
                  </Grid>
                  <Grid type="container">
                    <Grid type="item" area={11}>
                      <Grid type="container">
                        <Grid type="item" area={7.8}>
                          <Dropdown
                            type="1"
                            value={restrictionStartDateForm.year}
                            onChange={(data) => changeRestrictionStartDateFormHandler(data, 'year')}
                            readOnly
                          >
                            {restrictionDateSet.startYears.map((data, index) => (
                              <Option key={`startYear_${index}`} value={data}>
                                {`${data} 년`}
                              </Option>
                            ))}
                          </Dropdown>
                        </Grid>
                        <Grid type="item" area={0.2} />
                        <Grid type="item" area={7.8}>
                          <Dropdown
                            type="1"
                            value={restrictionStartDateForm.month}
                            onChange={(data) => changeRestrictionStartDateFormHandler(data, 'month')}
                            readOnly
                          >
                            {restrictionDateSet.startMonths.map((data, index) => (
                              <Option key={`startMonth_${index}`} value={data}>
                                {`${data} 월`}
                              </Option>
                            ))}
                          </Dropdown>
                        </Grid>
                        <Grid type="item" area={0.2} />
                        <Grid type="item" area={7.8}>
                          <Dropdown
                            type="1"
                            value={restrictionStartDateForm.date}
                            onChange={(data) => changeRestrictionStartDateFormHandler(data, 'date')}
                            readOnly
                          >
                            {restrictionDateSet.startDates.map((data, index) => (
                              <Option key={`startDate_${index}`} value={data}>
                                {`${data} 일`}
                              </Option>
                            ))}
                          </Dropdown>
                        </Grid>
                      </Grid>
                    </Grid>
                    {restrictionType === 'D' && (
                      <>
                        <Grid type="item" area={2} align="center" horizen="center">
                          <Typography>-</Typography>
                        </Grid>
                        <Grid type="item" area={11}>
                          <Grid type="container">
                            <Grid type="item" area={7.8}>
                              <Dropdown type="1" value={restrictionEndDateForm.year} onChange={(data) => changeRestrictionEndDateFormHandler(data, 'year')}>
                                {restrictionDateSet.endYears.map((data, index) => (
                                  <Option key={`startYear_${index}`} value={data}>
                                    {`${data} 년`}
                                  </Option>
                                ))}
                              </Dropdown>
                            </Grid>
                            <Grid type="item" area={0.2} />
                            <Grid type="item" area={7.8}>
                              <Dropdown type="1" value={restrictionEndDateForm.month} onChange={(data) => changeRestrictionEndDateFormHandler(data, 'month')}>
                                {restrictionDateSet.endMonths.map((data, index) => (
                                  <Option key={`startMonth_${index}`} value={data}>
                                    {`${data} 월`}
                                  </Option>
                                ))}
                              </Dropdown>
                            </Grid>
                            <Grid type="item" area={0.2} />
                            <Grid type="item" area={7.8}>
                              <Dropdown type="1" value={restrictionEndDateForm.date} onChange={(data) => changeRestrictionEndDateFormHandler(data, 'date')}>
                                {restrictionDateSet.endDates.map((data, index) => (
                                  <Option key={`startDate_${index}`} value={data}>
                                    {`${data} 일`}
                                  </Option>
                                ))}
                              </Dropdown>
                            </Grid>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid type="container">
            <Grid
              type="item"
              area={4}
              color="black"
              colorWeight="200"
              style={{ padding: '14px', borderRight: '1px solid #d6d6d6', borderTop: '1px solid #d6d6d6' }}
            >
              <Typography fontSize="body2">제한 사유</Typography>
            </Grid>
            <Grid type="item" area={20} style={{ padding: '0', borderTop: '1px solid #d6d6d6' }}>
              <Grid type="container">
                <Grid type="item" style={{ padding: '8px 24px' }}>
                  <Dropdown type="1" value={restrictionStatus} onChange={changeResrictionStatusHandler}>
                    {restrictionTextTypes.map((data, index) => (
                      <Option key={`restriction_messageType_${index}`} value={data.id}>
                        {data.contents}
                      </Option>
                    ))}
                  </Dropdown>
                </Grid>
                <Grid type="item" style={{ padding: '8px 24px' }}>
                  <TextArea
                    maxLength={300}
                    placeholder="내용을 입력하세요"
                    disabled={restrictionStatus !== 10}
                    addOn={{ textCount: true }}
                    style={{ height: '400px' }}
                    value={restrictionText}
                    onChange={changeResrictionTextHandler}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid type="item" style={{ borderTop: '1px solid #d6d6d6', padding: '12px 0px' }}>
              <Grid type="container" align="center">
                <Grid type="item" area={3}>
                  <Button type="secondary" onClick={clickResetHandler}>
                    초기화
                  </Button>
                </Grid>
                <Grid type="item" area={1}></Grid>
                <Grid type="item" area={3}>
                  <Button onClick={clickRestrictionAddHandler}>적용하기</Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      )}
    </Grid>
  )
}

export default UpdateRestriction
