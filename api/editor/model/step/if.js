import { Random } from 'meteor/random';

/** @type {IfStep} */
export const ifStep = {
  id: Random.id(),
  type: 'if',
  componentType: 'switch',
  name: 'If',
  properties: {
    a: 0,
    operator: '===',
    b: 0,
  },
  branches: {
    'true': [],
    'false': [],
  },
};
