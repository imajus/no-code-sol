## Overview 

**NoCodeSol** is a visual sequential workflow design tool for building Solidity Smart Contracts with no actual Solidity syntax knowledge required. 

## Motivation

This tool essentially allows to involve a much broader amount of people to creating Smart Contracts for EVM based blockhains.

The tool is great for prototyping ideas because of low initial learning curve and general convenience of ready-to-use web based solution. The additional steps like setting up a local development environment and deployment infrastructure are essentially put aside. Anyone could just open a web page, design a desired logic for their Smart Contract and then export the result in a form of Solidity/ABI/AST/Bytecode files or deploy to EVM compatible blockchain directly from the browser.

The proof-of-concept implementation allows to create Smart Contracts with multiple functions and custom logic involving a (yet) limited set of operations.

## The Market Fit

Here's a summary of advantages the platform gives comparing to existing alternatives:

- Lower learning curve for designing and deploying SCs onto EVM blockchain.
- Self-documented implementation which graphical representation could be used for presenting and pitching the project.
- Testing the SC logic directly in a browser thanks to JavaScript emulator.
- Potentially could be used to output other artifacts (think of WASM, JavaScript, etc.).

## The Future

**NoCodeSol** is extendable in a fairly straightforward manner to support a wider set of operations available in Solidity language.

The target audience is yet unclear, as the tool could be adapted to either more granular control of the output or to provide more abstract components in exchange for flexibility. 

Target audience could defined as one of the following:

- Programmers, who want to debug their Smart Contracts quickly in a browser execution environment
- Non-programmers, who just want to prototype their ideas quickly
- Learners, who want to learn Solidity in a more visual and interactive way

## Example Smart Contract

Consider downloading a [dump](.examples/NoCodeSol-2024-04-19T15_43_30.582Z.json) file for importing into **NoCodeSol**.

```sol
/// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16<0.9.0;

contract BasicToken {
    mapping(address => uint256) public balances;

    function mint(uint256 amount) public {
        balances[msg.sender] = balances[msg.sender] + amount;
    }

    function transfer(address recipient, uint256 amount) public {
        if (balances[msg.sender] >= amount) {
            balances[msg.sender] = balances[msg.sender] - amount;
            balances[recipient] = balances[recipient] + amount;
        } else {}
    }
}
```

Deployed to:

- Morph Testnet: [`0x799f5e246F3F31c9Ec9B36f9CF7f1BdA94d881be`](https://explorer-testnet.morphl2.io/address/0x799f5e246F3F31c9Ec9B36f9CF7f1BdA94d881be)
- ArbSepolia Testnet: [`0x26f24fd9afbc367cbf0bed364c3fe2b490e0d911`](https://sepolia.arbiscan.io/address/0x26f24fd9afbc367cbf0bed364c3fe2b490e0d911)
- Gnosis Chiado Testnet: [`0xE320077b267ce495b93dc1b2480c18fd103B6133`](https://gnosis-chiado.blockscout.com/address/0xE320077b267ce495b93dc1b2480c18fd103B6133)