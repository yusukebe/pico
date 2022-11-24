# Pico

[![Version](https://img.shields.io/npm/v/@picojs/pico.svg)](https://npmjs.com/package/@picojs/pico)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@picojs/pico)](https://bundlephobia.com/result?p=@picojs/pico)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@picojs/pico)](https://bundlephobia.com/result?p=@picojs/pico)

Pico is ultra-tiny web framework using `URLPattern`.
Pico works on Cloudflare Workers and Deno.

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
app.post('/entry/:id', ({ params }) => {
  const { id } = params
  return {
    'your id is': id,
  }
})

// capture the parameters with RegExp
app.get('/post/:date(\\d+)/:title([a-z]+)', ({ params }) => {
  const { date, title } = params
  return { post: { date, title } }
})

// get the query parameter
app.get('/search', ({ url }) => {
  return `Your query is ${url.searchParams.get('q')}`
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

// get environment variables for Cloudflare Workers
app.get('/secret', ({ env }) => {
  console.log(env.TOKEN)
  return 'Welcome!'
})

// use executionContext for Cloudflare Workers
app.get('/log', ({ executionContext, url }) => {
  executionContext.waitUntil(console.log(`You access ${url.toString()}`))
  return 'log will shown'
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

## Deno

```ts
import { serve } from 'https://deno.land/std/http/server.ts'
import { Pico } from 'https://esm.sh/@picojs/pico'

const app = new Pico()
app.get('/', () => 'Hi Deno!')

serve(app.fetch)
```

```
deno run --allow-net pico.ts
```

## Q&A

> What's the difference from Hono?

Hono is ultra-fast, Pico is ultra-tiny.

> Which should I use?

In most cases, it is better to use Hono.
Hono is not so fat. The minified bundle size is about 15kB.
Hono has all things what you can do.
So, if you have an application that just returns Response object,
or if you really need to reduce the file size, you can use Pico.

## Related projects

- Hono <https://honojs.dev>

## Author

Yusuke Wada <https://github.com/yusukebe>

## License

MIT
