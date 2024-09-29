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

  private errorInterceptor(context: RestClientContext, error: unknown) {
    return this.interceptor.error.reduce(
      (acc, interceptor) => {
        if (acc instanceof Error) {
          return acc.catch((error) => {
            const restClientError = new RestClientError({
              error,
              ...context,
            })
            return interceptor(restClientError)
          })
        }
        return acc.catch((error) => interceptor(error))
      },
      Promise.reject(error) as Promise<Response>,
    )
  }

  private errorHandler(request: Request, response: Response) {
    return new RestClientError({
      error: httpErrorHandler(response),
      response,
      request,
    })
  }

  send(body?: BodyInit): Promise<Response> {
    const context: RestClientContext = {
      request: undefined,
      response: undefined,
    }
    return Promise.resolve()
      .then(() => {
        return this.requestInterceptor(context, this.build({ body }))
      })
      .then((req) => fetch(req))
      .then((response) => {
        if (!response.ok) {
          context.response = response
          return Promise.reject(
            this.errorHandler(context.request!, context.response),
          )
        }
        return this.responseInterceptor(context, response)
      })
      .catch((error) => {
        return this.errorInterceptor(context, error)
      })
  }

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
