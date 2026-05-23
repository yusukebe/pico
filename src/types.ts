type Handler = (c: C) => Response | Promise<Response>

interface C {
  req: Request
  env: {}
  ctx: ExecutionContext
  result: URLPatternURLPatternResult
}

export interface PicoType extends Methods {
  routes: { p: URLPattern; m: string; h: Handler }[]
  fetch: (req: Request, env?: {}, ctx?: ExecutionContext) => Response | Promise<Response>
  on: (method: string, path: string, handler: Handler) => void
}

type Methods = Record<
  'all' | 'get' | 'put' | 'post' | 'delete' | 'head' | 'patch' | 'options',
  (path: string, handler: Handler) => PicoType
>
