import { createAtomActivityFromHandler } from 'sequential-workflow-machine';

export const logActivity = createAtomActivityFromHandler(
  'log',
  /**
   *
   * @param {LogStep} step
   * @param {GlobalState} param1
   */
  async (step, { $logger /*$variables, $dynamics */ }) => {
    const text = step.properties.message;
    $logger.log(text);
  },
);
