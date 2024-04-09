import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { AccountsTemplates } from 'meteor/useraccounts:core';
import './ui/layout';
import './ui/home';

//TODO: Alternative: redirect to some route, which is "Default"
// FlowRouter.route('/',
//   triggersEnter: [(context, redirect) => redirect('xxx')],
// });

/**
 * @see https://github.com/meteor-compat/useraccounts-flow-routing-extra/?tab=readme-ov-file#routes
 */
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
// AccountsTemplates.configureRoute('changePwd');
// AccountsTemplates.configureRoute('enrollAccount');
// AccountsTemplates.configureRoute('forgotPwd');
// AccountsTemplates.configureRoute('resetPwd');
// AccountsTemplates.configureRoute('verifyEmail');
// AccountsTemplates.configureRoute('resendVerificationEmail');

FlowRouter.route('/', {
  action() {
    this.render('Layout', { main: 'Home' });
  },
});
