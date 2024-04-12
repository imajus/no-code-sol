// import SimpleSchema from 'simpl-schema';
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
  switch (type) {
    case 'string':
      return (text ?? '').trim();
    case 'number': {
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
    func: null,
    args: null,
    result: null,
    logs: [],
  },
  onCreated() {},
  onRendered() {
    const { designer } = this.data;
    const execute = this.execute.bind(this);
    const storage = new AppStorage('input');
    const { func, args } = storage.get() ?? {};
    designer.onReady.subscribe(execute);
    designer.onDefinitionChanged.subscribe(execute);
    this.state.func = func ?? 'function1';
    this.state.args = args ?? [];
    this.autorun(() => {
      const { func, args } = this.state;
      storage.set({ func, args });
    });
    execute();
  },
  helpers: {},
  events: {
    'change [data-target=func]'(e) {
      const { value } = e.currentTarget;
      this.state.func = convertInputValue(value, 'string');
      this.execute();
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
      const { logs } = this.state;
      this.state.logs = [...logs, { message, brand }];
    },
    async execute() {
      const { designer } = this.data;
      const { func, args } = this.state;
      const definition = designer.getDefinition();
      this.state.logs = [];
      try {
        if (!designer.isValid()) {
          this.log('Definition is not valid', 'warning');
          return;
        }
        const state = { func, args };
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
        this.state.result = state.result;
      } catch (err) {
        console.error(err);
        this.log(`FAILED: ${err.message}`, 'danger');
      }
    },
  },
});
