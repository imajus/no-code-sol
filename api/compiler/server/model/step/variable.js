import {
  DataLocation,
  StateVariableVisibility,
  Mutability,
} from 'solc-typed-ast';
import { AbstractStepResolver } from './abstract';

export class VariableStepResolver extends AbstractStepResolver {
  /**
   * @param {VariableStep} step
   * @param {ContractDefinition | FunctionDefinition} parent
   */
  resolve(step, index, parent) {
    const node = this.factory.makeVariableDeclaration(
      false,
      false,
      step.properties.name,
      undefined,
      true,
      DataLocation.Default,
      StateVariableVisibility.Internal,
      Mutability.Mutable,
      step.properties.type.value,
      undefined,
      this.resolveType(step.properties.type.value),
    );
    if ('appendChild' in parent) {
      parent.appendChild(node);
    } else if ('vBody' in parent) {
      parent.vBody.appendChild(node);
    } else {
      throw new Error('Not implemented');
    }
  }
}
