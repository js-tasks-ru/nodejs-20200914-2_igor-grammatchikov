const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subscriptions = [];

router.get('/subscribe', async (ctx, next) => {
  const getMessage = new Promise((resolve) => {
    subscriptions.push(resolve);
  });
  ctx.body = await getMessage;
});

router.post('/publish', async (ctx, next) => {
  if (ctx.request.body.message) {
    subscriptions.forEach((resolve) => {
      resolve(ctx.request.body.message);
      ctx.status = 200;
    });
  }
});
app.use(router.routes());

module.exports = app;
