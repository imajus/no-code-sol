import { Designer } from 'sequential-workflow-designer';
import {
  logStep,
  calculateStep,
  convertValueStep,
  ifStep,
  loopStep,
  functionsStep,
  functionsStepEditorProvider,
  defaultStepEditorProvider,
  variableStep,
} from './model';

/**
 *
 * @param {HTMLElement} placeholder
 * @param {DefinitionWalker} walker
 * @param {MyDefinition} definition
 */
export function createDesigner(placeholder, walker, definition) {
  return Designer.create(placeholder, definition, {
    controlBar: true,
    editors: {
      rootEditorProvider() {
        const root = document.createElement('div');
        root.innerText = 'Please select any step.';
        return root;
      },
      stepEditorProvider(step, context) {
        switch (step.type) {
          case 'functions':
            return functionsStepEditorProvider(step, context);
          default:
            return defaultStepEditorProvider(step, context);
        }
      },
    },
    validator: {
      step(step) {
        return Object.keys(step.properties).every((name) => {
          const value = step.properties[name];
          return value === 0 || value === '' || Boolean(value);
        });
      },
      root: () => true,
    },
    steps: {
      iconUrlProvider: () => '/assets/icon-task.svg',
      isDeletable: ({ type }) => type !== 'functions',
      isDraggable: ({ type }) => type !== 'functions',
    },
    toolbox: {
      groups: [
        {
          name: 'Structure',
          steps: [functionsStep, variableStep],
        },
        {
          name: 'Logic',
          steps: [ifStep, loopStep, calculateStep, convertValueStep],
        },
        {
          name: 'Debugging',
          steps: [logStep],
        },
      ],
    },
    //FIXME: This causes error when deleting a step
    // undoStackSize: 10,
    definitionWalker: walker,
  });
}
