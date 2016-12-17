import {combineReducers} from 'redux';
import alerts from './alerts';
import auth from './auth';
import options from './options';
import params from './params';
import report from './report';


export default combineReducers({
  alerts,
  auth,
  options,
  params,
  report,
});
