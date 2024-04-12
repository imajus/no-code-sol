import { createAtomActivityFromHandler } from 'sequential-workflow-machine';

export const variableActivity = createAtomActivityFromHandler(
  'variable',
  /**
   *
   * @param {VariableStep} step
   * @param {GlobalState} state
   */
  async (step, { $variables }) => {
    const { name, defaultValue } = step.properties;
    if (!$variables.isSet(name)) {
      $variables.set(name, defaultValue);
    }
  },
);
