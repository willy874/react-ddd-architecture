import { instanceOfByTag } from './utils'

interface RestClientErrorOptions {
  error: Error
  request?: Request
  response?: Response
}

export function isRestClientError(value: unknown): value is RestClientError {
  return value instanceof Error && instanceOfByTag('RestClientError', value)
}

export class RestClientError extends Error {
  constructor(options: RestClientErrorOptions) {
    super(options.error.message)
    this.stack = options.error.stack
    this.name = 'RestClientError'
  }
}
