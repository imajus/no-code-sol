import { WellKnownValueType } from 'sequential-workflow-editor-model';
// import SimpleSchema from 'simpl-schema';
import { TemplateController } from 'meteor/space:template-controller';
import { executeMachine } from '/api/machine';
import { AppStorage } from '/api/storage';
import './playground.html';

/**
 *
 * @param {string} text
 * @param {ValueType} type
 * @returns {*}
 */
function convertInputValue(text, type) {
  switch (type) {
    case WellKnownValueType.string:
      return (text ?? '').trim();
    case WellKnownValueType.number: {
      const value = parseFloat(text);
      if (Number.isNaN(value)) {
        throw new Error(`Invalid input number value: ${text || '<empty>'}`);
      }
      return value;
    }
    default:
      throw new Error(`Unknown variable type: ${type}`);
  }
}

TemplateController('EditorPlayground', {
  // props: new SimpleSchema({
  //   'designer': {
  //     type: Object,
  //     blackbox: true,
  //   },
  //   'walker': {
  //     type: Object,
  //     blackbox: true,
  //   },
  // }),
  state: {
    inputs: null,
    outputs: null,
    logs: [],
  },
  onCreated() {},
  onRendered() {
    const { designer } = this.data;
    const execute = this.execute.bind(this);
    const storage = new AppStorage('inputs');
    designer.onReady.subscribe(execute);
    designer.onDefinitionChanged.subscribe(execute);
    this.state.inputs = storage.get();
    this.autorun(() => {
      const { inputs } = this.state;
      storage.set(inputs);
    });
    execute();
  },
  helpers: {},
  events: {
    'change [data-action=changeInput]'(e) {
      const {
        dataset: { index },
        value,
      } = e.currentTarget;
      const { inputs } = this.state;
      this.state.inputs = inputs.map((input, i) => {
        // eslint-disable-next-line eqeqeq
        if (i == index) {
          return { ...input, value: convertInputValue(value, input.type) };
        }
        return input;
      });
      this.execute();
    },
  },
  private: {
    readStateName(statePath, definition) {
      const { walker } = this.data;
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
    log(message, brand = 'normal') {
      this.state.logs.push({ message, brand });
    },
    initInputVariables(definition) {
      const { inputs } = this.state;
      this.state.inputs = definition.properties.inputs.variables.map(
        ({ name, type }) => {
          const { value } = inputs.find((input) => input.name === name) ?? {};
          return { name, type, value };
        },
      );
    },
    readInputVariableState(definition) {
      const { inputs } = this.state;
      const { variables } = definition.properties.inputs;
      if (!variables) {
        throw new Error('Input variables not set');
      }
      return variables.reduce(
        /**
         *
         * @param {VariableState} values
         * @param {VariableDefinition} definition
         */
        (values, { name, type }) => {
          const { value } = inputs.find((input) => input.name === name);
          return {
            ...values,
            [name]: convertInputValue(value, type),
          };
        },
        {},
      );
    },
    writeOutputVariableState(definition, snapshot) {
      const { $variables } = snapshot.globalState;
      this.state.outputs = definition.properties.outputs.variables.map(
        ({ name }) => {
          if ($variables.isSet(name)) {
            const value = $variables.read(name);
            return { name, value };
          }
          return { name };
        },
      );
    },
    async execute() {
      const { designer } = this.data;
      const definition = designer.getDefinition();
      this.state.logs = [];
      this.initInputVariables(definition);
      try {
        if (!designer.isValid()) {
          throw new Error('Definition is not valid');
        }
        const state = this.readInputVariableState(definition);
        const snapshot = await executeMachine(
          definition,
          state,
          (statePath) => {
            const name = this.readStateName(statePath, definition);
            this.log(`state: ${name}`, 'muted');
          },
          (log) => this.log(log),
        );
        if (snapshot.unhandledError) {
          const { message } = snapshot.unhandledError;
          throw new Error(message);
        }
        this.writeOutputVariableState(definition, snapshot);
      } catch (err) {
        console.error(err);
        this.log(`FAILED: ${err.message}`, 'danger');
      }
    },
  },
});
