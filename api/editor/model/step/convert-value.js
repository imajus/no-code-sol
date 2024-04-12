import { Random } from 'meteor/random';

/** @type {ConvertValueStep} */
export const convertValueStep = {
  id: Random.id(),
  type: 'convertValue',
  componentType: 'task',
  name: 'Convert value',
  properties: {
    source: 'string',
    target: 'string',
  },
};
