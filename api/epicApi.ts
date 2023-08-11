import axiosInstance from './http'
import { I_getDashBoardProps } from './type/dashBoardInterface'
import {
  I_getEpicMemberProps,
  I_getEpicMemberDetailProps,
  I_getEpicMemberLoginLogsProps,
  I_getEpicMemberRestrictionLogsProps,
  I_putMemberAccountTypeProps,
  I_putMemberRestrictionInfoProps,
  I_postMemberRestrictionInfoProps,
  I_putMemberRestrictionWithdrawProps,
  I_getStatisticsDateProps,
  I_getStatisticsStartEndDateProps,
  I_getMemberExcelDownloadProps,
  I_getStatisticsGameUserPeriodDownloadProps,
} from './type/epicInterface'

export const getNormallyMembers = async (data: I_getEpicMemberProps) => {
  const uri = `/epic/members/normally?${(data.keyword && `keyword=${encodeURI(data.keyword)}&`) ?? ''}page=${data.page}&pageSize=${data.pageSize}${
    (data.type && `&type=${data.type.toString()}`) ?? ''
  }${(data.state && `&state=${data.state.toString()}`) ?? ''}`
  return await axiosInstance.get(uri)
}

export const getCompanyMembers = async (data: I_getEpicMemberProps) => {
  const uri = `/epic/members/company?${(data.keyword && `keyword=${encodeURI(data.keyword)}&`) ?? ''}page=${data.page}&pageSize=${data.pageSize}${
    (data.type && `&type=${data.type.toString()}`) ?? ''
  }${(data.state && `&state=${data.state.toString()}`) ?? ''}`
  return await axiosInstance.get(uri)
}

export const getInActiveMembers = async (data: I_getEpicMemberProps) => {
  const uri = `/epic/members/inactive?${(data.keyword && `keyword=${encodeURI(data.keyword)}&`) ?? ''}page=${data.page}&pageSize=${data.pageSize}${
    (data.type && `&type=${data.type.toString()}`) ?? ''
  }${(data.state && `&state=${data.state.toString()}`) ?? ''}`
  return await axiosInstance.get(uri)
}

export const getMemberDetail = async (data: I_getEpicMemberDetailProps) => {
  const uri = `/epic/member/${data.seq}`
  return await axiosInstance.get(uri)
}

export const getMemberLoginLogs = async (data: I_getEpicMemberLoginLogsProps) => {
  const uri = `/epic/member/loginInfo?seq=${data.seq}&page=${data.page}&pageSize=${data.pageSize}&startDate=${data.startDate}&endDate=${data.endDate}`
  return await axiosInstance.get(uri)
}

export const getMemberRestrictionLogs = async (data: I_getEpicMemberRestrictionLogsProps) => {
  const uri = `/epic/member/restrictionInfos?seq=${data.seq}&page=${data.page}&pageSize=${data.pageSize}&startDate=${data.startDate}&endDate=${data.endDate}&type=${data.type}`
  return await axiosInstance.get(uri)
}

export const putMemberAccountType = async (data: I_putMemberAccountTypeProps) => {
  const uri = '/epic/member/accountType'
  return await axiosInstance.put(uri, data)
}

export const putMemberRestrictionInfo = async (data: I_putMemberRestrictionInfoProps) => {
  const uri = '/epic/member/restrictionInfo'
  return await axiosInstance.put(uri, data)
}

export const postMemberRestrictionInfo = async (data: I_postMemberRestrictionInfoProps) => {
  const uri = '/epic/member/restrictionInfo'
  return await axiosInstance.post(uri, data)
}

export const getRestrictionMessages = async () => {
  const uri = '/epic/member/restriction/messages'
  return await axiosInstance.get(uri)
}

export const putMemberRestrictionWithdraw = async (data: I_putMemberRestrictionWithdrawProps) => {
  const uri = '/epic/member/restriction/withdraw'
  return await axiosInstance.put(uri, data)
}

export const getMemberExcelDownload = async (data: I_getMemberExcelDownloadProps) => {
  const url = `/epic/members/download?${(data.keyword && `keyword=${encodeURI(data.keyword)}&`) ?? ''}${(data.type && `type=${data.type.toString()}&`) ?? ''}${
    (data.state && `state=${data.state.toString()}`) ?? ''
  }`
  return await axiosInstance.get(url, { responseType: 'blob' })
}

export const getStatisticsGameUserPeriodDownload = async (data: I_getStatisticsGameUserPeriodDownloadProps) => {
  const url = `/epic/statistics/gameUser/period/download?startDate=${data.startDate}&endDate=${data.endDate}`
  return await axiosInstance.get(url, { responseType: 'blob' })
}

export const getStatisticsAccessPeriodDownload = async (data: I_getStatisticsGameUserPeriodDownloadProps) => {
  const url = `/epic/statistics/access/period/download?startDate=${data.startDate}&endDate=${data.endDate}`
  return await axiosInstance.get(url, { responseType: 'blob' })
}

export const getStatisticsAccessPeriodRetentionDownload = async (data: I_getStatisticsGameUserPeriodDownloadProps) => {
  const url = `/epic/statistics/access/period/retention/download?startDate=${data.startDate}&endDate=${data.endDate}`
  return await axiosInstance.get(url, { responseType: 'blob' })
}

// 에픽 통계 관련
export const getStatisticsAccessYesterDay = async (data: I_getStatisticsDateProps) => {
  const uri = `/epic/statistics/access/yesterday?date=${data.date}`
  return await axiosInstance.get(uri)
}

export const getStatistcsAccessPeriod = async (data: I_getStatisticsStartEndDateProps) => {
  const uri = `/epic/statistics/access/period?startDate=${data.startDate}&endDate=${data.endDate}`
  return await axiosInstance.get(uri)
}

export const getStatistcsAccessPeriodRetention = async (data: I_getStatisticsStartEndDateProps) => {
  const uri = `/epic/statistics/access/period/retention?startDate=${data.startDate}&endDate=${data.endDate}`
  return await axiosInstance.get(uri)
}

export const getStatisticsGameUserPeriod = async (data: I_getStatisticsStartEndDateProps) => {
  const uri = `/epic/statistics/gameUser/period?startDate=${data.startDate}&endDate=${data.endDate}`
  return await axiosInstance.get(uri)
}

export const getStatisticsGameUserYesterDay = async (data: I_getStatisticsDateProps) => {
  const uri = `/epic/statistics/gameUser/yesterday?date=${data.date}`
  return await axiosInstance.get(uri)
}

export const getDashboard = async (data: I_getDashBoardProps) => {
  const uri = `/epic/dashboard?startDate=${data.startDate}&endDate=${data.endDate}`
  return await axiosInstance.get(uri)
}
