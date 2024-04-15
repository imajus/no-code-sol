import { ASTNodeFactory, ContractKind } from 'solc-typed-ast';

export const rootResolver = {
  resolve(definition, tree) {
    const factory = new ASTNodeFactory();
    const pragrma = factory.makePragmaDirective([
      'solidity',
      '>=',
      '0.4',
      '.16',
      '<',
      '0.9',
      '.0',
    ]);
    const contract = factory.makeContractDefinition(
      'BasicToken',
      40, //???
      ContractKind.Contract,
      false,
      true,
      [39], //???
      [],
      [],
      undefined,
      [],
    );
    tree.set(definition.sequence, contract);
    return factory.makeSourceUnit(
      'BasicToken.sol',
      0,
      'BasicToken.sol',
      new Map([['BasicToken', 39]]), //???
      [pragrma, contract],
      //FIXME: Make adjustable
      'GPL-3.0',
    );
  },
};
