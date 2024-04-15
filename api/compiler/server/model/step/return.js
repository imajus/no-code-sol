import { AbstractStepResolver } from './abstract';

export class ReturnStepResolver extends AbstractStepResolver {
  /**
   * @param {ReturnStep} step
   * @param {FunctionDefinition} parent
   */
  resolve(step, index, parent) {
    const result = this.dynamic(step.properties.result);
    const returnNode = this.factory.makeReturn(1, result);
    parent.vBody.appendChild(returnNode);
  }
}
