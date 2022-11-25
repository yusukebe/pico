# Pico

[![Version](https://img.shields.io/npm/v/@picojs/pico.svg)](https://npmjs.com/package/@picojs/pico)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@picojs/pico)](https://bundlephobia.com/result?p=@picojs/pico)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@picojs/pico)](https://bundlephobia.com/result?p=@picojs/pico)

Pico is ultra-tiny (about 1kB) web framework using `URLPattern`.
Pico works on Cloudflare Workers and Deno.
Pico is compatible with [Hono](https://honojs.dev).

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

// create Pico instance
const app = new Pico()

// handle GET request and return TEXT response
app.get('/', (c) => c.text('Hello Pico!'))

// capture the path parameter and return JSON response
app.post('/entry/:id', (c) => {
  const id = c.req.param('id')
  return c.json({
    'your id is': id,
  })
})

// use `res` function to create Response object
app.get('/money', () => new Response('Payment required', { status: 402 }))

// capture the parameters with RegExp
app.get('/post/:date(\\d+)/:title([a-z]+)', (c) => {
  const { date, title } = c.req.param()
  return c.json({ post: { date, title } })
})

// get the query parameter
app.get('/search', (c) => {
  return c.text(`Your query is ${c.req.query('q')}`)
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
app.get('/secret', (c) => {
  console.log(c.env.TOKEN)
  return c.text('Welcome!')
})

// use executionContext for Cloudflare Workers
app.get('/log', (c) => {
  c.executionContext.waitUntil(console.log(`You access ${c.req.url.toString()}`))
  return c.text('log will be shown')
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

## Migrate to Hono

Just rewrite

```ts
import { Pico } from '@picojs/pico'

const app = new Pico()
```

To

```ts
import { Hono } from 'hono'

const app = new Hono()
```

## What's the difference from Hono?

Hono is ultra-fast, Pico is ultra-tiny.

And several things are different.

- Pico does not support all API of Hono.
- Pico does not run on anywhere. Does not run on Bun.
- Pico does not support Middleware.
- Pico's router is not so fast. Hono's routers are ultrafast.
- Pico supports TypeScript, but Hono's TypeScript experience is more rich.
- The syntax for writing routing such as RegExp one is different.

### Which should I use?

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
