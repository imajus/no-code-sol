import { Random } from 'meteor/random';

/** @type {ConvertValueStep} */
export const convertValueStep = {
  id: Random.id(),
  type: 'convertValue',
  componentType: 'task',
  name: 'Convert value',
  properties: {
    source: {
      propertyType: 'constant',
      type: 'uint256',
      value: '',
    },
    target: '',
  },
};
