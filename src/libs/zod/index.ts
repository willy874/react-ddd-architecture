import { z } from 'zod'

const errorMessageMap: Record<
  string,
  (issue: z.ZodIssueOptionalMessage) => string
> = {}

z.setErrorMap((issue, ctx) => {
  if (issue.code === z.ZodIssueCode.custom) {
    const key = issue.message || ''
    return {
      message: errorMessageMap[key]?.(issue) || ctx.defaultError,
    }
  }
  return { message: ctx.defaultError }
})

export const setErrorMessageByKey = (
  key: string,
  message: string | ((issue: z.ZodIssueOptionalMessage) => string),
) => {
  if (typeof message === 'string') {
    errorMessageMap[key] = () => message
  }
  if (typeof message === 'function') {
    errorMessageMap[key] = message
  }
}
