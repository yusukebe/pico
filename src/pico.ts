import type { Handler, PicoType } from './types'

export const Pico: () => PicoType = (routes: [URLPattern, string, Handler][] = []) =>
  new Proxy(
    {
      fetch: (req, env, ctx) => {
        // `req.method` is a native getter: read it once per request, not once per route
        const method = req.method
        let result
        for (const route of routes)
          if ((route[1] == 'ALL' || route[1] == method) && (result = route[0].exec(req.url)))
            return route[2]({ req, env, ctx, result })
      },
      on: (method, pathname, handler) => {
        routes.push([new URLPattern({ pathname }), method.toUpperCase(), handler])
      },
    } as PicoType,
    {
      // `fetch` and `on` are returned as-is; any other property is an HTTP method
      get: (target, prop: keyof PicoType, receiver) =>
        target[prop] || ((...args: [string, Handler]) => (target.on(prop, ...args), receiver)),
    }
  )
