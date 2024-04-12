import { Random } from 'meteor/random';

/** @type {LogStep} */
export const logStep = {
  id: Random.id(),
  type: 'log',
  componentType: 'task',
  name: 'Log',
  properties: {
    message: '',
  },
};
