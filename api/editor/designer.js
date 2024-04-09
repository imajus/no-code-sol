import { Designer } from 'sequential-workflow-designer';
import { editorProvider } from './provider';

/**
 *
 * @param {HTMLElement} placeholder
 * @param {DefinitionWalker} definitionWalker
 * @param {AppState} startState
 */
export function createDesigner(placeholder, definitionWalker, startState) {
  return Designer.create(placeholder, startState.definition, {
    controlBar: true,
    editors: {
      rootEditorProvider: editorProvider.createRootEditorProvider(),
      stepEditorProvider: editorProvider.createStepEditorProvider(),
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
