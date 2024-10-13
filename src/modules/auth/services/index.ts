import { createAuthFetcher, createFetcher } from '@/libs/apis'
import { RestClient } from '@/libs/RestClient'
import {
  RefreshTokenRequestDTOSchema,
  RefreshTokenResponseDTOSchema,
  UserResponseDTOSchema,
} from '../models'
import type { RefreshTokenRequestDTO } from '../models'

export const fetchRefreshToken = (body: RefreshTokenRequestDTO) =>
  createFetcher()
    .method('POST')
    .setUrl('/refresh-token')
    .send(JSON.stringify(RefreshTokenRequestDTOSchema.parse(body)))
    .then(RestClient.json)
    .then(RefreshTokenResponseDTOSchema.parse)

export const fetchUser = () =>
  createAuthFetcher()
    .method('GET')
    .setUrl('/user')
    .send()
    .then(RestClient.json)
    .then(UserResponseDTOSchema.parse)
