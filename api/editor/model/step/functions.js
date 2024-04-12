import { Random } from 'meteor/random';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import '/client/ui/editor/components/functions';

export function functionsStepEditorProvider(step, context) {
  const root = document.createElement('div');
  Blaze.renderWithData(
    Template['EditorFunctionsStep'],
    {
      onAdd(name) {
        step.branches[name] = [];
        context.notifyChildrenChanged();
      },
      onRename(old, to) {
        step.branches[to] = step.branches[old];
        delete step.branches[old];
        context.notifyChildrenChanged();
      },
      onDelete(name) {
        delete step.branches[name];
        context.notifyChildrenChanged();
      },
      branches: Object.keys(step.branches),
    },
    root,
  );
  return root;
}

/** @type {FunctionsStep} */
export const functionsStep = {
  id: Random.id(),
  type: 'functions',
  componentType: 'switch',
  name: 'Functions',
  properties: {},
  branches: {
    'function1': [],
  },
};
