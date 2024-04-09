import { DefinitionWalker } from 'sequential-workflow-designer';
import { TemplateController } from 'meteor/space:template-controller';
import { editorProvider, createDesigner } from '/api/editor';
import { Playground } from '/api/playground';
import { executeMachine } from '/api/machine';
import { AppStorage } from '/api/storage';
import 'sequential-workflow-designer/css/designer.css';
import 'sequential-workflow-designer/css/designer-light.css';
import 'sequential-workflow-editor/css/editor.css';
import './home.html';
import './home.css';

TemplateController('Home', {
  onRendered() {
    const execute = this.execute.bind(this);
    const startState = AppStorage.tryGet() ?? {
      inputData: {},
      definition: editorProvider.activateDefinition(),
    };
    this.definitionWalker = new DefinitionWalker();
    this.designer = createDesigner(
      this.find('#designer'),
      this.definitionWalker,
      startState,
    );
    this.playground = new Playground(
      this.find('#logs'),
      startState.inputData,
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
