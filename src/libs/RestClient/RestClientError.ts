import { instanceOfByTag } from './utils'

interface RestClientErrorOptions<T = unknown> {
  error: Error
  request?: Request
  response?: Response
  data: T
}

export function isRestClientError(value: unknown): value is RestClientError {
  return value instanceof Error && instanceOfByTag('RestClientError', value)
}

export class RestClientError<T = unknown> extends Error {
  request?: Request
  response?: Response
  data: T
  constructor(options: RestClientErrorOptions<T>) {
    super(options.error.message)
    this.stack = options.error.stack
    this.name = 'RestClientError'
    this.request = options.request
    this.response = options.response
    this.data = options.data
  }
}
