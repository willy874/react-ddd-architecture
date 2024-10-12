import cond from 'lodash/cond'
import { RestClientResponseError } from '@/libs/RestClient'
import { localStorageManager } from '@/libs/storage'
import {
  fetchRefreshToken,
  RefreshTokenRequestDTO,
  RefreshTokenResponseDTO,
} from './services'
import { refreshTokenFactory } from './onRefreshToken'

const getRefreshToken = (): RefreshTokenRequestDTO => {
  const refreshToken = localStorageManager.getItem('refreshToken')
  if (refreshToken) {
    return {
      refreshToken,
    }
  }
  throw new Error('No refresh token')
}
const onFetchedRefreshToken = (data: RefreshTokenResponseDTO) => {
  localStorageManager.setItem('accessToken', data.accessToken)
  localStorageManager.setItem('refreshToken', data.refreshToken)
}
const onFetchedRefreshTokenError = (error: unknown) => {
  localStorageManager.removeItem('accessToken')
  localStorageManager.removeItem('refreshToken')
  return Promise.reject(error)
}

const checkRefreshToken = (error: RestClientResponseError) => {
  return error.response.status === 403 || error.response.status === 401
}

const onRefreshToken = refreshTokenFactory({
  onFetchRefreshToken: () =>
    fetchRefreshToken(getRefreshToken())
      .then(onFetchedRefreshToken)
      .catch(onFetchedRefreshTokenError),
  onRefetch: (error: RestClientResponseError) => {
    const request = new Request(error.request)
    request.headers.set(
      'Authorization',
      `Bearer ${localStorageManager.getItem('accessToken')}`,
    )
    return window.fetch(request)
  },
})

export const responseErrorInterceptor = cond<
  RestClientResponseError,
  Promise<Response>
>([
  [checkRefreshToken, onRefreshToken],
  [() => true, (err) => Promise.reject(err)],
])
