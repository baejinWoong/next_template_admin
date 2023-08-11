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
    void router.push(`/AdminManagement/${userAuthMenus(detailMenuLists.AdminManagement)[0].link}`)
  }, [router])
  return <div></div>
}

export default Index
