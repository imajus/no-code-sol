import SimpleSchema from 'simpl-schema';
import { TemplateController } from 'meteor/space:template-controller';
import '../input/type';
import './variable.html';

TemplateController('EditorVariableStep', {
  // props: new SimpleSchema({
  //   'step': {
  //     type: Object,
  //     blackbox: true,
  //   },
  //   onChangeName: Function,
  //   onChangeProperty: Function,
  // }),
  events: {
    'change [data-target=name]'(e) {
      const { onChangeProperty } = this.data;
      const { value } = e.target;
      onChangeProperty('name', value);
      this.updateName();
    },
    'changeType'(e, tmpl, { value }) {
      const { onChangeProperty } = this.data;
      onChangeProperty('type', { propertyType: 'type', value });
      this.updateName();
    },
  },
  private: {
    updateName() {
      const { onChangeName, step } = this.data;
      const { name, type } = step.properties;
      onChangeName(`${type.value} ${name}`);
    },
  },
});
