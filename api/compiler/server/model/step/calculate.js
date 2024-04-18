import { AbstractStepResolver } from './abstract';

export class CalculateStepResolver extends AbstractStepResolver {
  /**
   * @param {CalculateStep} step
   * @param {FunctionDefinition} parent
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
    parent.vBody.appendChild(expression);
  }
}
