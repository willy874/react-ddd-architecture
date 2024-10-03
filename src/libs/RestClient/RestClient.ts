import { RestClientError } from './RestClientError'
import { httpErrorHandler, instanceOfByTag, isObject } from './utils'

type URLSearchParamsInit =
  | string[][]
  | Record<string, string>
  | string
  | URLSearchParams

interface RestClientOptions {
  body?: BodyInit | null
  headers?: HeadersInit
  method?: string
  signal?: AbortSignal | null
}

interface Interceptor {
  request: ((request: Request) => Promise<Request>)[]
  response: ((response: Response) => Promise<Response>)[]
  error: ((error: unknown) => Promise<Response>)[]
}

interface IRestClient {
  options: RestClientOptions
  url: string
  interceptor: Interceptor
}

export function isRestClient(value: unknown): value is IRestClient {
  return isObject(value) && instanceOfByTag('RestClient', value)
}

const DEFAULT_OPTIONS: RestClientOptions = {
  body: null,
  headers: {},
  method: 'GET',
  signal: null,
}

type RestClientContext = {
  request?: Request
  response?: Response
}

export class RestClient implements IRestClient {
  options: RestClientOptions
  url: string
  interceptor: Interceptor = {
    request: [],
    response: [],
    error: [],
  }

  get [Symbol.toStringTag]() {
    return 'RestClient'
  }

  constructor(options?: RestClientOptions | RestClient) {
    this.url = '/'
    this.options = { ...DEFAULT_OPTIONS }
    if (isRestClient(options)) {
      const restClient = options
      this.options = { ...DEFAULT_OPTIONS, ...restClient.options }
      this.url = restClient.url
      this.interceptor = {
        request: [...restClient.interceptor.request],
        response: [...restClient.interceptor.response],
        error: [...restClient.interceptor.error],
      }
      return
    }
    if (isObject(options)) {
      this.options = { ...DEFAULT_OPTIONS, ...options }
      return
    }
  }

  method(method: string): RestClient {
    const rc = new RestClient(this)
    rc.options.method = method
    return rc
  }

  signal(signal: AbortSignal | null): RestClient {
    const rc = new RestClient(this)
    rc.options.signal = signal
    return rc
  }

  headers(headers: HeadersInit): RestClient {
    const rc = new RestClient(this)
    rc.options.headers = headers
    return rc
  }

  body(body: BodyInit | null): RestClient {
    const rc = new RestClient(this)
    rc.options.body = body
    return rc
  }

  setUrl(value: string): RestClient {
    const rc = new RestClient(this)
    const url = new URL(value, rc.url)
    rc.url = url.toString().replace(location.origin, '')
    return rc
  }

  searchParams(params: URLSearchParamsInit): RestClient {
    const rc = new RestClient(this)
    const url = new URL(rc.url, location.origin)
    const searchParams = new URLSearchParams(params)
    url.search = searchParams.toString()
    rc.url = url.toString().replace(location.origin, '')
    return rc
  }

  private build(options: RestClientOptions = {}): Request {
    return new Request(this.url, { ...this.options, ...options })
  }

  addRequestInterceptor(interceptor: (request: Request) => Promise<Request>) {
    const rc = new RestClient(this)
    rc.interceptor.request.push(interceptor)
    return rc
  }

  addResponseInterceptor(
    interceptor: (response: Response) => Promise<Response>,
  ) {
    const rc = new RestClient(this)
    rc.interceptor.response.push(interceptor)
    return rc
  }

  addErrorInterceptor(interceptor: (error: unknown) => Promise<Response>) {
    const rc = new RestClient(this)
    rc.interceptor.error.push(interceptor)
    return rc
  }

  private requestInterceptor(context: RestClientContext, request: Request) {
    context.request = request
    return this.interceptor.request.reduce((acc, interceptor) => {
      return acc.then(interceptor).then((req) => {
        context.request = req
        return Promise.resolve(req)
      })
    }, Promise.resolve(context.request))
  }

  private responseInterceptor(context: RestClientContext, response: Response) {
    context.response = response
    return this.interceptor.response.reduce((acc, interceptor) => {
      return acc.then(interceptor).then((res) => {
        context.response = res
        return Promise.resolve(res)
      })
    }, Promise.resolve(context.response))
  }

  private async resolveResponse(response?: Response) {
    if (!response) {
      return undefined
    }
    const contentType = response.headers.get('Content-Type') || ''
    if (contentType.includes('application/json')) {
      return RestClient.json(response)
    }
    if (contentType.includes('application/octet-stream')) {
      return RestClient.blob(response)
    }
    return RestClient.text(response)
  }

  private async errorHandler(
    error: unknown,
    request?: Request,
    response?: Response,
  ) {
    if (error instanceof Error) {
      return new RestClientError({
        error: response ? httpErrorHandler(response) : error,
        response,
        request,
        data: this.resolveResponse(response),
      })
    }
    return error
  }

  private errorInterceptor(context: RestClientContext, error: unknown) {
    return this.interceptor.error.reduce(
      (acc, interceptor) => {
        if (acc instanceof Error) {
          return acc.catch((error) => {
            const restClientError = this.errorHandler(
              error,
              context.request,
              context.response,
            )
            return interceptor(restClientError)
          })
        }
        return acc.catch((error) => interceptor(error))
      },
      Promise.reject(error) as Promise<Response>,
    )
  }

  send(body?: BodyInit): Promise<Response> {
    const context: RestClientContext = {
      request: undefined,
      response: undefined,
    }
    let tryError = 0
    const requestHandler = (): Promise<Request> => {
      return this.requestInterceptor(context, this.build({ body }))
    }
    const responseHandler = (response: Response): Promise<Response> => {
      if (!response.ok) {
        context.response = response
        return Promise.reject(
          this.errorHandler(null, context.request, context.response),
        )
      }
      return this.responseInterceptor(context, response).catch(errorHandler)
    }
    const errorHandler = (error: unknown): Promise<Response> => {
      tryError++
      if (tryError > RestClient.TRY_ERROR_COUNT) {
        return Promise.reject(error)
      }
      return this.errorInterceptor(context, error).then(responseHandler)
    }
    return Promise.resolve()
      .then(requestHandler)
      .then(fetch)
      .then(responseHandler)
  }

  static REST_CLIENT_ERROR = 'RestClientError'
  static TRY_ERROR_COUNT = 3

  static json<T>(response: Response): Promise<T> {
    return response.json()
  }

  static text(response: Response): Promise<string> {
    return response.text()
  }

  static blob(response: Response): Promise<Blob> {
    return response.blob()
  }
}
