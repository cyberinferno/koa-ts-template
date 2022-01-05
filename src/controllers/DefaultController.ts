import { Context } from 'koa';
import { description, request, summary, tagsAll, responses } from 'koa-swagger-decorator';

@tagsAll(['Default'])
export default class DefaultController {
  @request('get', '/')
  @summary('Version route')
  @description('Get version info of API')
  @responses({
    200: {
      description: 'Success',
      schema: { type: 'object', properties: { version: { type: 'string'}}}
    }
  })
  public static async getVersion(ctx: Context) {
    const version = require('../../package.json').version;
    ctx.body = { version };
  }
}
