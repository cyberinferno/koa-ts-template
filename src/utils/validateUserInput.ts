import {ErrorMessage} from '../constants';
import _ from 'lodash';
import validateStringData from './validateStringData';

export default function validateUserInput(fieldConfig: any, input: any) : Array<ErrorMessage | unknown> | null {
  const inputClone = _.cloneDeep(input);
  const errors = [];
  for (let i = 0; i < fieldConfig.length; i++) {
    const rules = _.get(fieldConfig[i], 'rules', []);
    const {name} = fieldConfig[i];
    if (!name) continue;
    for (let j = 0; j < rules.length; j++) {
      const {validationType} = rules[j];
      if (validationType !== 'required' && !_.get(inputClone, name)) continue;
      const error = validateStringData(
        rules[j],
        _.get(inputClone, name),
        name,
      );
      if (!_.isEmpty(error)) errors.push(error);
    }
  }

  return errors.length > 0 ? errors : null;
}
