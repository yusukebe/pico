import type { PicoType, Route, Fetch, Handler } from './types'

export const Pico = (): PicoType => {
  const routes: Route[] = []
  const f: {
    fetch: Fetch
    on: (method: string, path: string, handler: Handler) => void
  } = {
    fetch: (req, env, executionContext) => {
      const m = req.method
      for (let i = 0, len = routes.length; i < len; i++) {
        const route = routes[i]
        const result = route.p.exec(req.url)
        if ((result && route.m === 'ALL') || (result && route.m === m))
          return route.h({
            req,
            env,
            executionContext,
            result,
          })
      }
    },
    on: (method, path, handler) => {
      routes.push({
        p: new URLPattern({
          pathname: path,
        }),
        m: method.toUpperCase(),
        h: handler,
      })
    },
  }
  const p = new Proxy({} as PicoType, {
    get:
      (_, prop: string, receiver) =>
      (...args: unknown[]) => {
        if (prop === 'fetch' || prop === 'on') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return f[prop](...args)
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        f['on'](prop, ...args)
        return receiver
      },
  })

  return p as PicoType
}
