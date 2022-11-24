import type { Handler } from './types'

const METHODS = ['all', 'get', 'post', 'put', 'delete', 'head'] as const
function defineDynamicClass(): {
  new (): {
    [K in typeof METHODS[number]]: (path: string, handler: Handler) => Pico
  }
} {
  return class {} as never
}

class Pico extends defineDynamicClass() {
  routes: {
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

  on(method: string, path: string, handler: Handler) {
    const route = {
      pattern: new URLPattern({
        pathname: path,
      }),
      method: method.toLowerCase(),
      handler,
    }
    this.routes.push(route)
    return this
  }

  match(method: string, url: string): { handler: Handler; result: URLPatternURLPatternResult } {
    method = method.toLowerCase()
    for (const route of this.routes) {
      const match = route.pattern.exec(url)
      if ((match && route.method === 'all') || (match && route.method === method)) {
        return { handler: route.handler, result: match }
      }
    }
  }

  notFound = () => new Response('Not Found', { status: 404 })

  fetch = (request: Request, env?: object, executionContext?: ExecutionContext) => {
    const match = this.match(request.method, request.url)
    if (match === undefined) return this.notFound()
    const response = match.handler({
      request,
      params: match.result.pathname.groups,
      url: new URL(request.url),
      env,
      executionContext,
    })
    if (response instanceof Response) return response
    if (typeof response === 'string') {
      return new Response(response, {
        headers: {
          'Content-Type': 'text/plain; charset="utf-8"',
        },
      })
    } else if (typeof response === 'object') {
      return new Response(JSON.stringify(response), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
    return response
  }
}

export { Pico }
