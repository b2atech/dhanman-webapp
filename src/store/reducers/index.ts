// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import coa from './coa';
import snackbar from './snackbar';
import invoice from './invoice';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  snackbar,
  menu,
  coa,
  invoice
});

export default reducers;
