import { createAtomActivityFromHandler } from 'sequential-workflow-machine';

export const argumentActivity = createAtomActivityFromHandler(
  'argument',
  /**
   *
   * @param {ArgumentStep} step
   * @param {GlobalState} state
   */
  async (step, { $variables }) => {
    const { name, defaultValue } = step.properties;
    if (!$variables.isSet(name)) {
      $variables.set(name, defaultValue);
    }
  },
);
