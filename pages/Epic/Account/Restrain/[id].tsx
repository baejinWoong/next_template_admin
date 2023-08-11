import Grid from '@core/components/Grid'
import Tab from '@core/components/Tab'
import UserInfo from 'components/epic/account/UserInfo'
import Restriction from 'components/epic/account/Restriction'

// import ItemInfo from 'components/epic/account/ItemInfo'
// import GoodsInfo from 'components/epic/account/GoodsInfo'
// import PurchaseHistory from 'components/epic/account/PurchaseHistory'
// import RefundHistory from 'components/epic/account/RefundHistory'

import React from 'react'
import TabArea from '@core/components/TabArea'
import { useRouter } from 'next/router'
import { getMemberDetail } from 'api/epicApi'
import Typography from '@core/components/Typography'

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

/**
 *
 */
const AccountDetail = () => {
  const [userInfo, setUserInfo] = React.useState<I_userInfo>()
  const [activeMenu, setActiveMenu] = React.useState<string>('UserInfo')

  const router = useRouter()

  const tabs = [
    {
      name: '회원정보',
      key: 'UserInfo',
    },
    {
      name: '아이템 정보',
      key: 'ItemInfo',
    },
    {
      name: '재화정보',
      key: 'GoodsInfo',
    },
    {
      name: '구매내역',
      key: 'PurchaseHistory',
    },
    {
      name: '환불내역',
      key: 'RefundHistory',
    },
    {
      name: '이용제한 설정',
      key: 'Restriction',
    },
  ]

  const changeTabHandler = (target: string) => {
    setActiveMenu(target)
  }

  React.useEffect(() => {
    if (router.query.id) {
      const userSeq = Number(router.query.id)
      void getMemberDetail({ seq: userSeq }).then((response) => {
        if (response.data?.status.code === 'E20000') {
          setUserInfo(response.data.data)
        }
      })
    }
  }, [router])

  if (!userInfo) return <></>

  return (
    <Grid type="container">
      <Grid type="item">
        <Tab tabs={tabs} onChange={changeTabHandler} />
      </Grid>
      <Grid type="item" style={{ display: activeMenu === 'UserInfo' ? 'block' : 'none' }}>
        <UserInfo userInfo={userInfo} />
      </Grid>
      <TabArea isActive={activeMenu === 'ItemInfo'}>
        <Grid type="item">
          <Typography fontSize="body2"> 준비중입니다.</Typography>
          {/* <ItemInfo /> */}
        </Grid>
      </TabArea>
      <TabArea isActive={activeMenu === 'GoodsInfo'}>
        <Grid type="item">
          <Typography fontSize="body2"> 준비중입니다.</Typography>
          {/* <GoodsInfo /> */}
        </Grid>
      </TabArea>
      <TabArea isActive={activeMenu === 'PurchaseHistory'}>
        <Grid type="item">
          <Typography fontSize="body2"> 준비중입니다.</Typography>
          {/* <PurchaseHistory /> */}
        </Grid>
      </TabArea>
      <TabArea isActive={activeMenu === 'RefundHistory'}>
        <Grid type="item">
          <Typography fontSize="body2"> 준비중입니다.</Typography>
          {/* <RefundHistory /> */}
        </Grid>
      </TabArea>
      <TabArea isActive={activeMenu === 'Restriction'}>
        <Grid type="item">
          <Restriction userInfo={userInfo} />
        </Grid>
      </TabArea>
    </Grid>
  )
}

export default AccountDetail
