import _ from 'lodash';
import User from '../db/entities/User';
import Profile from '../db/entities/Profile';
import { sensitiveFields } from '../constants';

export default function removeSensitiveDataFromObject(input: any) {
  if (input instanceof User) {
    sensitiveFields.user.forEach(field => {
      removeAFieldFromInput(input, field);
    });
  }

  if (input instanceof Profile) {
    sensitiveFields.profile.forEach(field => {
      removeAFieldFromInput(input, field);
    });
  }
}

function removeAFieldFromInput(input: any, field: string) {
  if (_.has(input, field)) {
    _.unset(input, field);
  } else {
    const path = field.split('.');
    if (path.length > 1) {
      _.unset(input, path);
    }
  }
}
