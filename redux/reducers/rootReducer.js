import {combineReducers} from 'redux';

import levelReducer from './levelReducer';

export default combineReducers({
  level: levelReducer,
});
