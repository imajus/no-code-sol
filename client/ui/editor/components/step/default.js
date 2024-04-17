import { Tracker } from 'meteor/tracker';
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
  state: {
    properties: null,
  },
  onCreated() {
    const { step } = this.data;
    this.state.properties = Object.entries(step.properties).map(
      ([name, property]) => ({
        name,
        property,
      }),
    );
  },
  helpers: {
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
      const {
        dataset: { prop },
      } = e.target;
      this.updateProperty(prop, e.target.value.trim());
    },
    'changeType'(e, tmpl, { name, value }) {
      this.updateProperty(name, { propertyType: 'type', value });
    },
    'changeDynamic'(e, tmpl, { name, value }) {
      this.updateProperty(name, value);
    },
  },
  private: {
    updateProperty(name, value) {
      const { onChangeProperty } = this.data;
      const properties = Tracker.nonreactive(() => this.state.properties);
      this.state.properties = properties.map((item) => {
        if (item.name === name) {
          return { name, property: value };
        }
        return item;
      });
      onChangeProperty(name, value);
    },
  },
});
