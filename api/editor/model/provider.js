import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import '/client/ui/editor/components/step/default';
import '/client/ui/editor/components/root';

/**
 * @type {RootEditorProvider}
 */
export function rootEditorProvider(definition, context) {
  const root = document.createElement('div');
  Blaze.renderWithData(
    Template['EditorRoot'],
    {
      onPropertyChanged(name, value) {
        definition.properties[name] = value;
        context.notifyPropertiesChanged();
      },
      definition,
    },
    root,
  );
  return root;
}

/**
 * @type {StepEditorProvider}
 */
export function defaultStepEditorProvider(step, context) {
  const root = document.createElement('div');
  Blaze.renderWithData(
    Template['EditorStep'],
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
