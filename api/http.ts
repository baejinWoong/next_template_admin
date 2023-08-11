import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL, // url = base url + request url
  // timeout: 1000 * 30, //30 sec
  withCredentials: true, // send cookies when cross-domain requests,
})

export default axiosInstance
