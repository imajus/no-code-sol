import { createDefinitionModel } from 'sequential-workflow-editor-model';
import {
  rootModel,
  logStepModel,
  calculateStepModel,
  convertValueStepModel,
  ifStepModel,
  loopStepModel,
  functionsStepModel,
} from './model';

export const definitionModel = createDefinitionModel((model) => {
  model.valueTypes(['string', 'number']);
  model.root(rootModel);
  model.steps([
    logStepModel,
    calculateStepModel,
    convertValueStepModel,
    ifStepModel,
    loopStepModel,
    functionsStepModel,
  ]);
});
