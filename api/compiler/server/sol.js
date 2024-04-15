import {
  ASTReader,
  ASTWriter,
  DefaultASTWriterMapping,
  LatestCompilerVersion,
  PrettyFormatter,
} from 'solc-typed-ast';
import { AbstractSyntaxTreeCompiler } from '../ast';

/**
 * @implements {AbstractCompiler}
 */
export class SolidityCompiler {
  async compile(definition) {
    const formatter = new PrettyFormatter(4, 0);
    const reader = new ASTReader();
    const writer = new ASTWriter(
      DefaultASTWriterMapping,
      formatter,
      LatestCompilerVersion,
    );
    const compiler = new AbstractSyntaxTreeCompiler();
    const raw = await compiler.compile(definition);
    const ast = JSON.parse(raw);
    const [unit] = reader.read(ast);
    return writer.write(unit);
  }
}
