import SimpleSchema from 'simpl-schema';
import { TemplateController } from 'meteor/space:template-controller';
import './dynamic.html';

/**
 * @see https://docs.soliditylang.org/en/latest/grammar.html#a4.SolidityLexer.Identifier
 */
const StringLiteralRegex = /^(['"]).+\1$/;
const IntegerNumberRegex = /^-?[0-9]+$/;
const IdentifierRegex = /^[a-z$_][a-z0-9$_]*$/i;
const ObjectAccessRegex = /^([a-z$_][a-z0-9$_]*)(?:\.([a-z$_][a-z0-9$_]*))+$/i;
const MappingAccessRegex = /^([a-z$_][a-z0-9$_]*)\[(.+?)\]$/i;

/**
 * @param {DynamicValue} property
 * @returns {string}
 */
function serialize(property) {
  switch (property.propertyType) {
    case 'variable':
      return property.name;
    case 'mapping': {
      return `${property.name}[${serialize(property.key)}]`;
    }
    case 'nested':
      return property.path.join('.');
    case 'literal':
      return property.value;
    default:
      throw new Error(`Unsupported property type: ${property.propertyType}`);
  }
}

/**
 * @returns {DynamicValue}
 */
function maybeStringLiteral(input) {
  if (input.match(StringLiteralRegex)) {
    return {
      propertyType: 'literal',
      type: 'string',
      value: input.slice(1, -1),
    };
  }
  return undefined;
}

/**
 * @returns {DynamicValue}
 */
function maybeInteger(input) {
  if (input.match(IntegerNumberRegex)) {
    return {
      propertyType: 'literal',
      type: 'uint256',
      value: input,
    };
  }
  return undefined;
}

/**
 * @returns {DynamicValue}
 */
function maybeObjectAccess(input) {
  if (input.match(ObjectAccessRegex)) {
    const parts = input.split('.');
    return {
      //TODO: Support in model/emulator/compiler
      propertyType: 'nested',
      path: parts,
    };
  }
  return undefined;
}

/**
 * @returns {DynamicValue}
 */
function maybeMappingAccess(input) {
  const match = input.match(MappingAccessRegex);
  if (match) {
    return {
      propertyType: 'mapping',
      name: match[1],
      key: unserialize(match[2]),
    };
  }
  return undefined;
}

/**
 * @param {string} input
 * @returns {DynamicValue}
 */
function unserialize(input) {
  return (
    maybeStringLiteral(input) ??
    maybeInteger(input) ??
    maybeMappingAccess(input) ??
    maybeObjectAccess(input) ?? {
      //TODO: Validate with IdentifierRegex
      propertyType: 'variable',
      name: input,
    }
  );
}

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
    value() {
      const { property } = this.props;
      return serialize(property);
    },
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
      return property.propertyType === 'literal';
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
      const value = unserialize(e.target.value.trim());
      this.maybeTriggerChangeEvent(value);
    },
    'change [data-target=key]'(e) {
      const { property } = this.props;
      const key = unserialize(e.target.value.trim());
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
        case 'literal':
          return { propertyType, type: 'string', value: '' };
        default:
          throw new Error(`Unsupported type: ${propertyType}`);
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
