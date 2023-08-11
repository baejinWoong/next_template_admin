import Button from '@core/components/Button'
import Card from '@core/components/Card'
import Grid from '@core/components/Grid'
import Img from '@core/components/Img'
import Input from '@core/components/Input'
import Typography from '@core/components/Typography'
import Modal from '@core/modal'
import moment from 'moment'
import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useRecoilState } from 'recoil'
import { alertModalRecoil } from 'recoil/atom'

interface I_userInfoModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  itemId: number
  language: 'kr' | 'en'
}

interface I_itemInfo {
  itemId: string
  kr: {
    name: string
    description: string
  }
  en: {
    name: string
    description: string
  }
  imageUrl: string
  category: string
  categoryName: string
  itemName: string
  nftYn: 0 | 1
  nftLimitedAmount: number
  webIcon2d: number
  nftRegisterInfo?: {
    nftRegisterId: number
    totalAmt: number
    stockAmt: number
    price: number
    startDt: Date
    endDt: Date
    state: number
  }
}

/**
 *
 */
const ItemInfoModal = (props: I_userInfoModalProps) => {
  const [, setAlertModalState] = useRecoilState(alertModalRecoil)

  const [data, setData] = React.useState<I_itemInfo>(defaultData)
  const [mintStartDate, setMintStartDate] = React.useState<Date>(new Date())
  const [mintEndDate, setMintEndDate] = React.useState<Date>(new Date())
  const [viewMonth, setViewMonth] = React.useState<Date>(new Date())
  const [price, setPrice] = React.useState<string>('')
  const [totalSupply, setTotalSupply] = React.useState<number>()

  const closeModalHandler = () => {
    setData(defaultData)
    setMintStartDate(new Date())
    setMintEndDate(new Date())
    setViewMonth(new Date())
    setPrice('')
    setTotalSupply(0)
    props.setIsOpen(false)
  }

  // const mintingItemHandler = () => {
  //   void postMinting({
  //     itemId: data.itemId,
  //     price,
  //     whitelistId: 0,
  //     totalSupply: totalSupply ?? 0,
  //     startDate: mintStartDate,
  //     endDate: mintEndDate,
  //   }).then((response) => {
  //     if (response.data.status.code) {
  //       setAlertModalState({
  //         alertText: '민팅 등록 되었습니다.',
  //         isOpen: true,
  //         clickButtonCallback: closeModalHandler,
  //       })
  //     }
  //   })
  // }

  const changeMintStartDate = (date: Date) => {
    if (moment(date).isBefore(new Date().setDate(new Date().getDate() - 1))) {
      setAlertModalState({
        alertText: '시작일은 당일 이전일수 없습니다.',
        isOpen: true,
      })
    } else if (moment(date).isSameOrBefore(mintEndDate)) {
      setMintStartDate(date)
    } else {
      setAlertModalState({
        alertText: '종료일 이전의 날짜를 입력해 주세요.',
        isOpen: true,
      })
    }
  }

  const changeMintEndDate = (date: Date) => {
    if (moment(date).isAfter(mintStartDate)) {
      setMintEndDate(date)
    } else {
      setAlertModalState({
        alertText: '시작일 이후 날짜를 입력해 주세요.',
        isOpen: true,
      })
    }
  }

  const changeMintPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(event.currentTarget.value)
  }

  const changeMintTotalSupply = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTotalSupply(Number(event.currentTarget.value))
  }

  // React.useEffect(() => {
  //   if (props.itemId)
  //     void getDetailItems(props.itemId.toString()).then((response) => {
  //       if (response.data.status.code === 'E20000') {
  //         const resData = response.data.data as I_itemInfo
  //         setData(resData)
  //         if (resData.nftRegisterInfo) {
  //           setMintStartDate(new Date(resData.nftRegisterInfo.startDt))
  //           setMintEndDate(new Date(resData.nftRegisterInfo.endDt))
  //         }
  //       }
  //     })
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.isOpen])
  return (
    <Modal open={props.isOpen}>
      <Card type={2}>
        <Grid type="container">
          <Grid type="item">
            <Card type={2} style={{ background: 'none' }}>
              <Grid type="container">
                <Grid type="item" area={8} horizen="center">
                  <Img src={data.imageUrl} width={'100%'} style={{ borderRadius: '12px' }} />
                </Grid>
                <Grid type="item" area={14} horizen="center">
                  <Grid type="container" style={{ marginLeft: '40px' }}>
                    <Grid type="item">
                      <Grid type="container">
                        <Grid type="item" area={8}>
                          <Typography colorWeight="500">아이템 이름</Typography>
                        </Grid>
                        <Grid type="item" area={15}>
                          <Typography style={{ fontWeight: '700' }}>{data[props.language].name}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid type="item" style={gapStyle}>
                      <Grid type="container">
                        <Grid type="item" area={8} horizen="center">
                          <Typography colorWeight="500">아이템 설명</Typography>
                        </Grid>
                        <Grid type="item" area={15} horizen="center">
                          <Typography style={{ fontWeight: '700' }}>{data[props.language].description}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid type="item" style={gapStyle}>
                      <Grid type="container">
                        <Grid type="item" area={8} horizen="center">
                          <Typography colorWeight="500">카테고리</Typography>
                        </Grid>
                        <Grid type="item" area={15} horizen="center">
                          <Typography style={{ fontWeight: '700' }}>{data.categoryName}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid type="item" style={gapStyle}>
                      <Grid type="container">
                        <Grid type="item" area={8} horizen="center">
                          <Typography colorWeight="500">민팅여부</Typography>
                        </Grid>
                        <Grid type="item" area={15} horizen="center">
                          <Typography style={{ fontWeight: '700' }}>{data.nftRegisterInfo ? '불가능' : '가능'}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid type="item">
            <Grid type="container">
              {!!data.nftYn && (
                <>
                  {!!data.nftRegisterInfo && (
                    <>
                      <Grid type="item" style={{ marginTop: '40px' }}>
                        <Card type={2} style={{ background: 'none', padding: '16px 40px' }}>
                          <Grid type="container">
                            <Grid type="item" area={8} horizen="center">
                              <Typography>판매 수량</Typography>
                            </Grid>
                            <Grid type="item" area={16} align="right" horizen="center">
                              <Typography>{(data.nftRegisterInfo?.totalAmt ?? 0).toLocaleString()}</Typography>
                            </Grid>
                          </Grid>
                        </Card>
                      </Grid>

                      <Grid type="item" style={gapStyle}>
                        <Card type={2} style={{ background: 'none', padding: '16px 40px' }}>
                          <Grid type="container">
                            <Grid type="item" area={8}>
                              <Typography>재고 수량</Typography>
                            </Grid>
                            <Grid type="item" area={16} align="right">
                              <Typography>{(data.nftRegisterInfo?.stockAmt ?? 0).toLocaleString()}</Typography>
                            </Grid>
                          </Grid>
                        </Card>
                      </Grid>
                    </>
                  )}

                  <Grid type="item" style={gapStyle}>
                    <Card type={2} style={{ background: 'none', padding: '16px 40px' }}>
                      <Grid type="container">
                        <Grid type="item" area={16} horizen="center">
                          <Typography>판매단가</Typography>
                        </Grid>
                        <Grid type="item" area={8} align="right">
                          {data.nftRegisterInfo ? (
                            <Typography>{data.nftRegisterInfo?.price ?? 0}&nbsp;ETH</Typography>
                          ) : (
                            <Input value={price} onChange={changeMintPrice} style={{ textAlign: 'right' }} afterTagNode={<div>&nbsp;ETH</div>} />
                          )}
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>

                  <Grid type="item" style={gapStyle}>
                    <Card type={2} style={{ background: 'none', padding: '16px 40px' }}>
                      <Grid type="container">
                        <Grid type="item" area={16} horizen="center">
                          <Typography>민팅수량</Typography>
                        </Grid>
                        <Grid type="item" area={8} align="right">
                          {data.nftRegisterInfo ? (
                            <Typography>{data.nftLimitedAmount > 0 ? data.nftLimitedAmount : '제한없음'}</Typography>
                          ) : (
                            <Input value={totalSupply} onChange={changeMintTotalSupply} style={{ textAlign: 'right' }} type="tel" />
                          )}
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>

                  <Grid type="item" style={gapStyle}>
                    <Card type={2} style={{ background: 'none', padding: '16px 40px' }}>
                      <Grid type="container">
                        <Grid type="item" area={8} horizen="center">
                          <Typography>MINTING</Typography>
                        </Grid>
                        <Grid type="item" area={16}>
                          <Grid type="container" align="right">
                            <Grid type="item" area={7}>
                              <DatePicker
                                selected={mintStartDate}
                                onChange={changeMintStartDate}
                                disabled={!!data.nftRegisterInfo || !data.nftYn}
                                showTimeSelect
                                customInput={
                                  <Button size="middum" style={{ height: '40px' }} type={!!data.nftRegisterInfo || !data.nftYn ? 'disabled' : 'primary'}>
                                    {moment(mintStartDate).format('YYYY-MM-DD HH:mm:ss')}
                                  </Button>
                                }
                                dayClassName={(date) =>
                                  moment(date).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD')
                                    ? 'custom-day selected-day'
                                    : date.getMonth() !== new Date().getMonth()
                                    ? 'custom-day react-datepicker__day--disabled'
                                    : date.getDay() === 6
                                    ? 'custom-day blue-day'
                                    : date.getDay() === 0
                                    ? 'custom-day red-day'
                                    : 'custom-day'
                                }
                              />
                            </Grid>
                            <Grid type="item" area={1} horizen="center" align="center">
                              <Typography>~</Typography>
                            </Grid>
                            <Grid type="item" area={7}>
                              <DatePicker
                                selected={mintEndDate}
                                onChange={changeMintEndDate}
                                disabled={!!data.nftRegisterInfo || !data.nftYn}
                                showTimeSelect
                                customInput={
                                  <Button size="middum" style={{ height: '40px' }} type={!!data.nftRegisterInfo || !data.nftYn ? 'disabled' : 'primary'}>
                                    {moment(mintEndDate).format('YYYY-MM-DD HH:mm:ss')}
                                  </Button>
                                }
                                dayClassName={(date) =>
                                  moment(date).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD')
                                    ? 'custom-day selected-day'
                                    : date.getMonth() !== viewMonth.getMonth()
                                    ? 'custom-day react-datepicker__day--disabled'
                                    : date.getDay() === 6
                                    ? 'custom-day blue-day'
                                    : date.getDay() === 0
                                    ? 'custom-day red-day'
                                    : 'custom-day'
                                }
                                onMonthChange={(month) => {
                                  setViewMonth(month)
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
          <Grid type="item" style={{ marginTop: '24px' }}>
            <Grid type="container">
              <Grid type="item">
                <Grid type="container" align="right">
                  <Grid type="item" area={3}>
                    {!!data.nftYn && !data.nftRegisterInfo && (
                      <Button type="secondary" size="middum" style={{ marginRight: 2 }}>
                        민팅
                      </Button>
                    )}
                  </Grid>
                  <Grid type="item" area={3}>
                    <Button type="primary" size="middum" onClick={closeModalHandler} style={{ marginRight: 2 }}>
                      닫기
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Modal>
  )
}

export default ItemInfoModal

const gapStyle = { marginTop: '12px' }

const defaultData: I_itemInfo = {
  itemId: '',
  kr: {
    name: '',
    description: '',
  },
  en: {
    name: '',
    description: '',
  },
  imageUrl: '',
  category: '',
  categoryName: '',
  itemName: '',
  nftYn: 0,
  nftLimitedAmount: 0,
  webIcon2d: 0,
}
