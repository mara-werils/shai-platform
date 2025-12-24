import { refreshAccessTokenOrRelogin } from '../refresh-token'
import { basePath } from '@/utils/var'
import { getBaseOptions } from '../fetch'
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from '@/config'
import Cookies from 'js-cookie'

const TIME_OUT = 100000

// Shai API requests with auth using cookies
export const shaiFetch = async (url: string, options: RequestInit = {}, isRetry = false): Promise<Response> => {
  const baseOptions = getBaseOptions()
  const headers = new Headers(baseOptions.headers)
  
  if (options.body instanceof FormData) {
    headers.delete('Content-Type')
  }
  
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        if (key.toLowerCase() === 'content-type' && options.body instanceof FormData) {
          return
        }
        headers.set(key, value)
      })
    } else {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (key.toLowerCase() === 'content-type' && options.body instanceof FormData) {
          return
        }
        headers.set(key, String(value))
      })
    }
  }
  
  headers.set(CSRF_HEADER_NAME, Cookies.get(CSRF_COOKIE_NAME()) || '')
  
  const response = await fetch(url, {
    ...baseOptions,
    ...options,
    headers,
    credentials: 'include',
    mode: 'cors',
  })
  
  if (response.status === 401 && !isRetry) {
    try {
      await refreshAccessTokenOrRelogin(TIME_OUT)
      return shaiFetch(url, options, true)
    } catch {
      globalThis.location.href = `${globalThis.location.origin}${basePath}/signin`
      return Promise.reject(response)
    }
  }
  
  return response
}

// POST with FormData
export const shaiFetchFormData = async (url: string, formData: FormData, options: RequestInit = {}): Promise<Response> => {
  const headers = options.headers ? new Headers(options.headers) : new Headers()
  headers.delete('Content-Type')
  
  return shaiFetch(url, { ...options, method: 'POST', body: formData, headers })
}
