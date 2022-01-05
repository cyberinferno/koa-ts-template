export interface ErrorMessage {
  message: string;
  type: string;
  context: string;
}

export type ErrorMessages = Array<ErrorMessage>

export const Response400Schema = {
  description: 'Bad Request',
  schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid request' },
        type: { type: 'string', example: 'param.invalid' },
        context: { type: 'string', example: 'name' },
      },
    },
  },
};

export const Response401Schema = {
  description: 'Unauthorized',
  schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'You do not have access this route' },
        type: { type: 'string', example: 'any.unauthorized' },
        context: { type: 'string', example: 'generic' },
      },
    },
  },
};

export const USER_INACTIVE = 0;
export const USER_ACTIVE = 1;

export const loginRequestFields = require('./loginRequestFields.json');
export const registerRequestFields = require('./registerRequestFields.json');

export const sensitiveFields = {
  user: [
    'password',
    'passwordHash',
    'password_hash',
    'auth_token',
    'confirmation_token',
    'password_reset_token',
    'profile_id',
    'profile.id',
  ],
  profile: [
    'id',
  ],
};

export const userDataResponseSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    auth_type: {
      type: 'string',
    },
    role: {
      type: 'string',
    },
    status: {
      type: 'number',
    },
    profile: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
        },
        data: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
            },
            lastName: {
              type: 'string',
            },
            middleName: {
              type: 'string',
            },
            dateOfBirth: {
              type: 'string',
            },
          }
        },
      }
    }
  },
};
