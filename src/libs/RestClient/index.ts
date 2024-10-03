import type { RestClientError } from './RestClientError'

export { RestClient, isRestClient } from './RestClient'
export { RestClientError, isRestClientError } from './RestClientError'

type RequiredProperties<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<any, any>,
  K extends keyof T,
> = Required<Pick<T, K>> & Omit<T, K>

export type RestClientResponseError = RequiredProperties<
  RestClientError,
  'request' | 'response'
>

export type RestClientRequestError = RequiredProperties<
  RestClientError,
  'request'
>
