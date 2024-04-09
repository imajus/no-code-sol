import {
  createStepModel,
  createStringValueModel,
} from 'sequential-workflow-editor-model';

/**
 * @type LogStep
 */
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
