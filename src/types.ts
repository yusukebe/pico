export type Handler = (context: Context) => Response | string | object
export type Context = {
  request: Request
} & URLPatternURLPatternResult
