import { ApplicationOperator } from '@/core'
import { RestClient } from '@/libs/RestClient'

export const appOperator = new ApplicationOperator()

const createFetcher = () => appOperator.app.query('getRestClient')

export interface RefreshTokenRequestDTO {
  refreshToken: string
}

export interface RefreshTokenResponseDTO {
  accessToken: string
  refreshToken: string
}

export const fetchRefreshToken = (body: RefreshTokenRequestDTO) =>
  createFetcher()
    .method('POST')
    .setUrl('/refresh-token')
    .send(JSON.stringify(body))
    .then(RestClient.json<RefreshTokenResponseDTO>)
