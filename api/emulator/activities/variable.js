import { createAtomActivityFromHandler } from 'sequential-workflow-machine';

export const variableActivity = createAtomActivityFromHandler(
  'variable',
  /**
   *
   * @param {VariableStep} step
   * @param {GlobalState} state
   */
  async (step, { $variables }) => {
    const { name, type, defaultValue } = step.properties;
    $variables.define(name, type.value);
    if (!$variables.isSet(name)) {
      $variables.set(name, defaultValue);
    }
  },
);
