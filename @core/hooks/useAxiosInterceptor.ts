import axios from 'api/http'
import { AxiosHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useEffect } from 'react'

import { useRecoilState } from 'recoil'
import { alertModalRecoil, loaderModalRecoil } from 'recoil/atom'

const useAxiosInterceptor = () => {
  const [, setAlertModalState] = useRecoilState(alertModalRecoil)
  const [, setLoaderState] = useRecoilState(loaderModalRecoil)

  const requestHandler = (request: InternalAxiosRequestConfig<any>) => {
    request.headers.set('Authorization', window.sessionStorage.getItem('Authorization'))
    setLoaderState({ isOpen: true })
    return request
  }

  const responseHandler = async (response: AxiosResponse<any, any>) => {
    // response setting
    const header = response.headers
    if (header instanceof AxiosHeaders) {
      if (header.has('Authorization')) window.sessionStorage.setItem('Authorization', header.get('Authorization')?.toString() ?? '')
      if (header.has('Refreshtoken')) window.sessionStorage.setItem('Refresh', header.get('Refreshtoken')?.toString() ?? '')
    }
    if (['E40101'].find((code) => code === response.data?.status?.code)) {
      const newConfig = response.config
      newConfig.headers.set('Refresh', window.sessionStorage.getItem('Refresh'))
      return await axios.request(newConfig)

      // setAlertModalState({
      //   alertText: '로그인 만료되었습니다. 재로그인 후 이용 가능합니다.',
      //   isOpen: true,
      //   clickButtonCallback: () => {
      //     window.sessionStorage.clear()
      //     window.location.href = '/login'
      //   },
      // })
    }
    if (['E40103'].find((code) => code === response.data?.status?.code)) {
      setAlertModalState({
        alertText: '로그인 만료되었습니다. 재로그인 후 이용 가능합니다.',
        isOpen: true,
        clickButtonCallback: () => {
          window.sessionStorage.clear()
          window.location.href = '/login'
        },
      })
    }
    if (['E40306'].find((code) => code === response.data?.status?.code)) {
      setAlertModalState({
        alertText: response.data.status.message,
        isOpen: true,
        clickButtonCallback: () => {
          window.sessionStorage.clear()
          window.location.href = '/login'
        },
      })
    }
    if (['E40007'].find((code) => code === response.data?.status?.code)) {
      setAlertModalState({
        alertText: '로그인이 필요한 서비스입니다.',
        isOpen: true,
        clickButtonCallback: () => {
          window.sessionStorage.clear()
          window.location.href = '/login'
        },
      })
    }

    setLoaderState({ isOpen: false })
    return response
  }

  const errorHandler = (error: any) => {
    if (error.response) {
      setAlertModalState({
        alertText: error.response.data.status.message,
        isOpen: true,
        clickButtonCallback: () => {
          return false
        },
      })
      setLoaderState({ isOpen: false })
      return error.response
    }
    setLoaderState({ isOpen: false })
    return error
  }
  const requestInterceptor = axios.interceptors.request.use((request) => requestHandler(request))
  const responseInterceptor = axios.interceptors.response.use(
    async (response) => await responseHandler(response),
    (error) => errorHandler(error),
  )
  useEffect(() => {
    return () => {
      axios.interceptors.request.eject(requestInterceptor)
      axios.interceptors.response.eject(responseInterceptor)
    }
  }, [requestInterceptor, responseInterceptor])
}

export default useAxiosInterceptor
