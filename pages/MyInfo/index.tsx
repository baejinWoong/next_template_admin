import Grid from '@core/components/Grid'
import MainLayout from 'components/common/layout/MainLayout'
import Tab from '@core/components/Tab'
import { getMyInfo } from 'api/adminApi'
import Account from 'components/myinfo/Account'
import Security from 'components/myinfo/Security'
import React from 'react'
import TabArea from '@core/components/TabArea'

interface I_userInfo {
  name: string
  email: string
  department: string
  position: string
  roleCode: string
  phone: string
  seq: number
}

/**
 *
 */
const Index = () => {
  const [activeMenu, setActiveMenu] = React.useState<string>('MyInfo')
  const [initUserInfo, setInitUserInfo] = React.useState<I_userInfo>(defaultUserInfo)

  const tabs = [
    {
      name: '내 정보 수정',
      key: 'MyInfo',
    },
    {
      name: '비밀번호 변경',
      key: 'ChangePassword',
    },
  ]

  const changeTabHandler = (target: string) => {
    setActiveMenu(target)
  }

  React.useEffect(() => {
    void getMyInfo().then((response) => {
      if (response.data?.status.code === 'E20000') {
        setInitUserInfo(response.data?.data)
      }
    })
  }, [])

  return (
    <Grid type="container">
      <Grid type="item" style={{ marginBottom: '24px' }}>
        <Tab tabs={tabs} onChange={changeTabHandler} />
      </Grid>
      <TabArea isActive={activeMenu === 'MyInfo'}>
        <Grid type="item">
          <Account initUserInfo={initUserInfo} />
        </Grid>
      </TabArea>
      <TabArea isActive={activeMenu === 'ChangePassword'}>
        <Grid type="item">
          <Security />
        </Grid>
      </TabArea>
    </Grid>
  )
}

Index.getLayout = (page: React.ReactNode) => <MainLayout>{page}</MainLayout>

export default Index

const defaultUserInfo = {
  name: '',
  email: '',
  department: '',
  position: '',
  roleCode: '',
  phone: '',
  seq: 0,
}
