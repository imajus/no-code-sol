import {
  createBooleanValueModel,
  createBranchesValueModel,
  createChoiceValueModel,
  createBranchedStepModel,
  createDynamicValueModel,
  createNullableAnyVariableValueModel,
  createNumberValueModel,
  createStringValueModel,
} from 'sequential-workflow-editor-model';

export const ifStepModel = createBranchedStepModel(
  'if',
  'switch',
  /**
   *
   * @param {IfStep} step
   */
  (step) => {
    step.category('Logic');
    step.description('Check condition and execute different branches.');
    const ab = createDynamicValueModel({
      models: [
        createNumberValueModel({}),
        createStringValueModel({}),
        createBooleanValueModel({}),
        createNullableAnyVariableValueModel({
          isRequired: true,
        }),
      ],
    });
    step.property('a').value(ab).label('A').hint('Left side of comparison.');
    step
      .property('operator')
      .label('Operator')
      .value(
        createChoiceValueModel({
          choices: ['==', '===', '!=', '!==', '>', '>=', '<', '<='],
        }),
      )
      .hint(
        'Comparison operator.\nStep supports strict and non-strict operators.',
      );
    step.property('b').value(ab).label('B').hint('Right side of comparison.');
    step.branches().value(
      createBranchesValueModel({
        branches: {
          true: [],
          false: [],
        },
      }),
    );
  },
);
