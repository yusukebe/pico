# Pico

[![Version](https://img.shields.io/npm/v/@picojs/pico.svg)](https://npmjs.com/package/@picojs/pico)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@picojs/pico)](https://bundlephobia.com/result?p=@picojs/pico)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@picojs/pico)](https://bundlephobia.com/result?p=@picojs/pico)

Pico is an ultra-tiny (~400 bytes) router using `URLPattern`.
Pico works on Cloudflare Workers and Deno.

**This project is still experimental. The API might be changed.**

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

// create a router object, `new` is not needed
const router = Pico()

// handle a GET request and return a TEXT response
router.get('/', (c) => new Response('Hello Pico!'))

// capture path parameters and return a JSON response
router.post('/entry/:id', ({ result }) => {
  const { id } = result.pathname.groups
  return Response.json({
    'your id is': id,
  })
})

// return a primitive Response object
router.get('/money', () => new Response('Payment required', { status: 402 }))

// capture path parameters with RegExp
router.get('/post/:date(\\d+)/:title([a-z]+)', ({ result }) => {
  const { date, title } = result.pathname.groups
  return Response.json({ post: { date, title } })
})

// get query parameters
router.get('/search', ({ result }) => {
  const query = new URLSearchParams(result.search.input).get('q')
  return new Response(`Your query is ${query}`)
})

// handle a PURGE method and return a Redirect response
router.on('PURGE', '/cache', () => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
    },
  })
})

// get environment variables for Cloudflare Workers
router.get('/secret', ({ env }) => {
  console.log(env.TOKEN)
  return new Response('Welcome!')
})

// use an executionContext for Cloudflare Workers
router.get('/log', ({ executionContext, req }) => {
  executionContext.waitUntil((async () => console.log(`You access ${req.url.toString()}`))())
  return new Response('log will be shown')
})

// return a custom 404 response
router.all('*', () => new Response('Custom 404', { status: 404 }))

// export the app for Cloudflare Workers
export default router
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

const router = Pico()
router.get('/', () => new Response('Hi Deno!'))

serve(app.fetch)
```

```
deno run --allow-net pico.ts
```

## Related projects

- Hono <https://hono.dev>
- itty-router <https://github.com/kwhitley/itty-router>

## Author

Yusuke Wada <https://github.com/yusukebe>

## License

MIT
