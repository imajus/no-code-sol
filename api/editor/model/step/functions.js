import {
  createBranchesValueModel,
  createBranchedStepModel,
} from 'sequential-workflow-editor-model';
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

export const functionsStepModel = createBranchedStepModel(
  'functions',
  'switch',
  (step) => {
    step.category('Structure');
    step.description('Define functions of Smart Contract.');
    step.branches().value(
      createBranchesValueModel({
        dynamic: true,
        branches: {
          'function1': [],
        },
      }),
    );
  },
);
