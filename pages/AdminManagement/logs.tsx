import Grid from '@core/components/Grid'
import Tab from '@core/components/Tab'
import TabArea from '@core/components/TabArea'
import ActionLogs from 'components/logs/ActionLogs'
import JoinLogs from 'components/logs/JoinLogs'
import React from 'react'

/**
 *
 */
const Logs = () => {
  const [activeMenu, setActiveMenu] = React.useState<string>('action')
  const tabs = [
    {
      name: '활동로그',
      key: 'action',
    },
    {
      name: '접속로그',
      key: 'join',
    },
  ]
  const changeTabHandler = (target: string) => {
    setActiveMenu(target)
  }
  return (
    <Grid type="container">
      <Grid type="item" style={{ marginBottom: '24px' }}>
        <Tab tabs={tabs} onChange={changeTabHandler} />
      </Grid>
      <TabArea isActive={activeMenu === 'action'}>
        <Grid type="item">
          <ActionLogs />
        </Grid>
      </TabArea>
      <TabArea isActive={activeMenu === 'join'}>
        <Grid type="item">
          <JoinLogs />
        </Grid>
      </TabArea>
    </Grid>
  )
}

export default Logs
