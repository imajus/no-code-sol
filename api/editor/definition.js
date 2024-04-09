import { createDefinitionModel } from 'sequential-workflow-editor-model';
import {
  rootModel,
  logStepModel,
  calculateStepModel,
  convertValueStepModel,
} from './model';

/**
 * @type MyDefinition
 */
export const definitionModel = createDefinitionModel((model) => {
  model.valueTypes(['string', 'number']);
  model.root(rootModel);
  model.steps([logStepModel, calculateStepModel, convertValueStepModel]);
});
