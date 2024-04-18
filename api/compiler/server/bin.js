import { DefinitionWalker } from 'sequential-workflow-designer';
import { compile, CompilationOutput, CompilerKind } from 'solc-typed-ast';
import { AbstractCompiler } from './abstract';
import { SolidityCompiler } from './sol';

/**
 * @implements {AbstractCompiler}
 */
export class EthereumBytecodeCompiler extends AbstractCompiler {
  async compile(definition) {
    const solidity = new SolidityCompiler();
    const source = await solidity.compile(definition);
    const bytes = new TextEncoder().encode(source);
    const { errors, contracts } = await compile(
      new Map([['BasicToken.sol', bytes]]),
      [],
      '0.8.25',
      [CompilationOutput.EVM_BYTECODE_OBJECT],
      {},
      CompilerKind.Native,
    );
    if (errors) {
      const panic = errors.find((e) => e.severity === 'error');
      for (const error of errors) {
        if (error.severity === 'error') {
          console.error(error.formattedMessage);
        } else {
          console.warn(error.formattedMessage);
        }
      }
      if (panic) {
        throw new Error(`${panic.type}: ${panic.message}`);
      }
    }
    return contracts['BasicToken.sol']['BasicToken'].evm.bytecode.object;
  }
}
