import SimpleSchema from 'simpl-schema';
import { TemplateController } from 'meteor/space:template-controller';
import './functions.html';

function guessFunctionName(branches) {
  for (let i = 1; ; i++) {
    const name = `func${branches.length + i}`;
    if (!branches.includes(name)) {
      return name;
    }
  }
}

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
    const { branches, args } = this.props;
    this.state.branches = branches;
  },

  events: {
    'change [data-target=func]'(e) {
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
    'click [data-action=deleteFunc]'(e) {
      const { branch } = e.currentTarget.dataset;
      const { branches } = this.state;
      if (branches.length === 1) {
        alert('Cannot delete last function');
        return;
      }
      this.state.branches = branches.filter((name) => name !== branch);
      this.props.onDelete(branch);
    },
    'click [data-action=addFunc]'() {
      const { branches } = this.state;
      const name = guessFunctionName(branches);
      this.state.branches = [...branches, name];
      this.props.onAdd(name);
    },
  },
});
