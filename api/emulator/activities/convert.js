import { createAtomActivityFromHandler } from 'sequential-workflow-machine';

function convertValue(value, type) {
  switch (type) {
    case 'uint256':
      return BigInt(value);
    case 'string':
    case 'address':
      return String(value);
    case 'boolean':
      return Boolean(value);
    default:
      throw new Error(`Unsupported target type: ${type}`);
  }
}

export const convertValueActivity = createAtomActivityFromHandler(
  'convertValue',
  /**
   *
   * @param {ConvertValueStep} step
   * @param {GlobalState} state
   */
  async (step, { $variables }) => {
    const { source, target } = step.properties;
    const value = $variables.resolve(source);
    const type = $variables.typeOf(target);
    $variables.set(target, convertValue(value, type));
  },
);
