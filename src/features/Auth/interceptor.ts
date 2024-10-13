import {
  isRestClientError,
  RestClientError,
  RestClientRequestError,
  RestClientResponseError,
} from '@/libs/RestClient'
import { localStorageManager } from '@/libs/storage'

export function requestInterceptor() {
  return (req: Request) => {
    const token = localStorageManager.getItem('token')
    req.headers.set('Authorization', `Bearer ${token}`)
    return Promise.resolve(req)
  }
}

export function responseInterceptor() {
  return (res: Response) => Promise.resolve(res)
}

interface ErrorInterceptorOptions {
  request?: (error: RestClientRequestError) => Promise<Response>
  response?: (error: RestClientResponseError) => Promise<Response>
  rest?: (error: RestClientError) => Promise<Response>
  other?: (error: unknown) => Promise<Response>
}

export function errorInterceptor(options: ErrorInterceptorOptions = {}) {
  const {
    request: requestFn = (error) => Promise.reject(error),
    response: responseFn = (error) => Promise.reject(error),
    rest: restClientFn = (error) => Promise.reject(error),
    other: otherFn = (error) => Promise.reject(error),
  } = options
  return (error: unknown): Promise<Response> => {
    if (isRestClientError(error)) {
      if (error.request) {
        if (error.response) {
          return responseFn(error as RestClientResponseError)
        }
        return requestFn(error as RestClientRequestError)
      }
      return restClientFn(error)
    }
    return otherFn(error)
  }
}
