import { createLoopActivity } from 'sequential-workflow-machine';

export const loopActivity = createLoopActivity('loop', {
  /**
   *
   * @param {LoopStep} step
   */
  loopName: (step) => `LOOP.${step.id}`,
  /**
   *
   * @param {LoopStep} step
   */
  init: (step) => {
    if (!step.properties.indexVariable) {
      throw new Error('Index variable is not defined');
    }
    return {
      indexVariableName: step.properties.indexVariable.name,
    };
  },
  /**
   *
   * @param {LoopStep} step
   * @param {GlobalState} param1
   * @param {LoopActivityState} param2
   */
  onEnter: (step, { $variables, $dynamics }, { indexVariableName }) => {
    const startIndex = $dynamics.readNumber(step.properties.from);

    $variables.set(indexVariableName, startIndex);
  },
  /**
   *
   * @param {GlobalState} _
   * @param {LoopActivityState} param1
   * @param {*} param2
   */
  onLeave: (_, { $variables }, { indexVariableName }) => {
    $variables.delete(indexVariableName);
  },
  /**
   *
   * @param {LoopStep} step
   * @param {GlobalState} param1
   * @param {LoopActivityState} param2
   * @returns
   */
  condition: async (step, { $variables, $dynamics }, { indexVariableName }) => {
    const from = $dynamics.readNumber(step.properties.to);
    const increment = $dynamics.readNumber(step.properties.increment);
    if (increment === 0) {
      throw new Error('Increment cannot be 0');
    }
    const currentIndex = $variables.read(indexVariableName);
    let canContinue;
    switch (step.properties.operator) {
      case '<':
        canContinue = currentIndex < from;
        break;
      case '<=':
        canContinue = currentIndex <= from;
        break;
      default:
        throw new Error('Comparison is not supported');
    }
    const newIndex = currentIndex + increment;
    $variables.set(indexVariableName, newIndex);
    return canContinue;
  },
});
