import { AbstractSyntaxTreeCompiler } from './ast';
import { WrapperCompiler } from './wrapper';

export { AbstractSyntaxTreeCompiler };

if (Meteor.isServer) {
  // @ts-ignore
  export { AbstractBinaryInterfaceCompiler } from './server/abi';
  // @ts-ignore
  export { EthereumBytecodeCompiler } from './server/bin';
  // @ts-ignore
  export { SolidityCompiler } from './server/sol';
}

/**
 * Compiler factory
 * @param {string} format
 * @param {MyDefinition} definition
 * @returns {Promise<string>}
 */
export async function compile(format, definition) {
  switch (format) {
    case 'bin':
    case 'sol':
    case 'abi': {
      const compiler = new WrapperCompiler(format);
      return compiler.compile(definition);
    }
    case 'ast': {
      const compiler = new AbstractSyntaxTreeCompiler();
      return compiler.compile(definition);
    }
    default:
      throw new Error(`Format not supported: ${format}`);
  }
}
