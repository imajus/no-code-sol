import { AbstractStepResolver } from './abstract';

export class IfStepResolver extends AbstractStepResolver {
  /**
   * @param {IfStep} step
   * @param {FunctionDefinition} parent
   */
  resolve(step, index, parent) {
    const left = this.dynamic(step.properties.left);
    const right = this.dynamic(step.properties.right);
    const condition = this.factory.makeBinaryOperation(
      undefined,
      step.properties.operator.value,
      left,
      right,
    );
    const leftBlock = this.factory.makeBlock([]);
    const rightBlock = this.factory.makeBlock([]);
    const ifNode = this.factory.makeIfStatement(
      condition,
      leftBlock,
      rightBlock,
    );
    parent.vBody.appendChild(ifNode);
    this.tree.set(step.branches['true'], leftBlock);
    this.tree.set(step.branches['false'], rightBlock);
  }
}
