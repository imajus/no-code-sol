import SimpleSchema from 'simpl-schema';
import { TemplateController } from 'meteor/space:template-controller';
import './type.html';

TemplateController('EditorTypeInput', {
  props: new SimpleSchema({
    'value': {
      type: String,
      optional: true,
    },
    'eventChange': String,
  }),
  helpers: {
    types: () => [
      'string',
      'number',
      'boolean',
      'address',
      'uint256',
      'mapping(address => uint256)',
    ],
    typeAtts(type) {
      const { value } = this.props;
      if (value === type) {
        return { selected: true };
      }
      return {};
    },
  },
  events: {
    'change'(e) {
      const { eventChange } = this.props;
      const { value } = e.target;
      this.triggerEvent(eventChange, { value });
    },
  },
});
