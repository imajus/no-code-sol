import { createAtomActivityFromHandler } from 'sequential-workflow-machine';

/**
 *
 * @param {number} a
 * @param {number} b
 * @param {string} operator
 * @returns {number}
 */
function calculate(a, b, operator) {
  switch (operator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return a / b;
    case '%':
      return a % b;
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
}

export const calculateActivity = createAtomActivityFromHandler(
  'calculate',
  /**
   *
   * @param {CalculateStep} step
   * @param {GlobalState} state
   */
  async (step, { $variables }) => {
    const { left, right, operator, result } = step.properties;
    if (!result) {
      throw new Error('Result variable is not defined');
    }
    const a = $variables.resolve(left, BigInt);
    const b = $variables.resolve(right, BigInt);
    $variables.set(result, String(calculate(a, b, operator)));
  },
);
