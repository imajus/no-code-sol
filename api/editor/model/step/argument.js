import { Random } from 'meteor/random';

/** @type {ArgumentStep} */
export const argumentStep = {
  id: Random.id(),
  type: 'argument',
  componentType: 'task',
  name: 'Argument',
  properties: {
    name: '',
    type: 'string',
    defaultValue: '',
  },
};
