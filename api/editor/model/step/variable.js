import { Random } from 'meteor/random';

/** @type {VariableStep} */
export const variableStep = {
  id: Random.id(),
  type: 'variable',
  componentType: 'task',
  name: 'Variable',
  properties: {
    name: '',
    type: '',
    defaultValue: '',
  },
};
