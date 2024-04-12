import { Random } from 'meteor/random';

/** @type {LoopStep} */
export const loopStep = {
  id: Random.id(),
  type: 'loop',
  componentType: 'container',
  name: 'Loop',
  properties: {
    from: '0',
    operator: '<',
    to: '0',
    increment: '1',
    indexVariable: 'index',
    variables: '',
  },
  sequence: [],
};
