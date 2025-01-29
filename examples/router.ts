import { createRouter } from '@litemw/router';
import Koa from 'koa';

const router = createRouter('/api');

router
  .get('/endpoint')
  .use((ctx) => {
    console.log(`Store some data to state ctx.origin: ${ctx.origin}`);
    return { origin: ctx.origin };
  })
  .use((ctx) => {
    const ip = new Promise((resolve) => {
      setTimeout(() => resolve(ctx.ip), 1000);
    });
    console.log('Store async data');
    return { ip };
  })
  .use(async (ctx) => {
    const ip = await ctx.state.ip;
    console.log(`Await state prop: host = ${ip}`);
    return { ipAwaited: ip };
  })
  .use((ctx) => {
    console.log('Response building');
    ctx.body = { origin: ctx.state.origin, ip: ctx.state.ipAwaited };
  });

const port = 3000;

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
