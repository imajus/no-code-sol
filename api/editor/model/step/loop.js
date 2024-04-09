import {
  WellKnownValueType,
  createVariableDefinitionsValueModel,
  createSequentialStepModel,
  createDynamicValueModel,
  createNumberValueModel,
  createNullableVariableValueModel,
  createChoiceValueModel,
  createNullableVariableDefinitionValueModel,
} from 'sequential-workflow-editor-model';

export const loopStepModel = createSequentialStepModel(
  'loop',
  'container',
  (step) => {
    step.category('Logic');
    step.description('Loop over a range of numbers.');
    step
      .property('from')
      .label('From')
      .value(
        createDynamicValueModel({
          models: [
            createNumberValueModel({}),
            createNullableVariableValueModel({
              isRequired: true,
              valueType: WellKnownValueType.number,
            }),
          ],
        }),
      );
    step
      .property('operator')
      .label('Operator')
      .value(
        createChoiceValueModel({
          choices: ['<', '<='],
        }),
      );
    step
      .property('to')
      .label('To')
      .value(
        createDynamicValueModel({
          models: [
            createNumberValueModel({}),
            createNullableVariableValueModel({
              isRequired: true,
              valueType: WellKnownValueType.number,
            }),
          ],
        }),
      );
    step
      .property('increment')
      .label('Increment')
      .value(
        createDynamicValueModel({
          models: [
            createNumberValueModel({
              defaultValue: 1,
            }),
            createNullableVariableValueModel({
              isRequired: true,
              valueType: WellKnownValueType.number,
            }),
          ],
        }),
      );
    step
      .property('indexVariable')
      .label('Index variable')
      .value(
        createNullableVariableDefinitionValueModel({
          valueType: WellKnownValueType.number,
          isRequired: true,
          defaultValue: {
            name: 'index',
            type: WellKnownValueType.number,
          },
        }),
      );
    step
      .property('variables')
      .label('Extra variables')
      .value(createVariableDefinitionsValueModel({}));
  },
);
