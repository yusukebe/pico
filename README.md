# Pico

[![install size](https://packagephobia.com/badge?p=@picojs/pico)](https://packagephobia.com/result?p=@picojs/pico)

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

## Write your code

```ts
// index.ts
import { Pico } from '@picojs/pico'

const app = new Pico()

app.get('/', () => 'Hello Pico!')
app.get('/entry/:id', ({ pathname }) => {
  const { id } = pathname.groups
  return {
    'your id is': id,
  }
})

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

## Q&A

> What's the difference from Hono?

Hono is ultra-fast, Pico is ultra-tiny.

## Related projects

- Hono <https://honojs.dev>

## Author

Yusuke Wada <https://github.com/yusukebe>

## License

MIT
