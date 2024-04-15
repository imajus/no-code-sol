import { ArgumentStepResolver } from './step/argument';
import { CalculateStepResolver } from './step/calculate';
import { FunctionsStepResolver } from './step/functions';
// import {
//   mappingGetValueStepResolver,
//   mappingSetValueStepResolver,
// } from './step/mapping';
import { ReturnStepResolver } from './step/return';
import { VariableStepResolver } from './step/variable';

export { rootResolver } from './root';

export const resolvers = new Map([
  ['functions', FunctionsStepResolver],
  ['argument', ArgumentStepResolver],
  // ['mappingGetValue', mappingGetValueStepResolver],
  // ['mappingSetValue', mappingSetValueStepResolver],
  ['calculate', CalculateStepResolver],
  ['return', ReturnStepResolver],
  ['variable', VariableStepResolver],
]);
