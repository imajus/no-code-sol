import { branchName, createForkActivity } from 'sequential-workflow-machine';

/**
 *
 * @param {*} a
 * @param {*} b
 * @param {string} operator
 * @returns {boolean}
 */
function compare(a, b, operator) {
  switch (operator) {
    case '==':
      // eslint-disable-next-line eqeqeq
      return a == b;
    case '===':
      return a === b;
    case '!=':
      // eslint-disable-next-line eqeqeq
      return a != b;
    case '!==':
      return a !== b;
    case '>':
      return a > b;
    case '>=':
      return a >= b;
    case '<':
      return a < b;
    case '<=':
      return a <= b;
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
}

export const ifActivity = createForkActivity('if', {
  init: () => ({}),
  /**
   *
   * @param {IfStep} step
   * @param {GlobalState} state
   * @returns {Promise<BranchNameResult>}
   */
  async handler(step, { $variables }) {
    const { left, right, operator } = step.properties;
    const a = $variables.resolve(left);
    const b = $variables.resolve(right);
    const result = compare(a, b, operator);
    return branchName(result ? 'true' : 'false');
  },
});
