import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { AccountsTemplates } from 'meteor/useraccounts:core';

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

/**
 * @see https://github.com/meteor-useraccounts/core/blob/master/Guide.md#features
 */
AccountsTemplates.configure({
  // Behavior
  confirmPassword: false,
  enablePasswordChange: false,
  forbidClientAccountCreation: false,
  overrideLoginErrors: true,
  sendVerificationEmail: false,
  lowercaseUsername: false,
  focusFirstInput: true,
  // Appearance
  showAddRemoveServices: false,
  showForgotPasswordLink: false,
  showLabels: true,
  showPlaceholders: true,
  showResendVerificationEmailLink: false,
  // Client-side Validation
  continuousValidation: false,
  negativeFeedback: false,
  negativeValidation: true,
  positiveValidation: true,
  positiveFeedback: true,
  showValidating: true,
  // Privacy Policy and Terms of Use
  // privacyUrl: 'privacy',
  // termsUrl: 'terms-of-use',
  // Redirects
  homeRoutePath: '/',
  redirectTimeout: 4000,
  // Hooks
  // onLogoutHook: myLogoutFunc,
  // onSubmitHook: mySubmitFunc,
  // preSignUpHook: myPreSubmitFunc,
  // postSignUpHook: myPostSubmitFunc,
  // Texts
  // texts: {
  //   button: {
  //     signUp: "Register Now!"
  //   },
  //   socialSignUp: "Register",
  //   socialIcons: {
  //       "meteor-developer": "fa fa-rocket"
  //   },
  //   title: {
  //       forgotPwd: "Recover Your Password"
  //   },
  // },
  /**
   * @see https://github.com/meteor-compat/useraccounts-flow-routing-extra/?tab=readme-ov-file#blaze-configuration
   */
  ...(Meteor.isClient && {
    defaultLayout: 'Layout',
    defaultLayoutRegions: {},
    defaultContentRegion: 'main',
  }),
});
