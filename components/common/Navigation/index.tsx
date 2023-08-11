import React from 'react'
import { I_menuDepthsSet, detailMenuLists } from './menuLists'
import { NextRouter, useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { tabActiveRecoil } from 'recoil/atom'
import { userAuthMenus } from './util'

const GetAllMenuEl = (
  data: I_menuDepthsSet,
  clickMenuCode: string,
  setClickMenuCode: (clickMenuCode: string) => void,
  onActive: (targetCode: string) => void,
  isFirst: boolean,
  router: NextRouter,
  activeTab: string,
  parrentLink?: string,
) => {
  const iconType = `${data.isOpen ? 'minus' : isFirst ? 'plus' : 'arrow'}`
  const iconColor = `${clickMenuCode !== data.menuCode ? 'gray' : 'purple'}`
  const iconNumber = `${data.isOpen ? '01' : isFirst ? '01' : '02'}`
  const isMenu = router.asPath.match(`${parrentLink ?? ''}/${data.link}`)
  const havingDepthMenuClickHandler = (event: React.MouseEvent) => {
    event.stopPropagation()
    setClickMenuCode(!data.isOpen ? data.menuCode : '')
    onActive(data.menuCode)
  }
  const lastDepthMenuClickHandler = (event: React.MouseEvent) => {
    event.stopPropagation()
    onActive(data.menuCode)
    setClickMenuCode(!data.isOpen ? data.menuCode : '')
    void router.push(`/${activeTab}${parrentLink ? `/${parrentLink}` : ''}${data.link ? `/${data.link}` : ''}`)
  }
  if (data.list) {
    if (data.list.length > 0) {
      return (
        <li onClick={havingDepthMenuClickHandler} key={`${data.menuCode}`}>
          <strong className={`depthTitle${data.isOpen ? ` activeNoneColor` : ''}`}>
            <span>
              {data.menuName}
              <div className="toggleIcon">
                <img src={`/icons/ico_${iconType}_${iconColor}_${iconNumber}.png`} alt="" />
              </div>
            </span>
          </strong>
          <ul className="depthNav">
            {data.list.map((childData: I_menuDepthsSet) => {
              return GetAllMenuEl(
                childData,
                clickMenuCode,
                setClickMenuCode,
                onActive,
                false,
                router,
                activeTab,
                `${parrentLink ? `${parrentLink}/` : ''}${data.link}`,
              )
            })}
          </ul>
        </li>
      )
    }
    return <React.Fragment key={`${data.menuCode}`}></React.Fragment>
  }
  return (
    <li onClick={lastDepthMenuClickHandler} key={`${data.menuCode}`}>
      <strong className={`depthTitle${(isMenu && ' activeColor') ?? ''}`}>
        <span>{data.menuName}</span>
      </strong>
    </li>
  )
}

const Navigation = () => {
  const [menus, setMenus] = React.useState<I_menuDepthsSet[]>([])
  const [clickMenuCode, setClickMenuCode] = React.useState('')
  const [activeTab] = useRecoilState(tabActiveRecoil)

  const naviRef = React.useRef<HTMLDivElement>(null)

  const router = useRouter()

  const scrollNaviEvent = (event: React.WheelEvent<HTMLDivElement>) => {
    const targetEl = event.currentTarget as HTMLElement
    const TargetScrollY = targetEl.scrollTop
    targetEl.scrollTo({ top: TargetScrollY + event.deltaY, behavior: 'smooth' })
  }

  const scrollNaviBubbleDiff = (event: WheelEvent) => {
    event.preventDefault()
  }

  const clickNavigationItemHandler = (targetCode: string) => {
    const getChildOpen = (data: I_menuDepthsSet, targetCode: string): boolean => {
      if (data.list) {
        return (
          data.list.filter((data: I_menuDepthsSet) => {
            if (data.list) {
              return getChildOpen(data, targetCode) || targetCode === data.menuCode
            }
            return targetCode === data.menuCode
          }).length > 0
        )
      }
      return false
    }
    const getNewMenuSet = (data: I_menuDepthsSet): I_menuDepthsSet => {
      if (data.menuCode === targetCode) {
        return {
          ...data,
          isOpen: !data.isOpen,
          list: data.list?.map((data) => getNewMenuSet(data)),
        }
      }
      return {
        ...data,
        isOpen: getChildOpen(data, targetCode),
        list: data.list?.map((data) => getNewMenuSet(data)),
      }
    }
    setMenus(
      menus?.map((data) => {
        return getNewMenuSet(data)
      }),
    )
  }

  React.useEffect(() => {
    const target = naviRef.current as HTMLDivElement
    target.addEventListener('wheel', scrollNaviBubbleDiff, { passive: false })
    return () => {
      target.removeEventListener('wheel', scrollNaviBubbleDiff)
    }
  }, [])

  React.useEffect(() => {
    setClickMenuCode('')
    if (activeTab) setMenus(userAuthMenus(detailMenuLists[activeTab.link]))
  }, [activeTab, router])

  return (
    <div ref={naviRef}>
      <div className="navigation" onWheel={scrollNaviEvent}>
        <div className="navigationBox">
          <ul className="depthNav">
            {menus.map((data) => {
              return GetAllMenuEl(data, clickMenuCode, setClickMenuCode, clickNavigationItemHandler, true, router, activeTab.link)
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navigation
