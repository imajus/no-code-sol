import { createAtomActivityFromHandler } from 'sequential-workflow-machine';

export const logActivity = createAtomActivityFromHandler(
  'log',
  /**
   *
   * @param {LogStep} step
   * @param {GlobalState} state
   */
  async (step, { $variables, $logger }) => {
    const { message } = step.properties;
    $logger.log($variables.format(message));
  },
);
