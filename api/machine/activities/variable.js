import { createAtomActivityFromHandler } from 'sequential-workflow-machine';

export const variableActivity = createAtomActivityFromHandler(
  'variable',
  /**
   *
   * @param {VariableStep} step
   * @param {GlobalState} state
   */
  async (step, { state }) => {
    const { name, type, defaultValue } = step.properties;
    state[name] = defaultValue; //{ value: null, type };
  },
);
