import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './ui/layout';
import './ui/home';

//TODO: Alternative: redirect to some route, which is "Default"
// FlowRouter.route('/',
//   triggersEnter: [(context, redirect) => redirect('xxx')],
// });

FlowRouter.route('/', {
  action() {
    this.render('Layout', { main: 'Home' });
  },
});
