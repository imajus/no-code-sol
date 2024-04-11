type Definition = import('sequential-workflow-model').Definition;
type Step = import('sequential-workflow-model').Step;
type BranchedStep = import('sequential-workflow-model').BranchedStep;
type SequentialStep = import('sequential-workflow-model').SequentialStep;
type DefinitionWalker = import('sequential-workflow-model').DefinitionWalker;

// type ValueType = import('sequential-workflow-editor-model').ValueType;
// type NullableVariable = import('sequential-workflow-editor-model').NullableVariable;
// type Dynamic = import('sequential-workflow-editor-model').Dynamic;
// type NullableVariableDefinition =
//   import('sequential-workflow-editor-model').NullableVariableDefinition;
// type VariableDefinition =
//   import('sequential-workflow-editor-model').VariableDefinition;
// type VariableDefinitions =
//   import('sequential-workflow-editor-model').VariableDefinitions;

type WorkflowMachineSnapshot =
  import('sequential-workflow-machine').WorkflowMachineSnapshot;
type BranchNameResult = import('sequential-workflow-machine').BranchNameResult;

interface MyDefinition extends Definition {
  properties: {
    // inputs: VariableDefinitions;
    // outputs: VariableDefinitions;
  };
}

type VariableState = Record<string, unknown>;

interface GlobalState {
  startTime: Date;
  variablesState: VariableState;
  // $variables: VariablesService;
  // $dynamics: DynamicsService;
  $logger: LoggerService;
}

interface LoopActivityState {
  indexVariableName: string;
}

interface LogStep extends Step {
  type: 'log';
  componentType: 'task';
  properties: {
    message: string;
  };
}

interface CalculateStep extends Step {
  type: 'calculate';
  componentType: 'task';
  properties: {
    left: any;
    operator: string;
    right: any;
    result: NullableVariable;
  };
}

interface IfStep extends BranchedStep {
  type: 'if';
  componentType: 'switch';
  properties: {
    a: any;
    operator: string;
    b: any;
  };
}

interface LoopStep extends SequentialStep {
  type: 'loop';
  componentType: 'container';
  properties: {
    from: number;
    to: number;
    increment: number;
    operator: string;
    indexVariable: string;
    variables: string;
  };
}

interface ConvertValueStep extends Step {
  type: 'convertValue';
  componentType: 'task';
  properties: {
    source: string;
    target: string;
  };
}

interface FunctionsStep extends BranchedStep {
  type: 'functions';
  componentType: 'switch';
  properties: {};
}

type RawInputData = Record<string, string>;
