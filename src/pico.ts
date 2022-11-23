import { METHODS, Handler, defineDynamicClass } from './types'

class Pico extends defineDynamicClass() {
  routes: {
    pattern: URLPattern
    method: string
    handler: Handler
  }[] = []
  constructor() {
    super()
    ;[...METHODS].map((method) => {
      this[method] = (path: string, handler: Handler) => {
        const route = {
          pattern: new URLPattern({
            pathname: path,
          }),
          method: method.toLocaleUpperCase(),
          handler,
        }
        this.routes.push(route)
        return this
      }
    })
  }

  match(method: string, url: string): { handler: Handler; result: URLPatternURLPatternResult } {
    method = method.toUpperCase()
    for (const route of this.routes) {
      if (route.pattern.test(url) && route.method === method) {
        return { handler: route.handler, result: route.pattern.exec(url) }
      }
    }
  }

  notFound = () => new Response('Not Found', { status: 404 })

  fetch(request: Request) {
    const match = this.match(request.method, request.url)
    if (match === undefined) return this.notFound()
    const response = match.handler({ request, ...match.result })
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
