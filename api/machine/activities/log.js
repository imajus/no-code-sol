import { createAtomActivityFromHandler } from 'sequential-workflow-machine';
import { format } from '../formatter';

export const logActivity = createAtomActivityFromHandler(
  'log',
  /**
   *
   * @param {LogStep} step
   * @param {GlobalState} state
   */
  async (step, { state, $logger /*$variables, $dynamics */ }) => {
    const { message } = step.properties;
    $logger.log(format(message, state));
  },
);
