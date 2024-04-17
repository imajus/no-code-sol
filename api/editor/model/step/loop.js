import { Random } from 'meteor/random';

/** @type {LoopStep} */
export const loopStep = {
  id: Random.id(),
  type: 'loop',
  componentType: 'container',
  name: 'Loop',
  properties: {
    from: {
      propertyType: 'literal',
      type: 'uint256',
      value: '0',
    },
    operator: '<',
    to: {
      propertyType: 'literal',
      type: 'uint256',
      value: '2',
    },
    increment: {
      propertyType: 'literal',
      type: 'uint256',
      value: '1',
    },
    indexVariable: 'index',
    variables: '',
  },
  sequence: [],
};
