export interface I_postLoginParams {
  email: string
  password: string
}

export interface I_getMemberParams {
  keyword?: string | null | undefined
  page: number
  pageSize: number
  type?: string | null | undefined
  status?: string | 'y' | 'n' | 's'
}

export interface I_getMultiAuthorizedUsersParams {
  keyword?: string | null | undefined
  lastId?: number | undefined
  pageSize: number
  type?: string | null | undefined
}

export interface I_postMemberParams {
  name: string
  email: string
  department: string
  position: string
  roleCode: string
  phone: string
  seq: number
  menuAuth: Array<{
    code: string
    read: boolean
    create: boolean
    delete: boolean
  }>
}

export interface I_putMemberParams {
  info: boolean
  menu: boolean
  department: string
  position: string
  roleCode: string
  phone: string
  seq: number
  menuAuth?: Array<{
    code: string
    read: boolean
    create: boolean
    delete: boolean
  }>
}

export interface I_memberDetailParams {
  seq: number
}

export interface I_passwordUpdateParams {
  newPassword: string
  newPasswordCheck: string
  password: string
}

export interface I_updateMultiAdminAuthParams {
  seqList: number[]
  parentMenu: string[]
  menuAuth: Array<{
    code: string
    read: boolean
    create: boolean
    delete: boolean
  }>
}

export interface I_getMemberActionLogsParams {
  page: number
  pageSize: number
  startDate: string
  endDate: string
  adminFilter: 'name' | 'email'
  adminKeyword?: string
  menuFilter: 'all' | string
  keyword?: string
}

export interface I_getMemberLoginLogsParams {
  page: number
  pageSize: number
  startDate: string
  endDate: string
  adminFilter: 'name' | 'email'
  adminKeyword?: string
  departmentCode?: 'all' | number
}

export interface I_getMemberActionLogsExcelParams {
  startDate: string
  endDate: string
  adminFilter: 'name' | 'email'
  adminKeyword?: string
  menuFilter: 'all' | string
  keyword?: string
}

export interface I_getMemberLoginLogsExcelParams {
  startDate: string
  endDate: string
  adminFilter: 'name' | 'email'
  adminKeyword?: string
  departmentCode?: 'all' | number
}
