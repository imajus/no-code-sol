import { cloneDeep, fromPairs, isEmpty } from 'lodash';
// import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';
import { TemplateController } from 'meteor/space:template-controller';
import { executeMachine } from '/api/emulator';
import { AppStorage } from '/api/storage';
import { convertInputValue } from './util';
import './input/mapping';
import './input/msg';
import './playground.html';

export function serialize(value, type) {
  switch (type) {
    case 'boolean':
      return Boolean(value);
    case 'uint256':
      return BigInt(value);
    case 'mapping(address => uint256)':
      return value?.reduce(
        (acc, { key, value }) => ({ ...acc, [key]: BigInt(value) }),
        {},
      );
    case 'string':
    case 'address':
    default:
      return value;
  }
}

export function deserialize(value, type) {
  switch (type) {
    case 'boolean':
      return Boolean(value);
    case 'uint256':
      return BigInt(value);
    case 'mapping(address => uint256)':
      return Object.entries(value).map(([key, value]) => ({
        key,
        value: String(value),
      }));
    case 'string':
    case 'address':
    default:
      return value;
  }
}

function deepEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
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
    definition: null,
    msg: null,
    state: null,
    func: null,
    args: null,
    output: null,
    logs: [],
  },
  onCreated() {
    const { designer } = this.data;
    this.state.definition = designer.getDefinition();
    const storage = new AppStorage('input');
    this.unpack(storage);
    this.autorun(() => {
      const { func } = this.state;
      const functs = this.functs();
      if (!functs.includes(func)) {
        [this.state.func] = functs;
      }
    });
    this.autorun(() => {
      const { definition } = this.state;
      this.initState(definition);
      this.initArgs(definition);
    });
    this.autorun(() => {
      const { msg, state, func, args } = this.state;
      storage.set({ msg, state, func, args });
      if (func) {
        Tracker.nonreactive(() => this.execute());
      }
    });
    designer.onDefinitionChanged.subscribe(() => {
      this.state.definition = designer.getDefinition();
    });
  },
  helpers: {
    functs() {
      return this.functs();
    },
    selectedAttr(cur, value) {
      if (cur === value) {
        return { selected: true };
      }
      return {};
    },
  },
  events: {
    'changeMsg'(e, tmpl, { name, type, value }) {
      this.updateMsg(name, type, value);
    },
    'changeState'(e, tmpl, { name, value }) {
      this.updateState(name, value);
    },
    'change [data-target=state]'(e) {
      const {
        dataset: { name },
        value,
      } = e.target;
      const { type } = this.state.state.find((item) => item.name === name);
      this.updateState(name, convertInputValue(value, type));
    },
    'change [data-target=func]'(e) {
      const { value } = e.target;
      this.state.func = value.trim();
    },
    'change [data-target=args]'(e) {
      const {
        dataset: { index },
        value,
      } = e.target;
      const { args } = this.state;
      this.state.args = args.map((arg, i) => {
        // eslint-disable-next-line eqeqeq
        if (i == index) {
          return { ...arg, value };
        }
        return arg;
      });
    },
  },
  private: {
    functs() {
      const { definition } = this.state;
      const step = definition.sequence.find(({ type }) => type === 'functions');
      if (step) {
        return Object.keys(step.branches);
      }
      return [];
    },
    unpack(storage) {
      const { msg, state, func, args } = storage.get() ?? {};
      this.state.msg = msg ?? {};
      this.state.state = state ?? [];
      this.state.func = func ?? 'function1';
      this.state.args = args ?? [];
    },
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
    extractVariables(definition) {
      return definition.sequence
        .filter(({ type }) => type === 'variable')
        .map(({ properties }) => properties);
    },
    extractArguments(definition) {
      const { func } = this.state;
      const step = definition.sequence.find(({ type }) => type === 'functions');
      const sequence = step?.branches[func];
      if (sequence) {
        return sequence
          .filter(({ type }) => type === 'argument')
          .map(({ properties }) => properties);
      }
      return [];
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
      const tmp = this.extractVariables(definition).map(({ name, type }) => ({
        name,
        type: type.value,
        value: state.find((item) => item.name === name)?.value,
      }));
      if (!deepEqual(state, tmp)) {
        this.state.state = tmp;
      }
    },
    updateMsg(name, type, value) {
      const { msg } = this.state;
      this.state.msg = {
        ...msg,
        [name]: { type, value },
      };
    },
    updateState(name, value) {
      const { state } = this.state;
      this.state.state = state.map((item) => {
        if (item.name === name) {
          return { ...item, value };
        }
        return item;
      });
    },
    initArgs(definition) {
      const { func, args } = this.state;
      if (func) {
        const tmp = this.extractArguments(definition).map(({ name, type }) => ({
          name,
          type: type.value,
          value: args.find((arg) => arg.name === name)?.value,
        }));
        if (!deepEqual(args, tmp)) {
          this.state.args = tmp;
        }
      } else if (!isEmpty(args)) {
        this.state.args = [];
      }
    },
    serializeInput() {
      const { msg, state, func, args } = this.state;
      return {
        func,
        msg: fromPairs(
          Object.entries(msg ?? {}).map(([name, { type, value }]) => [
            name,
            serialize(value, type),
          ]),
        ),
        ...fromPairs(
          [...state, ...args].map(({ name, type, value }) => [
            name,
            serialize(cloneDeep(value), type),
          ]),
        ),
      };
    },
    deserializeOutput(definition, state) {
      const output = [
        ...this.extractVariables(definition),
        //FIXME: Do we need to show function arguments?
        // ...this.extractArguments(definition),
      ].map(({ name, type }) => ({
        name,
        type: type.value,
        value: deserialize(state[name], type.value),
      }));
      //FIXME: Dirty hack
      if ('return' in state) {
        output.push({
          name: 'return',
          type: 'string',
          value: String(state['return']),
        });
      }
      this.state.output = output;
    },
    async execute() {
      const { designer } = this.data;
      this.resetLogs();
      try {
        const definition = designer.getDefinition();
        if (!designer.isValid()) {
          this.log('Definition is not valid', 'warning');
          return;
        }
        const state = this.serializeInput();
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
        this.deserializeOutput(definition, state);
      } catch (err) {
        console.error(err);
        this.log(`FAILED: ${err.message}`, 'danger');
      }
    },
  },
});
