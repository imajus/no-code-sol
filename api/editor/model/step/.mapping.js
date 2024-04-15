import { Random } from 'meteor/random';

/** @type {MappingGetValueStep} */
export const mappingGetValueStep = {
  id: Random.id(),
  type: 'mappingGetValue',
  componentType: 'task',
  name: 'Get mapping value',
  properties: {
    mapping: '',
    key: '',
    result: '',
  },
};

/** @type {MappingSetValueStep} */
export const mappingSetValueStep = {
  id: Random.id(),
  type: 'mappingSetValue',
  componentType: 'task',
  name: 'Set mapping value',
  properties: {
    mapping: '',
    key: '',
    value: '',
  },
};
