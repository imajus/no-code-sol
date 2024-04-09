import {
  createStepModel,
  createNullableAnyVariableValueModel,
} from 'sequential-workflow-editor-model';

export const convertValueStepModel = createStepModel(
  'convertValue',
  'task',
  /**
   *
   * @param {ConvertValueStep} step
   */
  (step) => {
    step.category('Values');
    step.description('Convert value from one variable to another.');
    step
      .property('source')
      .value(
        createNullableAnyVariableValueModel({
          isRequired: true,
        }),
      )
      .label('Source variable');
    step
      .property('target')
      .value(
        createNullableAnyVariableValueModel({
          isRequired: true,
        }),
      )
      .label('Target variable');
  },
);
