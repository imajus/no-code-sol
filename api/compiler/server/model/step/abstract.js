import { LiteralKind } from 'solc-typed-ast';

/**
 *
 * @param {ValueTypeName} type
 * @returns {LiteralKind}
 */
function variableTypeToLiteralKind(type) {
  switch (type) {
    case 'boolean':
      return LiteralKind.Bool;
    case 'address':
    case 'string':
      return LiteralKind.String;
    case 'uint256':
      return LiteralKind.Number;
    default:
      throw new Error(`Unsupported variable type: ${type}`);
  }
}

/**
 * @abstract
 * @implements {StepResolver}
 */
export class AbstractStepResolver {
  /**
   * @type {ASTNodeFactory}
   */
  factory;
  /**
   * @type {Map<Step[], ASTNodeWithChildren>}
   */
  tree;

  constructor(factory, tree) {
    this.factory = factory;
    this.tree = tree;
  }

  /**
   * @param {ValueTypeName} type
   * @returns {TypeName}
   */
  resolveType(type) {
    switch (type) {
      case 'mapping(address => uint256)':
        return this.factory.makeMapping(
          undefined, // type,
          this.factory.makeElementaryTypeName('address', 'address'),
          this.factory.makeElementaryTypeName('uint256', 'uint256'),
        );
      case 'address':
      case 'string':
      case 'uint256':
        return this.factory.makeElementaryTypeName(type, type);
      default:
        throw new Error(`Unsupported variable type: ${type}`);
    }
  }

  /***
   * @param {DynamicValue} input
   */
  dynamic(input) {
    switch (input.propertyType) {
      case 'variable':
        return this.factory.makeIdentifier(undefined, input.name, undefined);
      case 'nested':
        //TODO: Support more than 2 levels of nesting
        return this.factory.makeMemberAccess(
          undefined,
          this.factory.makeIdentifier(undefined, input.path[0], undefined),
          input.path[1],
          undefined,
        );
      case 'mapping':
        return this.factory.makeIndexAccess(
          undefined,
          this.factory.makeIdentifier(undefined, input.name, undefined),
          this.dynamic(input.key),
        );
      case 'literal': {
        const kind = variableTypeToLiteralKind(input.type);
        return this.factory.makeLiteral(
          undefined,
          kind,
          undefined,
          String(input.value),
        );
      }
      default:
        throw new Error(`Unsupported property type: ${input.propertyType}`);
    }
  }
}
