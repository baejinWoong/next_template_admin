import {
  I_loaderModalStateType,
  I_alertModalStateType,
  I_confirmModalStateType,
  I_tableStateType,
  I_tabActiveStateType,
  I_userInfoRecoil,
  I_typeInfoRecoil,
} from './interface'

export const loaderModalState: I_loaderModalStateType = {
  isOpen: false,
}

export const alertModalState: I_alertModalStateType = {
  isOpen: false,
  alertText: '',
}

export const confirmModalState: I_confirmModalStateType = {
  isOpen: false,
  alertText: '',
}

export const tableState: I_tableStateType = {
  page: 1,
  rowsPerPage: 20,
  totalCount: 0,
}

export const tabActiveState: I_tabActiveStateType = {
  menuName: '',
  menuCode: '',
  link: 'TotalDashBoard',
}

export const multiAuthUserInfoState: I_userInfoRecoil[] = []

export const typeInfoState: I_typeInfoRecoil = {
  department: [],
  position: [],
  role: [],
}
