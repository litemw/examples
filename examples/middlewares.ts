import { createRouter } from '@litemw/router';
import Koa from 'koa';
import { useBody, useParam, useQuery } from '@litemw/middlewares';
import bodyParser from 'koa-bodyparser';

const router = createRouter('/api/:ver').use(useParam('ver'));

router
  .get('/endpoint')
  .use(useQuery('query'))
  .use((ctx) => {
    console.log(`Version ${ctx.state.ver}, query: ${ctx.state.query}`);
    ctx.body = { ver: ctx.state.ver, query: ctx.state.query };
  });

router
  .post('/endpoint')
  .use(useBody())
  .use((ctx) => {
    console.log(`Version ${ctx.state.ver}, body: ${ctx.state.body}`);
    ctx.body = ctx.state.body;
  });

const port = 3000;

const app = new Koa();
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
