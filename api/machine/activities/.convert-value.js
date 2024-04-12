import { createAtomActivityFromHandler } from 'sequential-workflow-machine';

export const convertValueActivity = createAtomActivityFromHandler(
  'convertValue',
  /**
   *
   * @param {ConvertValueStep} step
   * @param {GlobalState} state
   */
  async (step, { $variables }) => {
    if (!step.properties.source) {
      throw new Error('Source variable is required');
    }
    if (!step.properties.target) {
      throw new Error('Target variable is required');
    }
    const value = $variables.get(step.properties.source.name);
    let convertedValue;
    switch (step.properties.target.type) {
      case 'number':
        convertedValue = Number(value);
        break;
      case 'string':
        convertedValue = String(value);
        break;
      default:
        throw new Error(
          `Unsupported target type: ${step.properties.target.type}`,
        );
    }
    $variables.set(step.properties.target.name, convertedValue);
  },
);
