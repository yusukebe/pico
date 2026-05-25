type Handler<env extends object = {}> = (
  req: Request,
  result: URLPatternURLPatternResult,
  env?: env,
  ctx?: ExecutionContext
) => Response | Promise<Response>

export interface PicoType<env extends object = {}> extends Methods<env> {
  routes: [p: URLPattern, m: string, h: Handler<env>][]
  fetch: (req: Request, env?: env, ctx?: ExecutionContext) => Response | Promise<Response>
  on: (method: string, pathname: string, handler: Handler<env>) => void
}

type Methods<env extends object> = Record<
  'all' | 'get' | 'put' | 'post' | 'delete' | 'head' | 'patch' | 'options',
  (path: string, handler: Handler<env>) => PicoType<env>
>
