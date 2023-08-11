import Grid from '@core/components/Grid'
import Typography from '@core/components/Typography'
import React from 'react'
import { useRouter } from 'next/router'
import { I_menuDepthsSet, detailMenuLists, headerMenuLists } from './Navigation/menuLists'

/**
 *
 */
const PageHeader = () => {
  const [activeMenu, setActiveMenu] = React.useState<I_menuDepthsSet | null>()

  const router = useRouter()

  const userAuthMenus = (menus: I_menuDepthsSet[]): I_menuDepthsSet[] => {
    return menus?.map((menusData) => {
      if (menusData.list) {
        const childs = menusData.list
        return {
          ...menusData,
          isOpen: !!location.href.match(menusData.link),
          list: userAuthMenus(childs),
        }
      }
      if (location.href.match(menusData.link)) setActiveMenu(menusData)
      return menusData
    })
  }

  React.useEffect(() => {
    const activeTab = headerMenuLists.filter((data) => {
      return location.href.match(data.link)
    })[0]

    setActiveMenu(null)
    userAuthMenus(detailMenuLists[activeTab?.link ?? 'Dashbord'])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  return (
    <>
      {activeMenu && (
        <Grid type="item" style={{ marginBottom: '16px', borderBottom: '1px solid' }}>
          <Grid type="container">
            <Grid type="item">
              <Typography style={{ fontWeight: '700' }}>{activeMenu?.menuName}</Typography>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default PageHeader
