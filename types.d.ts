// import { Definition, Step } from 'sequential-workflow-model';
// import {
// Dynamic,
// NullableVariable,
//   ValueType,
//   VariableDefinition,
//   VariableDefinitions,
// } from 'sequential-workflow-editor-model';
// import {
//   WorkflowMachineSnapshot,
// } from 'sequential-workflow-machine';

export interface AppState {
  definition: MyDefinition;
  inputData: RawInputData;
}

export interface GlobalState {
  startTime: Date;
  variablesState: VariableState;
  $variables: VariablesService;
  $dynamics: DynamicsService;
  $logger: LoggerService;
}

export interface MyDefinition extends Definition {
  properties: {
    inputs: VariableDefinitions;
    outputs: VariableDefinitions;
  };
}

export interface LogStep extends Step {
  type: 'log';
  componentType: 'task';
  properties: {
    message: string;
  };
}

export interface CalculateStep extends Step {
  type: 'calculate';
  componentType: 'task';
  properties: {
    a: Dynamic<number | NullableVariable>;
    operator: string;
    b: Dynamic<number | NullableVariable>;
    result: NullableVariable;
  };
}

export interface ConvertValueStep extends Step {
  type: 'convertValue';
  componentType: 'task';
  properties: {
    source: NullableAnyVariable;
    target: NullableAnyVariable;
  };
}

export type onStateChanged = (path: string[]) => void;
export type onLog = (message: string) => void;
export type RawInputData = Record<string, string>;
export type VariableState = Record<string, unknown>;
