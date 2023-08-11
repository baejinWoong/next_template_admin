import axiosInstance from './http'
import { I_getDashBoardProps } from './type/dashBoardInterface'

export const getDashBoard = async (data: I_getDashBoardProps) => {
  const uri = `/integration/dashboard?startDate=${data.startDate}&endDate=${data.endDate}`
  return await axiosInstance.get(uri)
}
