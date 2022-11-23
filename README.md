# Pico

[![size](https://badgen.net/bundlephobia/min/@picojs/pico)](https://bundlephobia.com/package/@picojs/pico) [![size](https://badgen.net/bundlephobia/minzip/@picojs/pico)](https://bundlephobia.com/package/@picojs/pico)

Pico is ultra-tiny web framework for Web-Standard runtime.
Pico works on Cloudflare Workers, Deno, Bun, and others.

## Install

```
npm i @picojs/pico
// Or
yarn add @picojs/pico
```

Install `@cloudflare/workers-types` for supporting the types.

```
npm i -D @cloudflare/workers-types
// Or
yarn add -D @cloudflare/workers-types
```

## Example

```ts
// index.ts
import { Pico } from '@picojs/pico'

// create Pico instance
const app = new Pico()

// handle GET request and return TEXT response
app.get('/', () => 'Hello Pico!')

// capture the path parameter and return JSON response
app.post('/entry/:id', ({ pathname }) => {
  const { id } = pathname.groups
  return {
    'your id is': id,
  }
})

// get the query parameter
app.get('/search', ({ search }) => {
  const params = new URLSearchParams(search.input)
  return `Your query is ${params.get('q')}`
})

// handle the PURGE method and return Redirect response
app.on('PURGE', '/cache', () => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
    },
  })
})

// return custom 404 response
app.all('*', () => new Response('Custom 404', { status: 404 })

// export app for Cloudflare Workers
export default app
```

## Develop with Wrangler

```
wrangler dev index.ts
```

## Deploy to Cloudflare Workers

```
wrangler publish index.ts
```

## Bun

Now, Pico does not work on Bun because URLPattern may not be implemented yet.

## Deno

```ts
import { serve } from 'https://deno.land/std/http/server.ts'
import { Pico } from 'https://esm.sh/@picojs/pico'

const app = new Pico()
app.get('/', () => 'Hi Deno!')

serve(app.fetch)
```

```
deno run -A pico.ts
```

## Q&A

> What's the difference from Hono?

Hono is ultra-fast, Pico is ultra-tiny.

## Related projects

- Hono <https://honojs.dev>

## Author

Yusuke Wada <https://github.com/yusukebe>

## License

MIT
