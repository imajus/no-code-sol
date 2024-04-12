import { Random } from 'meteor/random';

/** @type {IfStep} */
export const ifStep = {
  id: Random.id(),
  type: 'if',
  componentType: 'switch',
  name: 'If',
  properties: {
    left: '0',
    operator: '===',
    right: '0',
  },
  branches: {
    'true': [],
    'false': [],
  },
};
