import {Context} from 'koa';
import {description, request, responses, responsesAll, summary, tagsAll,} from 'koa-swagger-decorator';
import {
  Response400Schema,
  Response401Schema,
  userDataResponseSchema,
} from '../constants';
import User from '../db/entities/User';
import removeSensitiveDataFromObject from '../utils/removeSensitiveDataFromObject';

@responsesAll({
  400: Response400Schema,
  401: Response401Schema,
})
@tagsAll(['User'])
export default class UserController {
  @request('get', '/user/me')
  @summary('Me route')
  @description('Get logged in user info')
  @responses({
    200: {
      description: 'Success',
      schema: userDataResponseSchema,
    }
  })
  public static async getMe(ctx: Context) {
    const {user} = ctx.state;
    const userData = await User.findOne({id: user.id}, {relations: ['profile']});
    removeSensitiveDataFromObject(userData);
    ctx.body = userData;
  }
}
