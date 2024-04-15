import { createAtomActivityFromHandler } from 'sequential-workflow-machine';

export const argumentActivity = createAtomActivityFromHandler(
  'argument',
  /**
   *
   * @param {ArgumentStep} step
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
