import {
  createStepModel,
  createStringValueModel,
  createRootModel,
  createVariableDefinitionsValueModel,
  createDefinitionModel,
} from 'sequential-workflow-editor-model';
import { EditorProvider } from 'sequential-workflow-editor';
import { Uid, DefinitionWalker, Designer } from 'sequential-workflow-designer';
import { TemplateController } from 'meteor/space:template-controller';
import { Playground } from '/api/playground';
import { executeMachine } from '/api/machine';
import { AppStorage } from '/api/storage';
import 'sequential-workflow-designer/css/designer.css';
import 'sequential-workflow-designer/css/designer-light.css';
import 'sequential-workflow-editor/css/editor.css';
import './home.html';
import './home.css';

/**
 * @type LogStep
 */
const logStepModel = createStepModel('log', 'task', (step) => {
  step
    .property('message')
    .value(
      createStringValueModel({
        minLength: 1,
      }),
    )
    .label('Message to log');
});

/**
 * @type MyDefinition
 */
const rootModel = createRootModel((root) => {
  root.property('inputs').value(createVariableDefinitionsValueModel({}));
  root
    .property('outputs')
    .hint('Variables returned from the workflow.')
    .value(createVariableDefinitionsValueModel({}))
    .label('Outputs');
  // root.sequence().value(
  //   createSequenceValueModel({
  //     sequence: [],
  //   }),
  // );
});

/**
 * @type MyDefinition
 */
const definitionModel = createDefinitionModel((model) => {
  model.valueTypes(['string', 'number']);
  model.root(rootModel);
  model.steps([logStepModel]);
});

const editorProvider = EditorProvider.create(definitionModel, {
  uidGenerator: Uid.next,
});

TemplateController('Home', {
  onRendered() {
    const execute = this.execute.bind(this);
    this.definitionWalker = new DefinitionWalker();
    this.designer = Designer.create(
      this.find('#designer'),
      editorProvider.activateDefinition(),
      {
        controlBar: true,
        editors: {
          rootEditorProvider: editorProvider.createRootEditorProvider(),
          stepEditorProvider: editorProvider.createStepEditorProvider(),
        },
        validator: {
          step: editorProvider.createStepValidator(),
          root: editorProvider.createRootValidator(),
        },
        steps: {
          iconUrlProvider: () => '/assets/icon-task.svg',
        },
        toolbox: {
          groups: editorProvider.getToolboxGroups(),
          labelProvider: editorProvider.createStepLabelProvider(),
        },
        definitionWalker: this.definitionWalker,
      },
    );
    this.playground = new Playground(
      this.find('#logs'),
      {},
      this.find('#inputs'),
      this.find('#outputs'),
    );
    this.designer.onReady.subscribe(execute);
    this.designer.onDefinitionChanged.subscribe(execute);
    this.playground.onInputChanged.subscribe(execute);
  },
  private: {
    /**
     *
     * @param {string[]} statePath
     * @param {MyDefinition} definition
     * @param {DefinitionWalker} walker
     * @returns {string}
     */
    readStateName(statePath, definition, walker) {
      const path = [...statePath].reverse();
      const deepestStepId = path
        .find((x) => x.startsWith('STEP_'))
        ?.substring(5);
      if (deepestStepId) {
        const step = walker.getById(definition, deepestStepId);
        if (path[0].startsWith('STEP_')) {
          return step.name;
        }
        return `${step.name} (${path[0]})`;
      }
      return statePath.join('/');
    },
    async execute() {
      this.playground.clearLogs();
      const definition = this.designer.getDefinition();
      this.playground.updateVariables(definition);
      AppStorage.set(definition, this.playground.readInputData());
      try {
        const inputVariablesState = this.playground.readInputVariableState();
        if (!this.designer.isValid()) {
          throw new Error('Definition is not valid');
        }
        const snapshot = await executeMachine(
          definition,
          inputVariablesState,
          (statePath) => {
            const name = this.readStateName(
              statePath,
              definition,
              this.definitionWalker,
            );
            this.playground.log(`state: ${name}`, 'trace');
          },
          (log) => {
            this.playground.log(log);
          },
        );
        if (snapshot.unhandledError) {
          const error = snapshot.unhandledError;
          this.playground.log(`UNHANDLED ERROR: ${error.message}`);
          return;
        }
        definition.properties.outputs.variables.forEach((variable) => {
          if (snapshot.globalState.$variables.isSet(variable.name)) {
            const value = snapshot.globalState.$variables.read(variable.name);
            this.playground.setOutputVariable(variable.name, value);
          }
        });
      } catch (err) {
        this.playground.log(`FAILED: ${err.message}`);
      }
    },
  },
});
