import { createAtomActivityFromHandler } from 'sequential-workflow-machine';

export const mappingGetValueActivity = createAtomActivityFromHandler(
  'mappingGetValue',
  /**
   *
   * @param {MappingGetValueStep} step
   * @param {GlobalState} state
   */
  async (step, { $variables }) => {
    const mapping = $variables.get(step.properties.mapping) ?? {};
    const key = $variables.resolve(step.properties.key);
    if (!key) {
      throw new Error('Key is empty');
    }
    $variables.set(step.properties.result, mapping[key]);
  },
);

export const mappingSetValueActivity = createAtomActivityFromHandler(
  'mappingSetValue',
  /**
   *
   * @param {MappingSetValueStep} step
   * @param {GlobalState} state
   */
  async (step, { $variables }) => {
    const mapping = $variables.get(step.properties.mapping) ?? {};
    const key = $variables.resolve(step.properties.key);
    if (!key) {
      throw new Error('Key is empty');
    }
    mapping[key] = $variables.resolve(step.properties.value);
  },
);
