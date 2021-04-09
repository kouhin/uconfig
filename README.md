# uconfig

A Next.js/Nuxt.js-like universal runtime configuration

## Server Side

1. Set config

``` javascript
import { initConfig } from 'uconfig';

initConfig({
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: 'secret',
    secondSecret: process.env.SECOND_SECRET, // Pass through env variables
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: '/static',
  },
});
```

2. Use config

``` javascript
import { getConfig } from 'uconfig';

const config = getConfig();

// Will only be available on the server-side
console.log(config.mySecret)
// Will be available on both server-side and client-side
console.log(config.staticFolder)
```

3. Generate HTML

``` javascript
// Make sure config is already set by initConfig

import Koa from 'koa';
import { serializePublicRuntimeConfig } from 'uconfig';

const app = new Koa();

app.use(async ctx => {
  const serializedConfig = serializePublicRuntimeConfig();
  ctx.body = `
  <html>
    <head>
      <title>My Page</title>
    </head>
    <body>
      <script>${serializedConfig}</script>
      <script src="client.js" />
    </body>
  </html>
  `;
});
```

## Client Side

``` javascript
import { getConfig } from 'uconfig';

const config = getConfig();

// Will be available on client-side
console.log(config.staticFolder);
```

## Q&A

### How to change default key for serialized config

The default key is `__INIT_UCONFIG__`, you can use webpack/rollup DefinePlugin to replace this value.

## LICENSE

MIT
