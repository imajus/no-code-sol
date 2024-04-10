import SimpleSchema from 'simpl-schema';
import { TemplateController } from 'meteor/space:template-controller';
import './functions.html';

TemplateController('EditorFunctionsStep', {
  props: new SimpleSchema({
    'onAdd': Function,
    'onRename': Function,
    'onDelete': Function,
    'branches': [String],
  }),
  state: {
    branches: [],
  },
  onCreated() {
    this.state.branches = this.props.branches;
  },
  events: {
    'change [data-action=changeName]'(e) {
      const input = e.currentTarget;
      const { branch } = input.dataset;
      const { branches } = this.state;
      const value = e.currentTarget.value.trim();
      if (branches.includes(value)) {
        alert('Function name already taken');
        return;
      }
      this.state.branches = branches.map((name) =>
        name === branch ? value : name,
      );
      this.props.onRename(branch, value);
    },
    'click [data-action=deleteFunction]'(e) {
      const { branch } = e.currentTarget.dataset;
      const { branches } = this.state;
      this.state.branches = branches.filter((name) => name !== branch);
      this.props.onDelete(branch);
    },
    'click [data-action=addFunction]'() {
      const name = window.prompt('Enter function name');
      if (name) {
        const { branches } = this.state;
        this.state.branches = [...branches, name];
        this.props.onAdd(name);
      }
    },
  },
});
