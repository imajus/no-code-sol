import { EditorProvider } from 'sequential-workflow-editor';
import { Uid } from 'sequential-workflow-designer';
import { definitionModel } from './definition';

export const editorProvider = EditorProvider.create(definitionModel, {
  uidGenerator: Uid.next,
});
