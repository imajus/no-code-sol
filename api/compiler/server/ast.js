import { DefinitionWalker } from 'sequential-workflow-designer';
import { AbstractCompiler } from './abstract';

/**
 * @implements {AbstractCompiler}
 */
export class AbstractSyntaxTreeCompiler extends AbstractCompiler {
  walker = new DefinitionWalker();

  async compile(definition) {
    const units = this.units();
    throw new Error('Not implemented');
  }
}
