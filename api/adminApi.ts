import axiosInstance from './http'
import {
  I_getMemberActionLogsExcelParams,
  I_getMemberActionLogsParams,
  I_getMemberLoginLogsExcelParams,
  I_getMemberLoginLogsParams,
  I_getMemberParams,
  I_getMultiAuthorizedUsersParams,
  I_memberDetailParams,
  I_passwordUpdateParams,
  I_postLoginParams,
  I_postMemberParams,
  I_putMemberParams,
  I_updateMultiAdminAuthParams,
} from './type/adminInterface'

// 사용자 로그인
export const postSignIn = async (data: I_postLoginParams) => {
  const uri = '/signIn'
  return await axiosInstance.post(uri, data)
}

// 사용자 로그아웃
export const postMemberLogout = async () => {
  const uri = '/logout'
  return await axiosInstance.post(uri)
}

// 전체메뉴 조회
export const getMenus = async () => {
  const uri = '/menu'
  return await axiosInstance.get(uri)
}

// 전체 사용자 리스트 조회
export const getActiveMembers = async (data: I_getMemberParams) => {
  const uri = `/members/active?${(data.keyword && `keyword=${encodeURI(data.keyword)}&`) ?? ''}page=${data.page}&pageSize=${data.pageSize}${
    (data.type && `&type=${data.type}`) ?? ''
  }${(data.status && `&status=${data.status}`) ?? ''}`
  return await axiosInstance.get(uri)
}

// 전체 사용자 리스트 조회
export const getInActiveMembers = async (data: I_getMemberParams) => {
  const uri = `/members/inactive?${(data.keyword && `keyword=${encodeURI(data.keyword)}&`) ?? ''}page=${data.page}&pageSize=${data.pageSize}${
    (data.type && `&type=${data.type}`) ?? ''
  }${(data.status && `&status=${data.status}`) ?? ''}`
  return await axiosInstance.get(uri)
}

// 사용자 상세 정보 조회
export const getMemberDetail = async (data: I_memberDetailParams) => {
  const uri = `/member/${data.seq}`
  return await axiosInstance.get(uri)
}

// 사용자 본인 정보 조회
export const getMyInfo = async () => {
  const uri = '/member/myInfo'
  return await axiosInstance.get(uri)
}

//부서 조회
export const getDepartment = async () => {
  const uri = '/department'
  return await axiosInstance.get(uri)
}

//직책 조회
export const getPosition = async () => {
  const uri = '/position'
  return await axiosInstance.get(uri)
}

//권한 목록 조회
export const getRole = async () => {
  const uri = '/role'
  return await axiosInstance.get(uri)
}

// 유저 등록
export const postMember = async (data: I_postMemberParams) => {
  const uri = '/member'
  return await axiosInstance.post(uri, data)
}

// 사용자 수정
export const putMember = async (data: I_putMemberParams) => {
  const uri = '/member'
  return await axiosInstance.put(uri, data)
}

// 사용자 차단
export const putMemberBlock = async (data: I_memberDetailParams) => {
  const uri = `/member/block/${data.seq}`
  return await axiosInstance.put(uri)
}

// 사용자 차단 해제
export const putMemberUnBlock = async (data: I_memberDetailParams) => {
  const uri = `/member/unblock/${data.seq}`
  return await axiosInstance.put(uri)
}

// 사용자 비밀번호 초기화
export const putMemberReset = async (data: I_memberDetailParams) => {
  const uri = `/member/init/${data.seq}`
  return await axiosInstance.put(uri)
}

// 사용자 비밀번호 변경
export const putMemberPassword = async (data: I_passwordUpdateParams) => {
  const uri = '/member/password'
  return await axiosInstance.put(uri, data)
}

// 사용자 삭제
export const deleteMember = async (data: I_memberDetailParams) => {
  const uri = `/member/${data.seq}`
  return await axiosInstance.delete(uri)
}

