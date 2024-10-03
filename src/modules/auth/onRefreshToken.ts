interface RefreshTokenInfo<Req, Res> {
  request: Req
  resolve: (value: Res) => void
  reject: (error: unknown) => void
}

interface RefreshTokenOptions<Req, Res> {
  onFetchRefreshToken: () => Promise<void>
  onRefetch: (req: Req) => Promise<Res>
}

export function refreshTokenFactory<Req, Res>(
  options: RefreshTokenOptions<Req, Res>,
): (request: Req) => Promise<Res> {
  const { onFetchRefreshToken, onRefetch } = options
  const context = {
    refreshTokenRequestQueue: [] as RefreshTokenInfo<Req, Res>[],
    isRefreshing: false,
  }
  return (request: Req) => {
    if (!context.isRefreshing) {
      onFetchRefreshToken()
        .then(() => {
          context.refreshTokenRequestQueue.forEach((info) => {
            onRefetch(info.request).then(info.resolve).catch(info.reject)
          })
        })
        .catch((err) => {
          context.refreshTokenRequestQueue.forEach((info) => info.reject(err))
        })
        .finally(() => {
          context.isRefreshing = false
          context.refreshTokenRequestQueue = []
        })
      context.isRefreshing = true
    }
    return new Promise<Res>((resolve, reject) => {
      context.refreshTokenRequestQueue.push({ request, resolve, reject })
    })
  }
}
