import SimpleSchema from 'simpl-schema';
import { TemplateController } from 'meteor/space:template-controller';
import './string.html';

TemplateController('EditorStringInput', {
  props: new SimpleSchema(
    {
      'name': String,
      'value': String,
      'options': {
        type: Object,
        blackbox: true,
      },
      'eventChange': String,
      'eventChangeData': String,
    },
    {
      requiredByDefault: false,
    },
  ),
  helpers: {
    options() {
      const { options } = this.props;
      if (Array.isArray(options)) {
        return options.map((option) => ({ value: option, label: option }));
      } else {
        return Object.entries(options).map(([value, label]) => ({
          label,
          value,
        }));
      }
    },
    optionAtts(input) {
      const { value } = this.props;
      if (value === input) {
        return { selected: true };
      }
      return {};
    },
  },
  events: {
    'change'(e) {
      const { name, options, eventChange, eventChangeData } = this.props;
      const { value } = e.target;
      if (eventChange) {
        this.triggerEvent(eventChange, {
          ...eventChangeData,
          name,
          value: {
            propertyType: 'string',
            value: value.trim(),
            options,
          },
        });
      }
    },
  },
});
