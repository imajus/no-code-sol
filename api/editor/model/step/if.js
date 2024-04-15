import { Random } from 'meteor/random';

/** @type {IfStep} */
export const ifStep = {
  id: Random.id(),
  type: 'if',
  componentType: 'switch',
  name: 'If',
  properties: {
    left: {
      propertyType: 'constant',
      type: 'boolean',
      value: 'true',
    },
    operator: '===',
    right: {
      propertyType: 'constant',
      type: 'boolean',
      value: 'true',
    },
  },
  branches: {
    'true': [],
    'false': [],
  },
};
