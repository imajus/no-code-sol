import { createAtomActivityFromHandler } from 'sequential-workflow-machine';

export const logActivity = createAtomActivityFromHandler(
  'log',
  async (step, { $logger /*$variables, $dynamics */ }) => {
    const text = step.properties.message;
    $logger.log(text);
  },
);
