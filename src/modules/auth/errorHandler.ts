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
const onFetchedRefreshTokenError = () => {
  localStorageManager.removeItem('accessToken')
  localStorageManager.removeItem('refreshToken')
}

const checkRefreshToken = (error: RestClientResponseError) => {
  return error.response.status === 403
}

const onRefreshToken = refreshTokenFactory({
  onFetchRefreshToken: () =>
    fetchRefreshToken(getRefreshToken())
      .then(onFetchedRefreshToken)
      .catch(onFetchedRefreshTokenError),
  onRefetch: (req: Request) => window.fetch(req),
})

export const responseErrorInterceptor = cond<
  RestClientResponseError,
  Promise<Response>
>([
  [checkRefreshToken, (error) => onRefreshToken(error.request)],
  [() => true, (err) => Promise.reject(err)],
])
