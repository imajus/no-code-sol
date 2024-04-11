import { Designer } from 'sequential-workflow-designer';
import { editorProvider } from './provider';
import { functionsStepEditorProvider } from './model/step/functions';

/**
 *
 * @param {HTMLElement} placeholder
 * @param {DefinitionWalker} definitionWalker
 * @param {MyDefinition} definition
 */
export function createDesigner(placeholder, definitionWalker, definition) {
  return Designer.create(placeholder, definition, {
    controlBar: true,
    editors: {
      rootEditorProvider: editorProvider.createRootEditorProvider(),
      stepEditorProvider(step, context, defo) {
        const fallback = editorProvider.createStepEditorProvider();
        switch (step.type) {
          case 'functions':
            return functionsStepEditorProvider(step, context);
          default:
            return fallback(step, context, defo);
        }
      },
    },
    validator: {
      step: editorProvider.createStepValidator(),
      root: editorProvider.createRootValidator(),
    },
    steps: {
      iconUrlProvider: () => '/assets/icon-task.svg',
    },
    toolbox: {
      groups: editorProvider.getToolboxGroups(),
      labelProvider: editorProvider.createStepLabelProvider(),
    },
    undoStackSize: 10,
    definitionWalker,
  });
}
