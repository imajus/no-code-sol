import { Random } from 'meteor/random';

/** @type {IfStep} */
export const ifStep = {
  id: Random.id(),
  type: 'if',
  componentType: 'switch',
  name: 'If',
  properties: {
    left: {
      propertyType: 'literal',
      type: 'boolean',
      value: 'true',
    },
    operator: {
      propertyType: 'string',
      value: '===',
      options: {
        '==': 'equal (==)',
        '!=': 'unequal (!=)',
        '>=': 'greater or equal (>=)',
        '<=': 'less or equal (<=)',
        '>': 'greater (>)',
        '<': 'less (<)',
      },
    },
    right: {
      propertyType: 'literal',
      type: 'boolean',
      value: 'true',
    },
  },
  branches: {
    'true': [],
    'false': [],
  },
};
