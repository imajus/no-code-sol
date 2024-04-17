import SimpleSchema from 'simpl-schema';
import { TemplateController } from 'meteor/space:template-controller';
import './dynamic.html';

TemplateController('EditorDynamicValue', {
  props: new SimpleSchema(
    {
      'name': String,
      'property': { type: Object, blackbox: true },
      'eventChange': String,
      'eventChangeData': String,
    },
    {
      requiredByDefault: false,
    },
  ),
  helpers: {
    isVariable() {
      const { property } = this.props;
      return property.propertyType === 'variable';
    },
    isMapping() {
      const { property } = this.props;
      return property.propertyType === 'mapping';
    },
    isConstant() {
      const { property } = this.props;
      return property.propertyType === 'constant';
    },
    types: () => [
      'string',
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
    'change [data-target=property]'(e) {
      const { property } = this.props;
      const value = this.updateValue(property, e.target.value.trim());
      this.maybeTriggerChangeEvent(value);
    },
    'change [data-target=key]'(e) {
      const { property } = this.props;
      const key = this.updateValue(property.key, e.target.value.trim());
      this.maybeTriggerChangeEvent({ ...property, key });
    },
    'click [data-action=changeType][data-target=property]'(e) {
      const {
        dataset: { type },
      } = e.target;
      e.preventDefault();
      const value = this.defaultValueFor(type);
      this.maybeTriggerChangeEvent(value);
    },
    'click [data-action=changeType][data-target=key]'(e) {
      const {
        dataset: { type },
      } = e.target;
      e.preventDefault();
      const { property } = this.props;
      const key = this.defaultValueFor(type);
      this.maybeTriggerChangeEvent({ ...property, key });
    },
  },
  private: {
    defaultValueFor(propertyType) {
      switch (propertyType) {
        case 'variable':
          return { propertyType, name: '' };
        case 'mapping':
          return {
            propertyType,
            name: '',
            key: { propertyType: 'variable', name: '' },
          };
        case 'constant':
          return { propertyType, type: 'string', value: '' };
        default:
          throw new Error(`Unsupported type: ${propertyType}`);
      }
    },
    updateValue(target, value) {
      switch (target.propertyType) {
        case 'variable':
        case 'mapping':
          return { ...target, name: value };
        case 'constant':
          return { ...target, value };
        default:
          throw new Error(`Unsupported type: ${target.type}`);
      }
    },
    maybeTriggerChangeEvent(value) {
      const { name, eventChange, eventChangeData } = this.props;
      if (eventChange) {
        this.triggerEvent(eventChange, {
          ...eventChangeData,
          name,
          value,
        });
      }
    },
  },
});
