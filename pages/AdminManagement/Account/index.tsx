import { detailMenuLists } from 'components/common/Navigation/menuLists'
import { userAuthMenus } from 'components/common/Navigation/util'
import { useRouter } from 'next/router'
import React from 'react'

/**
 *
 */
const Index = () => {
  const router = useRouter()

  React.useEffect(() => {
    const statsticsMenu = userAuthMenus(detailMenuLists.AdminManagement).find((find) => find.menuCode === 'ELMU20')?.list
    void router.push(`/AdminManagement/Account/${statsticsMenu?.[0].link ?? ''}`)
  }, [router])
  return <div>준비중 입니다.</div>
}

export default Index
