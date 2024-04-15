import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { Web3Config } from 'meteor/majus:web3';

SimpleSchema.debug = Meteor.isDevelopment;
SimpleSchema.extendOptions(['autoform']);
// For ostrio:autoform-files
// SimpleSchema.setDefaultMessages({
//   initialLanguage: 'en',
//   messages: {
//     en: {
//       uploadError: '{{value}}',
//     },
//   },
// });

Web3Config.set({
  template: 'bootstrap4',
});
