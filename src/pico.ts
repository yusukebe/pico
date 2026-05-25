import type { PicoType } from './types'

export const Pico = <env extends object>(): PicoType<env> =>
  new Proxy(
    {
      routes: [],
      fetch(req, env, ctx) {
        for (const [pattern, method, handler] of this.routes) {
          const result = (method === 'ALL' || method === req.method) && pattern.exec(req.url)
          if (result) return handler(req, result, env, ctx)
        }
      },
      on(method, pathname, handler) {
        this.routes.push([new URLPattern({ pathname }), method.toUpperCase(), handler])
      },
    } as Pick<PicoType<env>, 'routes' | 'fetch' | 'on'> as PicoType<env>,
    // @ts-expect-error
    { get: (t, p, s) => t[p] || ((...a) => (t.on(p, ...a), s)) }
  )
