import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

/**
 * @implements {AbstractCompiler}
 */
export class WrapperCompiler {
  format;

  /**
   * @param {string} format
   */
  constructor(format) {
    this.format = format;
  }

  async compile(definition) {
    if (Meteor.isClient) {
      return Meteor.callAsync('Compiler.compile', this.format, definition);
    } else {
      // @ts-ignore
      import { compilerFor } from './server/factory';
      const compiler = compilerFor(this.format);
      return compiler.compile(definition);
    }
  }
}

if (Meteor.isServer) {
  Meteor.methods({
    /**
     *
     * @param {string} format
     * @param {MyDefinition} definition
     * @returns
     */
    async 'Compiler.compile'(format, definition) {
      try {
        check(format, String);
        check(
          definition,
          Match.ObjectIncluding({
            sequence: [Object],
            properties: Object,
          }),
        );
        const wrapper = new WrapperCompiler(format);
        return await wrapper.compile(definition);
      } catch (err) {
        throw new Meteor.Error(500, err.message);
      }
    },
  });
}
