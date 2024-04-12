import { Random } from 'meteor/random';

/** @type {ReturnStep} */
export const returnStep = {
  id: Random.id(),
  type: 'return',
  componentType: 'task',
  name: 'Return',
  properties: {
    result: '',
  },
};
