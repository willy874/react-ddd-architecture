import { ApplicationOperator } from '@/core'
import { cond } from 'lodash'
import { z } from 'zod'

export type HttpResult<T> = {
  data: T
  message?: string
  code: number
}

const errorHandler = cond<HttpResult<unknown>, string | undefined>([
  [(res) => res.code === 401, () => 'Unauthorized'],
  [(res) => res.code === 403, () => 'Forbidden'],
  [(res) => res.code === 404, () => 'Not Found'],
  [() => true, () => undefined],
])

const BaseHttpResultSchema = z.object({
  data: z.unknown(),
  message: z.string().optional(),
  code: z.number(),
})

export const createHttpResultSchema = <T>(data: z.ZodType<T>) => {
  return z
    .object({
      ...BaseHttpResultSchema.shape,
      data,
    })
    .superRefine((val, ctx) => {
      const message = errorHandler({
        data: val.data,
        message: val.message,
        code: val.code,
      })
      if (message) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message,
        })
      }
    })
}

export const appOperator = new ApplicationOperator()

export const createFetcher = () => appOperator.app.query('getRestClient')
export const createAuthFetcher = () =>
  appOperator.app.query('getAuthRestClient')
