import _ from 'lodash';
import validator from 'validator';
import { ErrorMessage } from '../constants';

const errorMessages = {
  'required': '{fieldName} is required',
  'range': 'Value not allowed for {fieldName}',
  'bool': '{fieldName} should be a boolean',
  'alphanumeric': '{fieldName} should be an alphanumeric string',
  'email': '{fieldName} should be a valid email address',
  'date': '{fieldName} should be a valid date',
  'alpha': '{fieldName} should be a valid string',
  'minString': '{fieldName} is too short',
  'maxString': '{fieldName} is too long',
  'integer': '{fieldName} should be a number',
  'minValue': '{fieldName} is too small',
  'maxValue': '{fieldName} is too big',
  'regex': '{fieldName} is invalid',
  'time': '{fieldName} is not a valid time',
  'phoneNumber': '{fieldName} is not a valid phone number'
};

export default function validateStringData(rule: any, data: string, fieldName: string): ErrorMessage | unknown {
  let error = {};
  const {validationType} = rule;
  if (!validationType) {
    return error;
  }

  switch (validationType) {
    case 'required':
      error = validateRequired(data, fieldName);
      break;
    case 'range':
      let {allowedValues} = rule;
      if (!_.isArray(allowedValues)) {
        allowedValues = [];
      }
      error = validateRange(data, fieldName, allowedValues);
      break;
    case 'rangeArray':
      let {allowedValues: allowedArrayValues} = rule;
      if (!_.isArray(allowedArrayValues)) {
        allowedArrayValues = [];
      }
      error = validateRangeArray(
        data,
        fieldName,
        allowedArrayValues,
      );
      break;
    case 'bool':
    case 'boolean':
      error = validateType(data, fieldName, 'bool');
      break;
    case 'alphanumeric':
      error = validateAlphanumeric(data, fieldName);
      break;
    case 'alpha':
      error = validateAlpha(data, fieldName);
      break;
    case 'minString':
      const {length: minLength} = rule;
      error = validateMinString(data, fieldName, minLength);
      break;
    case 'maxString':
      const {length: maxLength} = rule;
      error = validateMaxString(data, fieldName, maxLength);
      break;
    case 'email':
      error = validateEmail(data, fieldName);
      break;
    case 'date':
      error = validateDate(data, fieldName);
      break;
    case 'integer':
      error = validateInteger(data, fieldName);
      break;
    case 'minValue':
      const {value: minValue} = rule;
      error = validateMinValue(data, fieldName, minValue);
      break;
    case 'maxValue':
      const {value: maxValue} = rule;
      error = validateMaxValue(data, fieldName, maxValue);
      break;
    case 'regex':
      const {regex} = rule;
      error = validateRegex(data, fieldName, regex);
      break;
    case 'time':
      error = validateTime(data, fieldName);
      break;
    case 'phoneNumber':
      error = validatePhoneNumber(data, fieldName);
      break;
  }

  return error;
}

function validateRequired(data: string, fieldName: string) {
  if (
    typeof data === 'undefined' ||
    data === null ||
    data.toString().trim() === ''
  ) {
    return buildError('required', fieldName);
  }
  return {};
}

function validateRangeArray(data: string, fieldName: string, allowedValues: any) {
  if (!Array.isArray(data)) {
    return buildError('range', fieldName);
  }
  for (let i = 0; i < data.length; i++) {
    const error = validateRange(
      data[i],
      fieldName,
      allowedValues,
    );
    if (!_.isEmpty(error)) return error;
  }
  return {};
}

function validateRange(data: string, fieldName: string, allowedValues: any) {
  if (!data || allowedValues.indexOf(data) === -1) {
    return buildError('range', fieldName);
  }
  return {};
}

function validateType(data: string, fieldName: string, type: string) {
  try {
    switch (type) {
      case 'bool':
        if (typeof data === 'boolean') return {};
        if (!validator.isBoolean(data)) {
          return buildError('bool', fieldName);
        }
    }
    return {};
  } catch {
    return buildError(type, fieldName);
  }
}

function validateAlphanumeric(data: string, fieldName: string) {
  try {
    if (!validator.isAlphanumeric(data)) {
      return buildError('alphanumeric', fieldName);
    }
    return {};
  } catch {
    return buildError('alphanumeric', fieldName);
  }
}

function validateAlpha(data: string, fieldName: string) {
  try {
    const dataWithNoWhiteSpaces = data.replace(/ /g, '');
    if (!validator.isAlpha(dataWithNoWhiteSpaces)) {
      return buildError('alpha', fieldName);
    }
    return {};
  } catch {
    return buildError('alpha', fieldName);
  }
}

function validateMinString(data: string, fieldName: string, length: number) {
  try {
    if (!validator.isLength(data, {min: length})) {
      return buildError('minString', fieldName);
    }
    return {};
  } catch {
    return buildError('minString', fieldName);
  }
}

function validateMaxString(data: string, fieldName: string, length: number) {
  try {
    if (!validator.isLength(data, {max: length})) {
      return buildError('maxString', fieldName);
    }
    return {};
  } catch {
    return buildError('maxString', fieldName);
  }
}

function validateEmail(data: string, fieldName: string) {
  try {
    if (!validator.isEmail(data)) {
      return buildError('email', fieldName);
    }
    return {};
  } catch {
    return buildError('email', fieldName);
  }
}

function validateDate(data: string, fieldName: string) {
  try {
    if (!validator.isDate(data)) {
      return buildError('date', fieldName);
    }
    return {};
  } catch {
    return buildError('date', fieldName);
  }
}

function validateInteger(data: string, fieldName: string) {
  try {
    if (!(Number.isInteger(data) || validator.isInt(data))) {
      return buildError('integer', fieldName);
    }
    return {};
  } catch {
    return buildError('integer', fieldName);
  }
}

function validateMinValue(data: any, fieldName: string, minValue: string) {
  if (!data) return buildError('minValue', fieldName);
  if (typeof data !== 'number') data = Number(data);
  if (!Number.isNaN(data) && data < minValue) {
    return buildError('minValue', fieldName);
  }
  return {};
}

function validateMaxValue(data: any, fieldName: string, maxValue: string) {
  if (!data) return buildError('maxValue', fieldName);
  if (typeof data !== 'number') data = Number(data);
  if (!Number.isNaN(data) && data > maxValue) {
    return buildError('maxValue', fieldName);
  }
  return {};
}

function validateRegex(data: string, fieldName: string, regex: string) {
  if (typeof data !== 'string') {
    return buildError('regex', fieldName);
  }
  if (!data.match(regex)) return buildError('regex', fieldName);
  return {};
}

function validateTime(data: string, fieldName: string) {
  if (typeof data !== 'string') {
    return buildError('time', fieldName);
  }
  if (!data.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
    return buildError('time', fieldName);
  }
  return {};
}

function validatePhoneNumber(data: string, fieldName: string) {
  try {
    if (!validator.isMobilePhone(data)) {
      return buildError('phoneNumber', fieldName);
    }
    return {};
  } catch {
    return buildError('phoneNumber', fieldName);
  }
}

function buildError(type: string, fieldName: string) {
  return {
    message: generateErrorMessage(type, fieldName),
    type: `field.${type}`,
    context: fieldName,
  };
}

function generateErrorMessage(type: string, fieldName: string) {
  return _.get(
    errorMessages,
    type,
    'Validation failed for {fieldName}',
  ).replace('{fieldName}', fieldName);
}
