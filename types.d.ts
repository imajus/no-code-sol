// import { Definition, Step } from 'sequential-workflow-model';
// import { VariableDefinitions } from 'sequential-workflow-editor-model';
// import {
//   ValueType,
//   VariableDefinition,
//   VariableDefinitions,
// } from 'sequential-workflow-editor-model';
import { CalculateStep } from '../../model/calculate-step-model';

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

export type RawInputData = Record<string, string>;

export type VariableState = Record<string, unknown>;
