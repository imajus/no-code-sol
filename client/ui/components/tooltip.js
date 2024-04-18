import SimpleSchema from 'simpl-schema';
import { Blaze } from 'meteor/blaze';
import { TemplateController } from 'meteor/space:template-controller';
import './tooltip.html';

TemplateController('tooltip', {
  props: new SimpleSchema(
    {
      'text': String,
      'classes': String,
    },
    {
      requiredByDefault: false,
    },
  ),
  onRendered() {
    this.autorun(() => {
      const { text, classes } = this.props;
      const { templateContentBlock: content } = this.view;
      if (content) {
        this.$('[data-toggle=tooltip]').tooltip({
          title: Blaze.toHTML(content),
          html: true,
          customClass: classes,
        });
      } else if (text) {
        this.$('[data-toggle=tooltip]').tooltip({
          title: text,
          customClass: classes,
        });
      } else {
        this.$('[data-toggle=tooltip]').tooltip('destroy');
      }
    });
  },
  onDestroyed() {
    this.$('[data-toggle=tooltip]').tooltip('destroy');
  },
});
