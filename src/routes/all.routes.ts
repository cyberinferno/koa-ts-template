import { SwaggerRouter } from 'koa-swagger-decorator';

const router = new SwaggerRouter();

// Swagger endpoint
router.swagger({
  title: 'koa-ts-template',
  description: 'API REST using NodeJS and KOA framework, typescript. TypeORM for SQL with class-validators. Middlewares JWT and CORS.',
  version: require('../../package.json').version
});

// Loads all routes from controllers directory
router.mapDir(__dirname + '/../controllers');

export default router;
