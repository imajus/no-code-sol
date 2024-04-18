type Definition = import('sequential-workflow-model').Definition;
type Step = import('sequential-workflow-model').Step;
type BranchedStep = import('sequential-workflow-model').BranchedStep;
type SequentialStep = import('sequential-workflow-model').SequentialStep;
type DefinitionWalker = import('sequential-workflow-model').DefinitionWalker;

type WorkflowMachineSnapshot =
  import('sequential-workflow-machine').WorkflowMachineSnapshot;
type BranchNameResult = import('sequential-workflow-machine').BranchNameResult;

type SourceUnit = import('solc-typed-ast').SourceUnit;
type ASTNode = import('solc-typed-ast').ASTNode;
type SourceUnit = import('solc-typed-ast').SourceUnit;
type ASTNodeWithChildren = import('solc-typed-ast').ASTNodeWithChildren;
type TypeName = import('solc-typed-ast').TypeName;
type ContractDefinition = import('solc-typed-ast').ContractDefinition;
type FunctionDefinition = import('solc-typed-ast').FunctionDefinition;
type LiteralKind = import('solc-typed-ast').LiteralKind;
type ASTNodeFactory = import('solc-typed-ast').ASTNodeFactory;

///// Common

type TClass<T = any> = new (...args: any[]) => T;

///// Root

interface MyDefinition extends Definition {
  properties: {};
}

type ValueTypeName =
  | 'boolean'
  | 'string'
  | 'address'
  | 'uint256'
  | 'mapping(address => uint256)';

interface NestedVariableValue {
  propertyType: 'nested';
  path: string[];
}

interface VariableValue {
  propertyType: 'variable';
  name: string;
}

interface MappingAccessValue extends VariableValue {
  propertyType: 'mapping';
  key: DynamicValue;
}

interface LiteralValue {
  propertyType: 'literal';
  type: ValueTypeName;
  value: string;
}

interface StringValue {
  propertyType: 'string';
  value: string;
  options?: string[] | Record<string, string>;
}

interface TypeValue {
  propertyType: 'type';
  value: ValueTypeName;
}

type DynamicValue =
  | VariableValue
  | NestedVariableValue
  | MappingAccessValue
  | LiteralValue;

///// Services

interface IVariableService {
  define(name: string, type: ValueTypeName): void;
  typeOf(name: string): ValueTypeName;
  get(name: String): any;
  resolve(input: DynamicValue): any;
  set(input: string | VariableValue | MappingAccessValue, value: any): void;
  isSet(name: string): boolean;
  delete(name: string): void;
  format(pattern: String): string;
}

///// State

type VariableState = Record<string, any>;

interface GlobalState {
  startTime: Date;
  // state: VariableState;
  $variables: IVariableService;
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
    left: DynamicValue;
    operator: StringValue;
    right: DynamicValue;
    result: VariableValue | MappingAccessValue;
  };
}

// interface MappingGetValueStep extends Step {
//   type: 'mappingGetValue';
//   componentType: 'task';
//   properties: {
//     mapping: string;
//     key: string;
//     result: string;
//   };
// }

// interface MappingSetValueStep extends Step {
//   type: 'mappingSetValue';
//   componentType: 'task';
//   properties: {
//     mapping: string;
//     key: string;
//     value: string;
//   };
// }

interface IfStep extends BranchedStep {
  type: 'if';
  componentType: 'switch';
  properties: {
    left: DynamicValue;
    operator: string;
    right: DynamicValue;
  };
}

interface LoopStep extends SequentialStep {
  type: 'loop';
  componentType: 'container';
  properties: {
    from: DynamicValue;
    to: DynamicValue;
    increment: DynamicValue;
    operator: string;
    indexVariable: string;
    variables: string;
  };
}

interface ConvertValueStep extends Step {
  type: 'convertValue';
  componentType: 'task';
  properties: {
    source: DynamicValue;
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
    type: TypeValue;
    // defaultValue: string;
  };
}

interface ArgumentStep extends Step {
  type: 'argument';
  componentType: 'task';
  properties: {
    name: string;
    type: TypeValue;
    // defaultValue: string;
  };
}

interface ReturnStep extends Step {
  type: 'return';
  componentType: 'task';
  properties: {
    result: DynamicValue;
  };
}

///// Compilers

interface AbstractCompiler {
  units(definition: MyDefinition): [SourceUnit];
  compile(definition: MyDefinition): Promise<string>;
}

interface RootResolver {
  resolve(definition: MyDefinition): SourceUnit;
}

interface StepResolver {
  resolve(step: Step, index: number, parent: ASTNodeWithChildren);
}

///// Miscellaneous

type RawInputData = Record<string, string>;
