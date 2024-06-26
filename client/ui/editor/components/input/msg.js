import SimpleSchema from 'simpl-schema';
import { TemplateController } from 'meteor/space:template-controller';
import { convertInputValue } from '../util';
import './msg.html';

// msg.data (bytes): complete calldata
// msg.gas (uint): remaining gas
// msg.sender (address): sender of the message (current call)
// msg.sig (bytes4): first four bytes of the calldata (i.e. function identifier)
// msg.value (uint): number of wei sent with the message

TemplateController('EditorMsg', {
  props: new SimpleSchema(
    {
      'msg': {
        type: Object,
        blackbox: true,
      },
      'eventChange': String,
      'eventChangeData': {
        type: Object,
        blackbox: true,
      },
    },
    {
      requiredByDefault: false,
    },
  ),
  events: {
    'change'(e) {
      const {
        dataset: { target, type },
        value,
      } = e.target;
      const { eventChange, eventChangeData } = this.data;
      if (eventChange) {
        this.triggerEvent(eventChange, {
          ...eventChangeData,
          name: target,
          type,
          value,
        });
      }
    },
  },
});
