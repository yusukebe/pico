export type Handler = (context: Context) => Response | Promise<Response>
export interface Context {
  req: Request
  env: Record<string, any>
  executionContext: ExecutionContext
  text: (text: string) => Response
  json: (json: object) => Response
}

declare global {
  interface Request {
    param: {
      (key: string): string
      (): Record<string, string>
    }
    query: {
      (key: string): string
    }
    header: {
      (name: string): string
    }
  }
}
