import {
  DataLocation,
  StateVariableVisibility,
  Mutability,
} from 'solc-typed-ast';
import { AbstractStepResolver } from './abstract';

export class ArgumentStepResolver extends AbstractStepResolver {
  /**
   * @param {ArgumentStep} step
   * @param {FunctionDefinition} parent
   */
  resolve(step, index, parent) {
    const node = this.factory.makeVariableDeclaration(
      false,
      false,
      'recipient',
      undefined,
      false,
      DataLocation.Default,
      StateVariableVisibility.Internal,
      Mutability.Mutable,
      undefined,
      undefined,
      this.resolveType(step.properties.type.value),
    );
    parent.vParameters.appendChild(node);
  }
}
