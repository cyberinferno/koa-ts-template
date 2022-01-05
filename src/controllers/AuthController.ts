import { Context } from 'koa';
import {
  description,
  request,
  summary,
  tagsAll,
  responses,
  responsesAll,
  body,
} from 'koa-swagger-decorator';
import bcryptJs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {v4 as uuidv4} from 'uuid';
import {validate} from 'class-validator';
import {
  loginRequestFields,
  Response400Schema,
  USER_ACTIVE,
  registerRequestFields,
} from '../constants';
import User from '../db/entities/User';
import config from '../config';
import validateUserInput from '../utils/validateUserInput';
import Profile from '../db/entities/Profile';

@responsesAll({
  400: Response400Schema,
})
@tagsAll(['Auth'])
export default class AuthController {
  @request('post', '/auth/login')
  @summary('Login route')
  @description('User login')
  @body({
    email: {
      type: 'string',
      required: true,
    },
    password: {
      type: 'string',
      required: true,
    },
  })
  @responses({
    200: {
      description: 'Success',
      schema: { type: 'object', properties: { token: { type: 'string'}}}
    }
  })
  public static async userLogin(ctx: Context) {
    const errors = validateUserInput(loginRequestFields, ctx.request.body);
    if (errors) {
      ctx.status = 400;
      ctx.body = errors;
      return;
    }

    const { email, password } = ctx.request.body;
    const user = await User.findOne({ email, status: USER_ACTIVE });
    if (!user) {
      ctx.status = 400;
      ctx.body = [{
        message: 'Invalid email or password',
        type: 'field.invalid',
        context: 'email',
      }];
      return;
    }

    const isPasswordValid = await bcryptJs.compare(password, user.password_hash);
    if (!isPasswordValid) {
      ctx.status = 400;
      ctx.body = [{
        message: 'Invalid email or password',
        type: 'field.invalid',
        context: 'email',
      }];
      return;
    }

    const token = jwt.sign({ id: user.id }, config.jwt.secret);
    ctx.body = { token };
  }

  @request('post', '/auth/register')
  @summary('Register route')
  @description('User register')
  @body({
    salutation: {
      type: 'string',
      required: true,
    },
    firstName: {
      type: 'string',
      required: true,
    },
    lastName: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      required: true,
    },
    password: {
      type: 'string',
      required: true,
    },
  })
  @responses({
    200: {
      description: 'Success',
      schema: { type: 'object', properties: { message: { type: 'string'}}}
    }
  })
  public static async userRegister(ctx: Context) {
    const errors = validateUserInput(registerRequestFields, ctx.request.body);
    if (errors) {
      ctx.status = 400;
      ctx.body = errors;
      return;
    }

    const {
      email,
      password,
      firstName,
      lastName,
      salutation,
    } = ctx.request.body;
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      ctx.status = 400;
      ctx.body = [{
        message: 'User with this email already exists',
        type: 'field.duplicate',
        context: 'email',
      }];
      return;
    }

    const user = new User();
    user.email = email;
    user.password_hash = await bcryptJs.hash(password, 10);
    user.auth_token = uuidv4();
    user.confirmation_token = uuidv4();
    user.status = USER_ACTIVE;
    const errorsValidate = await validate(user, { skipMissingProperties: true });
    if (errorsValidate.length > 0) {
      ctx.status = 400;
      ctx.body = [{
        message: 'Could not register user',
        type: 'any.validationFailed',
        context: 'generic',
      }];
      return;
    }

    try {
      await user.save();
      const profile = new Profile();
      profile.data = {
        firstName,
        lastName,
        salutation,
        dateOfBirth: '',
        middleName: '',
      };
      profile.username = email;
      await profile.save();
      user.profile_id = profile.id;
      await user.save();
      ctx.body = {
        message: 'User registered successfully',
      };
    } catch (e) {
      console.error(e);
      ctx.status = 400;
      ctx.body = [{
        message: 'Could not register user',
        type: 'any.savingFailed',
        context: 'generic',
      }];
    }
  }
}
