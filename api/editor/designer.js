import { isEqual, map } from 'lodash';
import { Designer } from 'sequential-workflow-designer';
import {
  logStep,
  calculateStep,
  // convertValueStep,
  ifStep,
  loopStep,
  functionsStep,
  functionsStepEditorProvider,
  rootEditorProvider,
  defaultStepEditorProvider,
  variableStep,
  variableStepEditorProvider,
  returnStep,
  argumentStep,
} from './model';

function isSameSequence(a, b) {
  return isEqual(map(a, 'id'), map(b, 'id'));
}

/**
 *
 * @param {HTMLElement} placeholder
 * @param {DefinitionWalker} walker
 * @param {MyDefinition} definition
 */
export function createDesigner(placeholder, walker, definition) {
  const designer = Designer.create(placeholder, definition, {
    controlBar: true,
    editors: {
      rootEditorProvider,
      stepEditorProvider(step, context) {
        switch (step.type) {
          case 'functions':
            return functionsStepEditorProvider(step, context);
          case 'argument':
          case 'variable':
            return variableStepEditorProvider(step, context);
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
      canInsertStep(step, sequence, index) {
        const { sequence: root } = designer.getDefinition();
        switch (step.type) {
          case 'functions':
            return (
              isSameSequence(sequence, root) &&
              sequence.every(({ type }) => type !== 'functions')
            );
          case 'argument': {
            const func = root.find(({ type }) => type === 'functions');
            return (
              func &&
              Object.values(func.branches).some((branch) => {
                return isSameSequence(branch, sequence);
              })
            );
          }
          default:
            return true;
        }
      },
      canMoveStep(source, step, target, index) {
        return true;
      },
      isDuplicable: () => false,
      // isDeletable: ({ type }) => type !== 'functions',
      // isDraggable: ({ type }) => type !== 'functions',
      iconUrlProvider: (componentType, type) => `/assets/step/${type}.svg`,
    },
    toolbox: {
      groups: [
        {
          name: 'Structure',
          steps: [functionsStep, variableStep, argumentStep],
        },
        {
          name: 'Logic',
          steps: [
            ifStep,
            // loopStep,
            calculateStep,
            // convertValueStep,
            returnStep,
          ],
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
  return designer;
}
