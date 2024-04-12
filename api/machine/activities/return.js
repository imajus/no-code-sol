import { createAtomActivityFromHandler } from 'sequential-workflow-machine';

export const returnActivity = createAtomActivityFromHandler(
  'return',
  /**
   *
   * @param {ReturnStep} step
   * @param {GlobalState} state
   */
  async (step, { $variables }) => {
    const { result } = step.properties;
    $variables.set('result', $variables.resolve(result));
  },
);
