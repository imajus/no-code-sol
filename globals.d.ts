type Definition = import('sequential-workflow-model').Definition;
type Step = import('sequential-workflow-model').Step;
type BranchedStep = import('sequential-workflow-model').BranchedStep;
type SequentialStep = import('sequential-workflow-model').SequentialStep;
type DefinitionWalker = import('sequential-workflow-model').DefinitionWalker;
type Dynamic = import('sequential-workflow-model').Dynamic;
type NullableVariable = import('sequential-workflow-model').NullableVariable;
type ValueType = import('sequential-workflow-model').ValueType;

type NullableVariableDefinition =
  import('sequential-workflow-editor-model').NullableVariableDefinition;
type VariableDefinition =
  import('sequential-workflow-editor-model').VariableDefinition;
type VariableDefinitions =
  import('sequential-workflow-editor-model').VariableDefinitions;

type WorkflowMachineSnapshot =
  import('sequential-workflow-machine').WorkflowMachineSnapshot;
type BranchNameResult = import('sequential-workflow-machine').BranchNameResult;

interface MyDefinition extends Definition {
  properties: {
    inputs: VariableDefinitions;
    outputs: VariableDefinitions;
  };
}

interface AppState {
  definition: MyDefinition;
  inputData: RawInputData;
}

interface GlobalState {
  startTime: Date;
  variablesState: VariableState;
  $variables: VariablesService;
  $dynamics: DynamicsService;
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
    a: Dynamic<number | NullableVariable>;
    operator: string;
    b: Dynamic<number | NullableVariable>;
    result: NullableVariable;
  };
}

interface IfStep extends BranchedStep {
  type: 'if';
  componentType: 'switch';
  properties: {
    a: Dynamic<number | string | boolean | NullableVariable>;
    operator: string;
    b: Dynamic<number | string | boolean | NullableVariable>;
  };
}

interface LoopStep extends SequentialStep {
  type: 'loop';
  componentType: 'container';
  properties: {
    from: Dynamic<number | NullableVariable>;
    to: Dynamic<number | NullableVariable>;
    increment: Dynamic<number | NullableVariable>;
    operator: string;
    indexVariable: NullableVariableDefinition;
    variables: VariableDefinitions;
  };
}

interface ConvertValueStep extends Step {
  type: 'convertValue';
  componentType: 'task';
  properties: {
    source: NullableAnyVariable;
    target: NullableAnyVariable;
  };
}

interface FunctionsStep extends BranchedStep {
  type: 'functions';
  componentType: 'switch';
  properties: {};
}

type RawInputData = Record<string, string>;
type VariableState = Record<string, unknown>;
