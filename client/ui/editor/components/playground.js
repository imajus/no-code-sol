import { cloneDeep } from 'lodash';
// import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';
import { TemplateController } from 'meteor/space:template-controller';
import { executeMachine } from '/api/emulator';
import { AppStorage } from '/api/storage';
import { convertInputValue } from './util';
import './input/mapping';
import './playground.html';

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
  onCreated() {
    const { designer } = this.data;
    const definition = designer.getDefinition();
    const storage = new AppStorage('input');
    this.unpack(storage);
    this.initState(definition);
    this.initArgs(definition);
    this.autorun(() => {
      const { state, func } = this.state;
      Tracker.nonreactive(() => this.initArgs(definition));
      this.autorun(() => {
        const { args } = this.state;
        storage.set({ state, func, args });
        if (func) {
          Tracker.nonreactive(() => this.execute());
        }
      });
    });
    designer.onDefinitionChanged.subscribe(() => {
      const definition = designer.getDefinition();
      this.initState(definition);
      this.initArgs(definition);
    });
  },
  helpers: {
    functs() {
      const { designer } = this.data;
      const definition = designer.getDefinition();
      const step = definition.sequence.find(({ type }) => type === 'functions');
      if (step) {
        return Object.keys(step.branches);
      }
      return null;
    },
    selectedAttr(cur, value) {
      if (cur === value) {
        return { selected: true };
      }
      return {};
    },
  },
  events: {
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
          return { ...arg, value: convertInputValue(value, arg.type) };
        }
        return arg;
      });
    },
  },
  private: {
    unpack(storage) {
      const { state, func, args } = storage.get() ?? {};
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
      this.state.state = this.extractVariables(definition).map(
        ({ name, type }) => ({
          name,
          type,
          value: state.find((item) => item.name === name)?.value,
        }),
      );
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
      this.state.args = [];
      if (func) {
        this.state.args = this.extractArguments(definition).map(
          ({ name, type }) => ({
            name,
            type,
            value: args.find((arg) => arg.name === name)?.value,
          }),
        );
      }
    },
    serializeInput() {
      const { func, state, args } = this.state;
      return {
        func,
        ...[...state, ...args].reduce(
          (acc, { name, value }) => ({ ...acc, [name]: cloneDeep(value) }),
          {},
        ),
      };
    },
    deserializeOutput(definition, state) {
      this.state.output = [
        ...this.extractVariables(definition),
        //FIXME: Do we need to show function arguments?
        // ...this.extractArguments(definition),
      ].map(({ name, type }) => ({ name, type, value: state[name] }));
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
