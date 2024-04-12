import { createLoopActivity } from 'sequential-workflow-machine';

export const loopActivity = createLoopActivity('loop', {
  loopName: (step) => `LOOP.${step.id}`,
  init: () => ({}),
  // init(step) {
  //   const { indexVariable } = step.properties;
  //   if (!step.properties.indexVariable) {
  //     throw new Error('Index variable is not defined');
  //   }
  //   return {
  //     indexVariableName: step.properties.indexVariable.name,
  //   };
  // },
  /**
   *
   * @param {LoopStep} step
   * @param {GlobalState} state
   */
  onEnter(step, { $variables }) {
    const { from, indexVariable } = step.properties;
    const startIndex = $variables.resolve(from, Number);
    $variables.set(indexVariable, startIndex);
  },
  /**
   *
   * @param {LoopStep} step
   * @param {GlobalState} state
   */
  onLeave(step, { $variables }) {
    const { indexVariable } = step.properties;
    $variables.delete(indexVariable);
  },
  /**
   *
   * @param {LoopStep} step
   * @param {GlobalState} state
   * @returns {Promise<boolean>}
   */
  async condition(step, { $variables }) {
    const { to, increment, operator, indexVariable } = step.properties;
    const end = $variables.resolve(to, Number);
    const inc = $variables.resolve(increment, Number);
    if (inc === 0) {
      throw new Error('Increment cannot be 0');
    }
    const currentIndex = $variables.get(indexVariable, Number);
    let canContinue;
    switch (operator) {
      case '<':
        canContinue = currentIndex < end;
        break;
      case '<=':
        canContinue = currentIndex <= end;
        break;
      default:
        throw new Error('Comparison is not supported');
    }
    const newIndex = currentIndex + inc;
    $variables.set(indexVariable, newIndex);
    return canContinue;
  },
});
