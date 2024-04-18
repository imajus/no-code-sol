import {
  DataLocation,
  StateVariableVisibility,
  Mutability,
} from 'solc-typed-ast';
import { AbstractStepResolver } from './abstract';

export class ReturnStepResolver extends AbstractStepResolver {
  /**
   * @param {ReturnStep} step
   * @param {FunctionDefinition} parent
   */
  resolve(step, index, parent) {
    const result = this.dynamic(step.properties.result);
    const returnType = this.factory.makeVariableDeclaration(
      undefined,
      undefined,
      undefined, // name
      undefined,
      false,
      DataLocation.Default,
      StateVariableVisibility.Internal,
      Mutability.Mutable,
      undefined,
      undefined,
      this.resolveType(step.properties.type.value),
    );
    const returnNode = this.factory.makeReturn(1, result);
    parent.vReturnParameters.appendChild(returnType);
    parent.vBody.appendChild(returnNode);
  }
}
