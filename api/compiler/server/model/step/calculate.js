import { AbstractStepResolver } from './abstract';

export class CalculateStepResolver extends AbstractStepResolver {
  /**
   * @param {CalculateStep} step
   * @param {FunctionDefinition | Block} parent
   */
  resolve(step, index, parent) {
    const left = this.dynamic(step.properties.left);
    const right = this.dynamic(step.properties.right);
    const result = this.dynamic(step.properties.result);
    const operation = this.factory.makeBinaryOperation(
      undefined,
      step.properties.operator.value,
      left,
      right,
    );
    const assignment = this.factory.makeAssignment(
      undefined,
      '=',
      result,
      operation,
    );
    const expression = this.factory.makeExpressionStatement(assignment);
    if (`vBody` in parent) {
      parent.vBody.appendChild(expression);
    } else if (`appendChild` in parent) {
      parent.appendChild(expression);
    }
  }
}
