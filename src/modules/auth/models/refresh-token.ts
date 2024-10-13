import { z } from 'zod'
import { createHttpResultSchema } from '@/libs/apis'

const RefreshTokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})
export type RefreshTokenInfo = z.infer<typeof RefreshTokenSchema>

export const RefreshTokenRequestDTOSchema = z.object({
  refreshToken: z.string(),
})

export type RefreshTokenRequestDTO = z.infer<
  typeof RefreshTokenRequestDTOSchema
>

export const RefreshTokenResponseDTOSchema =
  createHttpResultSchema(RefreshTokenSchema)

export type RefreshTokenResponseDTO = z.infer<
  typeof RefreshTokenResponseDTOSchema
>
