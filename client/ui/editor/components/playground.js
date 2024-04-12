// import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';
import { TemplateController } from 'meteor/space:template-controller';
import { executeMachine } from '/api/machine';
import { AppStorage } from '/api/storage';
import './playground.html';

/**
 *
 * @param {string} text
 * @param {string} type
 * @returns {*}
 */
function convertInputValue(text, type) {
  return text;
  // switch (type) {
  //   case 'string':
  //     return (text ?? '').trim();
  //   case 'number': {
  //     const value = parseFloat(text);
  //     if (Number.isNaN(value)) {
  //       throw new Error(`Invalid input number value: ${text || '<empty>'}`);
  //     }
  //     return value;
  //   }
  //   default:
  //     throw new Error(`Unknown variable type: ${type}`);
  // }
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
    state: null,
    func: null,
    args: null,
    output: null,
    logs: [],
  },
  onCreated() {},
  onRendered() {
    const { designer } = this.data;
    const definition = designer.getDefinition();
    const storage = new AppStorage('input');
    const { state, func, args } = storage.get() ?? {};
    this.state.state = state ?? [];
    this.state.func = func ?? 'function1';
    this.state.args = args ?? [];
    this.initState(definition);
    this.initArgs(definition);
    this.autorun(() => {
      const { state, func, args } = this.state;
      storage.set({ state, func, args });
      Tracker.nonreactive(() => this.execute());
    });
    designer.onDefinitionChanged.subscribe(() => {
      const definition = designer.getDefinition();
      this.initState(definition);
      this.initArgs(definition);
    });
  },
  helpers: {
    outputState() {
      const { output } = this.state;
      if (output) {
        return Object.entries(output).map(([name, value]) => ({
          name,
          value,
        }));
      }
      return null;
    },
  },
  events: {
    'change [data-target=state]'(e) {
      const {
        dataset: { id },
        value,
      } = e.currentTarget;
      const { state } = this.state;
      this.state.state = state.map((item) => {
        if (item._id === id) {
          return { ...item, value: convertInputValue(value, item.type) };
        }
        return item;
      });
    },
    'change [data-target=func]'(e) {
      const { value } = e.currentTarget;
      this.state.func = convertInputValue(value, 'string');
    },
    'change [data-target=args]'(e) {
      const {
        dataset: { index },
        value,
      } = e.currentTarget;
      const { args } = this.state;
      this.state.args = args.map((arg, i) => {
        // eslint-disable-next-line eqeqeq
        if (i == index) {
          return { ...arg, value: convertInputValue(value, arg.type) };
        }
        return arg;
      });
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
      const { logs } = this.state;
      this.state.logs = [...logs, { message, brand }];
    },
    resetLogs() {
      this.state.logs = [];
    },
    initState(definition) {
      const { state } = this.state;
      const variables = definition.sequence
        .filter((step) => step.type === 'variable')
        .map((step) => step.properties);
      this.state.state = variables.map(({ name, type }) => ({
        _id: name,
        value: state.find(({ _id }) => _id === name)?.value,
        type,
      }));
    },
    initArgs(definition) {
      //TODO
    },
    serializeState() {
      const { state } = this.state;
      return state.reduce(
        (acc, { _id, value }) => ({ ...acc, [_id]: value }),
        {},
      );
    },
    async execute() {
      const { designer } = this.data;
      const { func, args } = this.state;
      this.resetLogs();
      try {
        const definition = designer.getDefinition();
        if (!designer.isValid()) {
          this.log('Definition is not valid', 'warning');
          return;
        }
        const state = {
          ...this.serializeState(),
          func,
          args,
        };
        const snapshot = await executeMachine(
          definition,
          state,
          (path) => {
            const name = this.readStateName(path, definition);
            this.log(`state: ${name}`, 'muted');
          },
          (log) => this.log(log),
        );
        if (snapshot.unhandledError) {
          const { cause } = snapshot.unhandledError;
          throw cause;
        }
        this.state.output = state;
      } catch (err) {
        console.error(err);
        this.log(`FAILED: ${err.message}`, 'danger');
      }
    },
  },
});
