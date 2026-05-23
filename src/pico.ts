import type { PicoType } from './types'

export const Pico = (): PicoType => {
  const f = {
    routes: [],
    fetch(req, env, ctx) {
      for (const route of f.routes) {
        if (route.m !== req.method && route.m !== 'ALL') continue
        const result = route.p.exec(req.url)
        if (result) return route.h({ req, env, ctx, result })
      }
    },
    on(method, pathname, handler) {
      f.routes.push({ p: new URLPattern({ pathname }), m: method.toUpperCase(), h: handler })
    },
  } as Pick<PicoType, 'routes' | 'fetch' | 'on'> as PicoType
  ;(['all', 'get', 'put', 'post', 'delete', 'head', 'patch', 'options'] as const).map(
    (m) => (f[m] = (...args) => (f.on(m, ...args), f))
  )
  return f
}
