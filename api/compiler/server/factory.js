import { AbstractBinaryInterfaceCompiler } from './abi';
import { EthereumBytecodeCompiler } from './bin';
import { SolidityCompiler } from './sol';
import { AbstractSyntaxTreeCompiler } from './ast';

/**
 * Compiler factory
 * @param {string} format
 * @returns {AbstractCompiler}
 */
export function compilerFor(format) {
  switch (format) {
    case 'abi':
      return new AbstractBinaryInterfaceCompiler();
    case 'ast':
      return new AbstractSyntaxTreeCompiler();
    case 'bin':
      return new EthereumBytecodeCompiler();
    case 'sol':
      return new SolidityCompiler();
    default:
      throw new Error(`Format not supported: ${format}`);
  }
}
