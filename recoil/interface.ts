import { I_menuNameSet } from 'components/common/Navigation/menuLists'

export interface I_loaderModalStateType {
  isOpen: boolean
}

export interface I_alertModalStateType {
  isOpen: boolean
  alertText: string
  clickButtonCallback?: () => void
}

export interface I_confirmModalStateType {
  isOpen: boolean
  alertText: string
  completeButtonCallback?: () => void
}

export interface I_tableStateType {
  page: number
  rowsPerPage: number
  totalCount: number
}

export interface I_tabActiveStateType {
  menuName: string
  menuCode: string
  link: I_menuNameSet['link']
}

export interface I_userInfoRecoil {
  name: string
  email: string
  department: number
  position: number
  phone: string
  roleCode: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_MASTER'
  seq: number
  status: 'Y' | 'N' | 'S'
  lastLoginTime: string
  registDate: string
  menuList: string[]
}

export interface I_typeInfoRecoil {
  department: Array<{
    groupId: number
    groupName: string
  }>
  position: Array<{
    positionId: number
    positionName: string
  }>
  role: Array<{
    roleCode: string
    roleName: string
  }>
}
