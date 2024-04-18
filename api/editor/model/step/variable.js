import { Random } from 'meteor/random';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import '/client/ui/editor/components/step/variable';

/**
 *
 * @param {VariableStep | ArgumentStep} step
 * @param {*} context
 * @returns
 */
export function variableStepEditorProvider(step, context) {
  const root = document.createElement('div');
  Blaze.renderWithData(
    Template['EditorVariableStep'],
    {
      step,
      onChangeName(value) {
        step.name = value;
        context.notifyNameChanged();
      },
      onChangeProperty(name, value) {
        step.properties[name] = value;
        context.notifyPropertiesChanged();
      },
    },
    root,
  );
  return root;
}

/** @type {VariableStep} */
export const variableStep = {
  id: Random.id(),
  type: 'variable',
  componentType: 'task',
  name: 'Variable',
  properties: {
    name: '',
    type: { propertyType: 'type', value: 'string' },
    // defaultValue: '',
  },
};
