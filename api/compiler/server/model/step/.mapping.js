import { ASTNodeFactory } from 'solc-typed-ast';

function isVariable(operand) {
  return operand.match(/^{.+}$/);
}

/**
 *
 * @param {FunctionDefinition} parent
 * @param {string} name
 * @returns {string}
 */
function getVariableType(parent, name) {
  console.log('getVariableType');
}

function getMappingTypes(parent, name) {
  console.log('getMappingTypes');
  return { keysType: 'address', valueType: 'uint256' };
}

/***
 * @param {ASTNodeFactory} factory
 * @param {FunctionDefinition} parent
 * @param {string} key
 */
function resolveIndex(factory, parent, key) {
  if (isVariable(key)) {
    const name = key.substring(1, key.length - 1);
    return factory.makeIdentifier(
      getVariableType(parent, name),
      name,
      -15, // ???
    );
  } else {
    throw new Error(`Unsupported key: ${key}`);
  }
}

/**
 * @type {StepResolver}
 */
export const mappingGetValueStepResolver = {
  /**
   * @param {MappingGetValueStep} step
   * @param {FunctionDefinition} parent
   */
  resolve(step, index, parent) {
    const factory = new ASTNodeFactory();
    const { keysType, valueType } = getMappingTypes(
      parent,
      step.properties.mapping,
    );
    const baseExpression = factory.makeIdentifier(
      getVariableType(parent, step.properties.mapping), //'mapping(address => uint256)',
      step.properties.mapping,
      5, // ???
    );
    const indexExpression = resolveIndex(factory, parent, step.properties.key);
    const indexAccess = factory.makeIndexAccess(
      valueType,
      baseExpression,
      indexExpression,
    );
    const result = factory.makeIdentifier(
      getVariableType(parent, step.properties.result),
      step.properties.result,
      9, // ???
    );
    const assignment = factory.makeAssignment(
      getVariableType(parent, step.properties.result), //'uint256',
      '=', //'-=',
      result,
      indexAccess,
    );
    parent.vBody.appendChild(assignment);
  },
};

/**
 * @type {StepResolver}
 */
export const mappingSetValueStepResolver = {
  /**
   * @param {MappingSetValueStep} step
   * @param {FunctionDefinition} parent
   */
  resolve(step, index, parent) {
    const factory = new ASTNodeFactory();
    throw new Error('Not implemented');
  },
};
