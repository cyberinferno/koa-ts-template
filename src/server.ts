import Koa from 'koa';
import jwt from 'koa-jwt';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import 'reflect-metadata';
import config from './config';
import defaultRoutes from './routes/default.routes';
import allRoutes from './routes/all.routes';
import { createDbConnection } from './utils/connection';

if (process.env.NODE_ENV !== 'test') {
  // Automatically create database connection if not in test environment
  createDbConnection();
}

const app = new Koa();
app.use(cors());
app.use(bodyParser());

// Custom HTTP status handling
app.use(async (ctx, next) => {
  try {
    await next();
    const status = ctx.status || 404;
    if (status === 404) {
      ctx.throw(404);
    }
  } catch (err) {
    ctx.status = err.status || 500;
    if (ctx.status === 404) {
      ctx.response.body = [
        {
          message: 'Route not found',
          type: 'any.routeNotFound',
          context: 'generic',
        },
      ];
    } else if (ctx.status === 401) {
      ctx.response.body = [
        {
          message: 'You are not authorized to access this route',
          type: 'any.routeNoAccess',
          context: 'generic',
        },
      ];
    } else {
      ctx.response.body = [
        {
          message: 'Internal server error',
          type: 'any.internalServerError',
          context: 'generic',
        },
      ];
      ctx.app.emit('error', err, ctx);
    }
  }
});

app.use(defaultRoutes.routes());
app.use(jwt({ secret: config.jwt.secret }).unless({ path: [/^\/auth/, /^\/swagger-/] }));
app.use(allRoutes.routes()).use(allRoutes.allowedMethods());

// If NODE_ENV is test then generate random port
const port = process.env.NODE_ENV === 'test' ? 0 : config.port;
const server = app.listen(port, () => {
  console.info(`Server started on port ${port}`);
});

export default server;
