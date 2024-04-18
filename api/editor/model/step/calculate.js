import { Random } from 'meteor/random';

/** @type {CalculateStep} */
export const calculateStep = {
  id: Random.id(),
  type: 'calculate',
  componentType: 'task',
  name: 'Calculate',
  properties: {
    left: {
      propertyType: 'literal',
      type: 'uint256',
      value: '',
    },
    operator: {
      propertyType: 'string',
      value: '+',
      options: {
        '+': 'addition (+)',
        '-': 'subtraction (-)',
        '*': 'multiplication (*)',
        '/': 'division (/)',
        '%': 'remainder (%)',
      },
    },
    right: {
      propertyType: 'literal',
      type: 'uint256',
      value: '',
    },
    result: {
      propertyType: 'variable',
      name: '',
    },
  },
};
