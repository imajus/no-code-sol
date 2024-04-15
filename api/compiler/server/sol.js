import {
  ASTWriter,
  DefaultASTWriterMapping,
  LatestCompilerVersion,
  PrettyFormatter,
} from 'solc-typed-ast';
import { AbstractCompiler } from './abstract';

/**
 * @implements {AbstractCompiler}
 */
export class SolidityCompiler extends AbstractCompiler {
  async compile(definition) {
    const formatter = new PrettyFormatter(4, 0);
    const writer = new ASTWriter(
      DefaultASTWriterMapping,
      formatter,
      LatestCompilerVersion,
    );
    const [unit] = this.units(definition);
    return writer.write(unit);
  }
}
