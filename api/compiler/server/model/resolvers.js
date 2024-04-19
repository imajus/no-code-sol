import { ArgumentStepResolver } from './step/argument';
import { CalculateStepResolver } from './step/calculate';
import { FunctionsStepResolver } from './step/functions';
// import {
//   mappingGetValueStepResolver,
//   mappingSetValueStepResolver,
// } from './step/mapping';
import { IfStepResolver } from './step/if';
import { ReturnStepResolver } from './step/return';
import { VariableStepResolver } from './step/variable';

export { rootResolver } from './root';

/**
 * @type {Map<string, TClass<StepResolver>>}
 */
export const resolvers = new Map();
resolvers.set('functions', FunctionsStepResolver);
resolvers.set('argument', ArgumentStepResolver);
// resolvers.set('mappingGetValue', mappingGetValueStepResolver);
// resolvers.set('mappingSetValue', mappingSetValueStepResolver);
resolvers.set('calculate', CalculateStepResolver);
resolvers.set('if', IfStepResolver);
resolvers.set('return', ReturnStepResolver);
resolvers.set('variable', VariableStepResolver);
