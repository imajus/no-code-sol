import { ASTNodeFactory, ContractKind } from 'solc-typed-ast';

export const rootResolver = {
  resolve(definition, tree) {
    const { name } = definition.properties;
    const filename = `${name}.sol`;
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
      name,
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
      filename,
      0,
      filename,
      new Map([[name, 39]]), //???
      [pragrma, contract],
      //FIXME: Make adjustable
      'GPL-3.0',
    );
  },
};
