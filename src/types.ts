export type Handler = (c: C) => Response | Promise<Response>

declare global {
  interface Env {}
}

export type C = {
  req: Request
  env: Env
  executionContext: ExecutionContext
  result: URLPatternURLPatternResult
}

export type Route = {
  p: URLPattern
  m: string
  h: Handler
}

export type Fetch = (
  req: Request,
  env?: Env,
  executionContext?: ExecutionContext
) => Response | Promise<Response>

export type PicoType = {
  routes: Route[]
  fetch: Fetch
  on: (method: string, path: string, handler: Handler) => void
} & Methods

type MethodHandler = (path: string, handler: Handler) => PicoType

type Methods = {
  all: MethodHandler
  get: MethodHandler
  put: MethodHandler
  post: MethodHandler
  delete: MethodHandler
  head: MethodHandler
  patch: MethodHandler
  option: MethodHandler
}
