import { isEmpty, isEqual, isEqualWith } from 'lodash';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';
import { TemplateController } from 'meteor/space:template-controller';
import { convertInputValue } from '../util';
import './mapping.html';

TemplateController('EditorMappingInput', {
  props: new SimpleSchema(
    {
      'value': Array,
      'value.$': {
        type: Object,
        required: true,
      },
      'value.$.key': String,
      'value.$.value': String,
      'readonly': Boolean,
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
  state: {
    items: [],
  },
  onCreated() {
    this.autorun(() => {
      const { value } = this.props;
      const items = Tracker.nonreactive(() => this.state.items);
      if (value) {
        if (!isEqualWith(value, items, isEqual)) {
          this.state.items = value;
        }
      } else if (!isEmpty(items)) {
        this.state.items = [];
      }
    });
    this.autorun((comp) => {
      const { items } = this.state;
      if (!comp.firstRun) {
        Tracker.nonreactive(() => {
          const { eventChange, eventChangeData } = this.props;
          if (eventChange) {
            this.triggerEvent(eventChange, {
              ...eventChangeData,
              value: items,
            });
          }
        });
      }
    });
  },
  helpers: {
    inputAtts() {
      const { readonly } = this.props;
      if (readonly) {
        return { readonly: true };
      }
      return {};
    },
  },
  events: {
    'change'(e) {
      const {
        value,
        dataset: { target, index },
      } = e.target;
      const { items } = this.state;
      this.state.items = items.map((item, i) => {
        // eslint-disable-next-line eqeqeq
        if (i == index) {
          //FIXME: Make this adjustable
          // const type = target === 'key' ? 'address' : 'uint256';
          return {
            ...item,
            [target]: value /* convertInputValue(value, type) */,
          };
        }
        return item;
      });
    },
    'click [data-action=deleteItem]'(e) {
      const {
        dataset: { index },
      } = e.target;
      const { items } = this.state;
      this.state.items = [...items.slice(0, index), ...items.slice(index + 1)];
    },
    'click [data-action=addItem]'() {
      const { items } = this.state;
      this.state.items = [...items, { key: '', value: '' }];
    },
  },
});
