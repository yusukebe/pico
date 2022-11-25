import type { Handler } from './types'

const METHODS = ['all', 'get', 'post', 'put', 'delete', 'head'] as const
function defineDynamicClass(): {
  new (): {
    [K in typeof METHODS[number]]: (path: string, handler: Handler) => Pico
  }
} {
  return class {} as never
}

export class Pico extends defineDynamicClass() {
  private r: {
    pattern: URLPattern
    method: string
    handler: Handler
  }[] = []
  constructor() {
    super()
    ;[...METHODS].map((method) => {
      this[method] = (path: string, handler: Handler) => this.on(method, path, handler)
    })
  }

  on = (method: string, path: string, handler: Handler) => {
    const route = {
      pattern: new URLPattern({
        pathname: path,
      }),
      method: method.toLowerCase(),
      handler,
    }
    this.r.push(route)
    return this
  }

  private match(
    method: string,
    url: string
  ): { handler: Handler; result: URLPatternURLPatternResult } {
    method = method.toLowerCase()
    for (const route of this.r) {
      const match = route.pattern.exec(url)
      if ((match && route.method === 'all') || (match && route.method === method)) {
        return { handler: route.handler, result: match }
      }
    }
  }

  fetch = (req: Request, env?: object, executionContext?: ExecutionContext) => {
    const match = this.match(req.method, req.url)
    if (match === undefined) return new Response('Not Found', { status: 404 })

    Request.prototype.param = function (this: Request, key?: string) {
      const groups = match.result.pathname.groups
      if (key) return groups[key]
      return groups
    } as InstanceType<typeof Request>['param']
    req.query = (key) => new URLSearchParams(match.result.search.input).get(key)
    req.header = (key) => req.headers.get(key)

    const response = match.handler({
      req,
      env,
      executionContext,
      text: (text) => new Response(text),
      json: (json) =>
        new Response(JSON.stringify(json), {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
    })
    return response
  }
}
