import {
  FunctionKind,
  FunctionVisibility,
  FunctionStateMutability,
  ModifierInvocation,
} from 'solc-typed-ast';
import { AbstractStepResolver } from './abstract';

export class FunctionsStepResolver extends AbstractStepResolver {
  /**
   *
   * @param {FunctionsStep} step
   * @param {ContractDefinition} parent
   */
  resolve(step, index, parent) {
    for (const [name, sequence] of Object.entries(step.branches)) {
      const node = this.factory.makeFunctionDefinition(
        undefined,
        FunctionKind.Function,
        name,
        false,
        FunctionVisibility.Public,
        FunctionStateMutability.NonPayable,
        false,
        // parameters
        this.factory.makeParameterList([]),
        // return parameters
        this.factory.makeParameterList([]),
        // modifiers?
        [],
        undefined,
        this.factory.makeBlock([]),
      );
      parent.appendChild(node);
      this.tree.set(sequence, node);
    }
  }
}
