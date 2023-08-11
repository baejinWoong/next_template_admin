import Grid from '@core/components/Grid'
import Typography from '@core/components/Typography'
import { getDepartment, getPosition, getRole } from 'api/adminApi'
import { useRouter } from 'next/router'
import React from 'react'
import { useRecoilState } from 'recoil'
import { alertModalRecoil, confirmModalRecoil, tabActiveRecoil, typeInfoRecoil } from 'recoil/atom'
import { I_menuDepthsSet, headerMenuLists } from './Navigation/menuLists'
import Button from '@core/components/Button'

// import PopOver from '@core/components/PopOver'

const Header = () => {
  // const [isOpenPopOver, setIsOpenPopOver] = React.useState(false)
  // const [userInfo, setUserInfo] = React.useState<any>()

  const [, setConfirmModalState] = useRecoilState(confirmModalRecoil)
  const [, setAlertModalState] = useRecoilState(alertModalRecoil)
  const [tabActiveState, setTabActiveState] = useRecoilState(tabActiveRecoil)
  const [typeInfoState, setTypeInfoState] = useRecoilState(typeInfoRecoil)

  const router = useRouter()

  const headerRef = React.useRef<HTMLElement>(null)

  // const userTitleRef = React.useRef(null)

  const clickLogoHandler = () => {
    void router.push(`/${tabActiveState?.link ?? ''}`)
  }

  // const clickAdminNameHandler = () => {
  //   setIsOpenPopOver(true)
  // }

  const clickMyInfoHandler = () => {
    void router.push('/MyInfo')

    // setIsOpenPopOver(false)
  }

  const clickMenuTabsHandler = (data: I_menuDepthsSet) => {
    void router.push(`/${data.link}`)
  }

  const logoutHandler = () => {
    setConfirmModalState({
      alertText: '로그아웃 하시겠습니까?',
      isOpen: true,
      completeButtonCallback: () => {
        window.sessionStorage.clear()
        setAlertModalState({
          alertText: '로그아웃 되었습니다.',
          isOpen: true,
          clickButtonCallback: () => {
            void router.push('/login')
          },
        })
      },
    })
  }

  const userAuthMenus = () => {
    const sessionMenus = JSON.parse(window.sessionStorage.getItem('loginUserInfo') ?? '{}').menuAuth
    const getLists =
      sessionMenus?.menuAuth
        .map((data: I_menuDepthsSet) => {
          return { menuCode: data.menuCode }
        })
        .concat(
          sessionMenus.parentMenu.map((data: I_menuDepthsSet) => {
            return { menuCode: data.menuCode }
          }),
        ) ?? []
    return headerMenuLists.filter((data) => {
      return getLists.find((target: { menuCode: string }) => target.menuCode === data.menuCode)
    })
  }

  const adminHeaderTitleCheckHandler = () => {
    if (tabActiveState?.link === 'Steam' || tabActiveState?.link === 'Epic') {
      return tabActiveState.link
    }
    return ''
  }

  React.useEffect(() => {
    // const userInfoData = JSON.parse(window.sessionStorage.getItem('loginUserInfo') ?? '{}')
    // setUserInfo(userInfoData)

    const getTypeData = async () => {
      const data = {
        department: (await getDepartment()).data?.data,
        position: (await getPosition()).data?.data,
        role: (await getRole()).data?.data,
      }
      setTypeInfoState(data)
    }

    if (typeInfoState.department.length < 1) void getTypeData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useLayoutEffect(() => {
    const activeTab = headerMenuLists.filter((data) => {
      return location.href.match(data.link)
    })[0]

    if (!activeTab && router.pathname === '/') {
      void router.replace(userAuthMenus()[0].link)
    } else {
      setTabActiveState(activeTab)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  return (
    <header ref={headerRef} style={{ paddingRight: '55px' }}>
      <h1 onClick={clickLogoHandler} style={{ width: '15%' }}>
        <span>{adminHeaderTitleCheckHandler()} ADMIN</span>
      </h1>
      <div style={{ width: '45%' }}>
        <Grid type="container">
          {userAuthMenus().map((data, idx) => (
            <Grid type="item" area={6} key={`headerMenu_${data.menuCode}`}>
              <Typography
                color="white"
                style={{ cursor: 'pointer', fontWeight: data.link === tabActiveState?.link ? '700' : '' }}
                fontSize="body2"
                onClick={() => clickMenuTabsHandler(data)}
              >
                {data.menuName}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </div>
      <div style={{ width: '10%' }}>
        <Grid type="container" style={{ justifyContent: 'space-between' }}>
          <Grid type="item" area={11.5}>
            <Button color="black" size="minimum" onClick={clickMyInfoHandler}>
              내정보
            </Button>
          </Grid>
          <Grid type="item" area={11.5} style={{ whiteSpace: 'nowrap' }}>
            <Button color="black" size="minimum" onClick={logoutHandler}>
              로그아웃
            </Button>
          </Grid>
        </Grid>
      </div>
      {/* <div className="adminName" onClick={clickAdminNameHandler} ref={userTitleRef}>
        <span>{userInfo?.name} 님 환영합니다.</span>
      </div>
      <PopOver open={isOpenPopOver} setOpen={setIsOpenPopOver} targetRef={userTitleRef}>
        <Typography fontSize="element1">
          {`${
            typeInfoState.department?.filter((data) => {
              return data.groupId === userInfo?.department
            })[0]?.groupName
          }/${
            typeInfoState.position?.filter((data) => {
              return data.positionId === userInfo?.position
            })[0]?.positionName
          }`}
        </Typography>
        <hr />
        <Grid type="container">
          <Grid type="item">
            <Typography onClick={clickMyInfoHandler} fontSize="body2" style={{ cursor: 'pointer' }}>
              내 정보
            </Typography>
          </Grid>
          <Grid type="item">
            <Typography onClick={logoutHandler} fontSize="body2" style={{ cursor: 'pointer' }}>
              로그아웃
            </Typography>
          </Grid>
        </Grid>
      </PopOver> */}
    </header>
  )
}

export default Header
