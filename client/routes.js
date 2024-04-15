import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Web3Accounts } from 'meteor/majus:web3';
import './ui/layout';
import './ui/home';

//TODO: Alternative: redirect to some route, which is "Default"
// FlowRouter.route('/',
//   triggersEnter: [(context, redirect) => redirect('xxx')],
// });

FlowRouter.wait();
Meteor.startup(async () => {
  try {
    await Web3Accounts.init();
  } finally {
    FlowRouter.initialize();
  }
});

FlowRouter.route('/', {
  action() {
    this.render('Layout', { main: 'Home' });
  },
});
