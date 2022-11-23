import { Pico } from './pico'

export type Handler = (context: Context) => Response | string | object
export type Context = {
  request: Request
} & URLPatternURLPatternResult
export const METHODS = ['get', 'post', 'put', 'delete', 'head', 'options', 'patch'] as const

export function defineDynamicClass(): {
  new (): {
    [K in typeof METHODS[number]]: (path: string, handler: Handler) => Pico
  }
} {
  return class {} as never
}
