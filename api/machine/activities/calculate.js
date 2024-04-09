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
  async (step, { $variables, $dynamics }) => {
    if (!step.properties.result) {
      throw new Error('Result variable is not defined');
    }
    const a = $dynamics.readNumber(step.properties.a);
    const b = $dynamics.readNumber(step.properties.b);
    const result = calculate(a, b, step.properties.operator);
    $variables.set(step.properties.result.name, result);
  },
);
