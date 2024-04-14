type Definition = import('sequential-workflow-model').Definition;
type Step = import('sequential-workflow-model').Step;
type BranchedStep = import('sequential-workflow-model').BranchedStep;
type SequentialStep = import('sequential-workflow-model').SequentialStep;
type DefinitionWalker = import('sequential-workflow-model').DefinitionWalker;

type WorkflowMachineSnapshot =
  import('sequential-workflow-machine').WorkflowMachineSnapshot;
type BranchNameResult = import('sequential-workflow-machine').BranchNameResult;

interface MyDefinition extends Definition {
  properties: {};
}

///// Services

interface IVariableService {
  get(name: string, cast?: object): string | number | boolean | null;
  set(name: string, value: any): void;
  resolve(pattern: string, cast?: object): string | number | boolean | null;
  isSet(name: string): boolean;
  delete(name: string): void;
}

///// State

type VariableType =
  | 'boolean'
  | 'string'
  | 'address'
  | 'uint256'
  | 'mapping(address => uint256)';
type VariableState = Record<string, string>;

interface GlobalState {
  startTime: Date;
  state: VariableState;
  $variables: IVariableService;
  // $dynamics: DynamicsService;
  $logger: LoggerService;
}

interface LoopActivityState {
  indexVariableName: string;
}

///// Steps

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
    left: string;
    operator: string;
    right: string;
    result: string;
  };
}

interface IfStep extends BranchedStep {
  type: 'if';
  componentType: 'switch';
  properties: {
    left: string;
    operator: string;
    right: string;
  };
}

interface LoopStep extends SequentialStep {
  type: 'loop';
  componentType: 'container';
  properties: {
    from: string;
    to: string;
    increment: string;
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

interface VariableStep extends Step {
  type: 'variable';
  componentType: 'task';
  properties: {
    name: string;
    type: VariableType;
    defaultValue: string;
  };
}

interface ArgumentStep extends Step {
  type: 'argument';
  componentType: 'task';
  properties: {
    name: string;
    type: VariableType;
    defaultValue: string;
  };
}

interface ReturnStep extends Step {
  type: 'return';
  componentType: 'task';
  properties: {
    result: string;
  };
}

///// Miscellaneous

type RawInputData = Record<string, string>;
