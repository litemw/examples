import { createRouter } from '@litemw/router';
import Koa from 'koa';
import { useBody, useParam, useQuery, validatePipe } from '@litemw/middlewares';
import bodyParser from 'koa-bodyparser';
import { exploreApi, useApiInfo } from '@litemw/openapi';
import { koaSwagger } from 'koa2-swagger-ui';
import { z } from 'zod';

const bodySchema = z.object({
  name: z.string(),
  age: z.number(),
  status: z.boolean(),
});

const router = createRouter('/api/:ver')
  .use(useParam('ver'))
  .use(
    useApiInfo({
      title: 'Openapi example',
      version: '1.0',
      description: 'Some description',
    }),
  );

router
  .get('/endpoint')
  .use(useQuery('query'))
  .use((ctx) => {
    console.log(`Version ${ctx.state.ver}, query: ${ctx.state.query}`);
    ctx.body = { ver: ctx.state.ver, query: ctx.state.query };
  });

router
  .post('/endpoint')
  .use(useBody(validatePipe(bodySchema)))
  .use((ctx) => {
    console.log(`Version ${ctx.state.ver}, body: ${ctx.state.body}`);
    ctx.body = ctx.state.body;
  });

const port = 3000;

const app = new Koa();
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

const spec = exploreApi(router);

app.use(
  koaSwagger({
    swaggerOptions: { spec: spec as Record<string, any> },
    routePrefix: '/docs',
  }),
);

app.listen(port, () => {
  console.log(`Listening on ${port}`);
  console.log(`Swagger on http://localhost:${port}/docs`);
});
