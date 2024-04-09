import { formatVariableName } from 'sequential-workflow-editor';
import {
  WellKnownValueType,
  createChoiceValueModel,
  createStepModel,
  createDynamicValueModel,
  createGeneratedStringValueModel,
  createNullableVariableValueModel,
  createNumberValueModel,
} from 'sequential-workflow-editor-model';

export const calculateStepModel = createStepModel(
  'calculate',
  'task',
  /**
   *
   * @param {CalculateStep} step
   */
  (step) => {
    step.category('Values');
    step.description(
      'Calculate value from two numbers. Result is stored in variable.',
    );
    step
      .name()
      .value(
        createGeneratedStringValueModel({
          generator: (context) => {
            const result = context.formatPropertyValue('result', (value) =>
              formatVariableName(value.name),
            );
            const a = context.formatPropertyValue('a', ({ value }) => {
              return value && typeof value === 'object'
                ? formatVariableName(value.name)
                : String(value ?? '?');
            });
            const operator = context.getPropertyValue('operator');
            const b = context.formatPropertyValue('b', ({ value }) => {
              return value && typeof value === 'object'
                ? formatVariableName(value.name)
                : String(value ?? '?');
            });
            return `${result} = ${a} ${operator} ${b}`;
          },
        }),
      )
      .dependentProperty('result')
      .dependentProperty('a')
      .dependentProperty('b')
      .dependentProperty('operator');
    const val = createDynamicValueModel({
      models: [
        createNumberValueModel({}),
        createNullableVariableValueModel({
          isRequired: true,
          valueType: WellKnownValueType.number,
        }),
      ],
    });
    step.property('result').value(
      createNullableVariableValueModel({
        valueType: WellKnownValueType.number,
        isRequired: true,
      }),
    );
    step.property('a').value(val).label('A');
    step.property('operator').value(
      createChoiceValueModel({
        choices: ['+', '-', '*', '/', '%'],
      }),
    );
    step.property('b').value(val).label('B');
  },
);
