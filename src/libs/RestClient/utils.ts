export function isObject(value: unknown): value is object & {} {
  return value !== null && typeof value === 'object'
}

export function toString(value: unknown): string {
  return Object.prototype.toString.call(value)
}

export function toStringTag(value: object): string {
  return toString(value).slice(8, -1)
}

export function instanceOfByTag(tag: string, value: object): boolean {
  let instance = Object.getPrototypeOf(value)
  let isInstanceOf = toStringTag(instance) === tag
  while (!isInstanceOf && instance !== null) {
    instance = Object.getPrototypeOf(instance)
    isInstanceOf = toStringTag(instance) === tag
  }
  return isInstanceOf
}

export function httpErrorHandler(response: Response): Error {
  switch (response.status) {
    case 400:
      return new Error('Bad Request.')
    case 401:
      return new Error('Unauthorized.')
    case 403:
      return new Error('Forbidden.')
    case 404:
      return new Error('Not Found.')
    case 405:
      return new Error('Method Not Allowed.')
    case 406:
      return new Error('Not Acceptable.')
    case 408:
      return new Error('Request Timeout.')
    case 409:
      return new Error('Conflict.')
    case 410:
      return new Error('Gone.')
    case 429:
      return new Error('Too Many Requests.')
    case 500:
      return new Error('Internal Server Error.')
    case 501:
      return new Error('Not Implemented.')
    case 502:
      return new Error('Bad Gateway.')
    case 503:
      return new Error('Service Unavailable.')
    case 504:
      return new Error('Gateway Timeout.')
    case 505:
      return new Error('HTTP Version Not Supported.')
    case 511:
      return new Error('Network Authentication Required.')
    case 520:
      return new Error('Web Server Returned an Unknown Error.')
    case 521:
      return new Error('Web Server Is Down.')
    case 522:
      return new Error('Connection Timed Out.')
    case 523:
      return new Error('Origin Is Unreachable.')
    case 524:
      return new Error('A Timeout Occurred.')
    case 525:
      return new Error('SSL Handshake Failed.')
    case 526:
      return new Error('Invalid SSL Certificate.')
    case 527:
      return new Error('Railgun Error.')
    case 530:
      return new Error('Origin DNS Error.')
    case 598:
      return new Error('Network Read Timeout Error.')
    case 599:
      return new Error('Network Connect Timeout Error.')
    default:
      return new Error(response.statusText)
  }
}
