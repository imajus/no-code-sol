import { branchName, createForkActivity } from 'sequential-workflow-machine';

export const functionsActivity = createForkActivity('functions', {
  init: () => ({}),
  /**
   *
   * @param {FunctionsStep} step
   * @param {GlobalState} state
   * @returns {Promise<BranchNameResult>}
   */
  async handler(step, { state }) {
    return branchName(state.func);
  },
});
