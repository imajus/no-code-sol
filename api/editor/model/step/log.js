import {
  createStepModel,
  createStringValueModel,
} from 'sequential-workflow-editor-model';

export const logStepModel = createStepModel('log', 'task', (step) => {
  step
    .property('message')
    .value(
      createStringValueModel({
        minLength: 1,
      }),
    )
    .label('Message to log');
});
