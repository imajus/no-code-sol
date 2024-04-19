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
- Non-programmers, who just want to prototopy their ideas quickly
- Learners, who want to learn Solidity in a more visal and interactive way