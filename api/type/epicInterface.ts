/**
 * @param type : 전체 : A, 회사 : C, 일반 : N
 * @param state : 정상 : Y, 탈퇴 : N, 제재 : P, 휴면 : D
 */
export interface I_getEpicMemberProps {
  page: number
  pageSize: number
  keyword?: string
  type?: Array<'C' | 'N'>
  state?: Array<'Y' | 'N' | 'P' | 'D'>
}

export interface I_getEpicMemberDetailProps {
  seq: number
}

export interface I_getEpicMemberLoginLogsProps {
  page: number
  pageSize: number
  startDate: string
  endDate: string
  seq: number
}

/**
 * @param type : 전체 : A, 활성화 : Y, 종료 : D, 철회 : N
 */
export interface I_getEpicMemberRestrictionLogsProps {
  page: number
  pageSize: number
  startDate: string
  endDate: string
  seq: number
  type: 'A' | 'Y' | 'D' | 'N'
}

/**
 * @param accountType : 회사 : C, 일반 : N
 */
export interface I_putMemberAccountTypeProps {
  seq: number[]
  accountType: 'C' | 'N'
}

export interface I_putMemberRestrictionInfoProps {
  restrictionSeq: number
  type: 'D' | 'E'
  seq: number
  startDate: string
  endDate: string
  messageId: number
  contents: string
  status: 'Y' | 'D' | 'N' | 'W' | 'F'
}

export interface I_postMemberRestrictionInfoProps {
  type: 'D' | 'E'
  seq: number
  startDate: string
  endDate: string
  messageId: number
  contents: string
  status: 'Y' | 'D' | 'N' | 'W' | 'F'
}

export interface I_putMemberRestrictionWithdrawProps {
  restrictionSeq: number
  seq: number
  status: 'F'
  contents: string
}

export interface I_getStatisticsDateProps {
  date: string
}

export interface I_getStatisticsStartEndDateProps {
  startDate: string
  endDate: string
}

export interface I_getMemberExcelDownloadProps {
  keyword?: string
  type?: Array<'C' | 'N'>
  state?: Array<'Y' | 'N' | 'P' | 'D'>
}

export interface I_getStatisticsGameUserPeriodDownloadProps {
  startDate: string
  endDate: string
}

export interface I_getDashBoardProps {
  startDate: string
  endDate: string
}
