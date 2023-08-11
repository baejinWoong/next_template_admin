import { I_menuDepthsSet } from './menuLists'

export const userAuthMenus = (menus: I_menuDepthsSet[]): I_menuDepthsSet[] => {
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
  return (
    menus
      ?.map((menusData) => {
        if (menusData.list) {
          const childs = menusData.list
          const filterChildsAuths = (getLists as I_menuDepthsSet[])
            .map((sessionData: I_menuDepthsSet) => {
              return filterUserAuth(childs, sessionData.menuCode)
            })
            .filter((data) => {
              return data
            })
          return {
            ...menusData,
            isOpen: location.href.includes(menusData.link),
            list: userAuthMenus(filterChildsAuths),
          }
        }
        return menusData
      })
      .filter((menusData) => {
        const checkHaveMenu = getLists.filter((sessionData: { menuCode: string }) => {
          return sessionData.menuCode === menusData.menuCode
        })
        return checkHaveMenu.length
      }) ?? []
  )
}

export const getMenusAll = (menus: I_menuDepthsSet[]): I_menuDepthsSet[] => {
  return menus?.map((menusData) => {
    if (menusData.list) {
      const childs = menusData.list
      return {
        ...menusData,
        isOpen: !!location.href.match(menusData.link),
        list: getMenusAll(childs),
      }
    }
    return menusData
  })
}

export const getMenuFlat = (menus: I_menuDepthsSet[]): I_menuDepthsSet[] => {
  let result: I_menuDepthsSet[] = []
  menus?.forEach((data) => {
    if (data.list) result = result.concat(getMenuFlat(data.list))
    result = result.concat([data])
  })
  return result
}

export const getMenuParrentCode = (menus: I_menuDepthsSet[], code: string): string | undefined => {
  let result
  const getMenuList = (list: I_menuDepthsSet[], parrentCode: string) => {
    list?.forEach((data) => {
      if (data.menuCode === code && parrentCode !== code) {
        result = parrentCode
      } else {
        if (data.list) getMenuList(data.list, data.menuCode)
      }
    })
  }
  getMenuList(menus, code)
  return result
}

const filterUserAuth = (menus: I_menuDepthsSet[], code: string) => {
  return menus.filter((data) => {
    return data.menuCode === code
  })[0]
}