// 토큰 하트비트 체크
export const getToken = async () => {
  const uri = '/token'
  return await axiosInstance.get(uri)
}

/**
 * 전체 사용자 권한 포함 리스트 조회
 */
export const getMemberAuths = async (data: I_getMemberParams) => {
  const uri = `/auth/members?${(data.keyword && `keyword=${encodeURI(data.keyword)}&`) ?? ''}page=${data.page}&pageSize=${data.pageSize}${
    (data.type && `&type=${data.type}`) ?? ''
  }`
  return await axiosInstance.get(uri)
}

// 관리자 다수 권한 설정 첫화면 List 조회
export const getMultiAuthorizedUsers = async (data: I_getMultiAuthorizedUsersParams) => {
  const uri = `/plural/auth/members?${(data.keyword && `keyword=${encodeURI(data.keyword)}&`) ?? ''}${
    (data.lastId && `lastId=${data.lastId}&`) ?? ''
  }&pageSize=${data.pageSize}${(data.type && `&type=${data.type}`) ?? ''}`
  return await axiosInstance.get(uri)
}

// 선택된 단일 어드민의 메뉴 권한 조회
export const getAdminAuth = async (data: number) => {
  const uri = `/member/auth?seq=${data}&menuCode=all`
  return await axiosInstance.get(uri)
}

// 선택된 단일 어드민의 메뉴 권한 조회
export const updateMultiAdminAuth = async (data: I_updateMultiAdminAuthParams) => {
  const uri = `/plural/auth/members`
  return await axiosInstance.put(uri, data)
}

export const getMemberLoginLogs = async (data: I_getMemberLoginLogsParams) => {
  const uri = `/member/login/logs?page=${data.page}&pageSize=${data.pageSize}&startDate=${data.startDate}&endDate=${data.endDate}&adminFilter=${
    data.adminFilter
  }${(data.adminKeyword && `&adminKeyword=${encodeURI(data.adminKeyword)}`) ?? ''}${
    (data.departmentCode && data.departmentCode !== 'all' ? `&departmentCode=${data.departmentCode}` : '') ?? ''
  }`
  return await axiosInstance.get(uri)
}

export const getMemberActionLogs = async (data: I_getMemberActionLogsParams) => {
  const uri = `/member/activate/logs?page=${data.page}&pageSize=${data.pageSize}&startDate=${data.startDate}&endDate=${data.endDate}&adminFilter=${
    data.adminFilter
  }${(data.adminKeyword && `&adminKeyword=${encodeURI(data.adminKeyword)}`) ?? ''}&menuFilter=${data.menuFilter}${
    (data.keyword && `&keyword=${encodeURI(data.keyword)}`) ?? ''
  }`
  return await axiosInstance.get(uri)
}

export const getMemberActionLogExcelDownload = async (data: I_getMemberActionLogsExcelParams) => {
  const uri = `/member/activate/logs/download?startDate=${data.startDate}&endDate=${data.endDate}&adminFilter=${data.adminFilter}${
    (data.adminKeyword && `&adminKeyword=${encodeURI(data.adminKeyword)}`) ?? ''
  }&menuFilter=${data.menuFilter}${(data.keyword && `&keyword=${encodeURI(data.keyword)}`) ?? ''}`
  return await axiosInstance.get(uri, { responseType: 'blob' })
}

export const getMemberLoginLogExcelDownload = async (data: I_getMemberLoginLogsExcelParams) => {
  const uri = `/member/login/logs/download?startDate=${data.startDate}&endDate=${data.endDate}&adminFilter=${data.adminFilter}${
    (data.adminKeyword && `&adminKeyword=${encodeURI(data.adminKeyword)}`) ?? ''
  }${(data.departmentCode && data.departmentCode !== 'all' ? `&departmentCode=${data.departmentCode}` : '') ?? ''}`
  return await axiosInstance.get(uri, { responseType: 'blob' })
}
