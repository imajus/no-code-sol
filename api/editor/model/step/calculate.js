import { Random } from 'meteor/random';

/** @type {CalculateStep} */
export const calculateStep = {
  id: Random.id(),
  type: 'calculate',
  componentType: 'task',
  name: 'Calculate',
  properties: {
    left: '',
    operator: '+',
    right: '',
    result: '',
  },
};
