import 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import popper from 'popper.js';
import { BootstrapHelpers } from 'meteor/imajus:bootstrap-helpers';
import '/init';
import './api';
import './routes';

global.Popper = popper; // fixes some issues with Popper and Meteor
BootstrapHelpers.forBootstrap4 = true;
