import { DefinitionWalker } from 'sequential-workflow-designer';
import { ASTNodeFactory } from 'solc-typed-ast';
import { rootResolver } from './model/root';
import { resolvers } from './model/resolvers';

/**
 * @abstract
 * @implements {AbstractCompiler}
 */
export class AbstractCompiler {
  units(definition) {
    const walker = new DefinitionWalker();
    const factory = new ASTNodeFactory();
    const tree = new Map();
    const unit = rootResolver.resolve(definition, tree);
    /**
     * @type {Map<Step[], ASTNodeWithChildren>}
     */
    walker.forEach(definition, (step, index, parentSequence) => {
      const Resolver = resolvers.get(step.type);
      if (!Resolver) {
        // throw new Error(`No resolver found for step "${step.type}"`);
        console.warn(`No resolver found for step "${step.type}"`);
        return;
      }
      const parent = tree.get(parentSequence);
      new Resolver(factory, tree).resolve(step, index, parent);
    });
    return [unit];
  }
}
