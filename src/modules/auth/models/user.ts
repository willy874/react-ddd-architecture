import { createHttpResultSchema } from '@/libs/apis'
import { z } from 'zod'

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export type User = z.infer<typeof UserSchema>

export const UserResponseDTOSchema = createHttpResultSchema(UserSchema)

export type UserResponseDTO = z.infer<typeof UserResponseDTOSchema>
