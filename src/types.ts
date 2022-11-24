export type Handler = (context: Context) => Response | string | object
export interface Context {
  request: Request
  env: Record<string, any>
  executionContext: ExecutionContext
  params: Record<string, string>
  get url(): URL
}
