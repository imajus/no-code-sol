import { TemplateController } from 'meteor/space:template-controller';
import '../input/dynamic';
import '../input/type';
import './default.html';

TemplateController('EditorStep', {
  // props: new SimpleSchema({
  //   'step': {
  //     type: Object,
  //     blackbox: true,
  //   },
  //   onChangeName: Function,
  //   onChangeProperty: Function,
  // }),
  helpers: {
    properties() {
      const { step } = this.data;
      return Object.entries(step.properties).map(([name, property]) => ({
        name,
        property,
      }));
    },
    isDynamic(property) {
      return ['variable', 'mapping', 'constant'].includes(
        property.propertyType,
      );
    },
  },
  events: {
    'change [data-target=name]'(e) {
      const { onChangeName } = this.data;
      onChangeName(e.target.value.trim());
    },
    'change [data-target=prop]'(e) {
      const { onChangeProperty } = this.data;
      const {
        dataset: { prop },
      } = e.target;
      onChangeProperty(prop, e.target.value.trim());
    },
    'changeType'(e, tmpl, { name, value }) {
      const { onChangeProperty } = this.data;
      onChangeProperty(name, { propertyType: 'type', value });
    },
    'changeDynamic'(e, tmpl, { name, value }) {
      const { onChangeProperty } = this.data;
      onChangeProperty(name, value);
    },
  },
  private: {},
});
