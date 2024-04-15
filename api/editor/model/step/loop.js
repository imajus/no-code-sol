import { Random } from 'meteor/random';

/** @type {LoopStep} */
export const loopStep = {
  id: Random.id(),
  type: 'loop',
  componentType: 'container',
  name: 'Loop',
  properties: {
    from: {
      propertyType: 'constant',
      type: 'uint256',
      value: '0',
    },
    operator: '<',
    to: {
      propertyType: 'constant',
      type: 'uint256',
      value: '2',
    },
    increment: {
      propertyType: 'constant',
      type: 'uint256',
      value: '1',
    },
    indexVariable: 'index',
    variables: '',
  },
  sequence: [],
};
