import {combineReducers} from 'redux';

import levelReducer from './levelReducer';
import userLevelsReducer from './userLevelsReducer';

export default combineReducers({
  level: levelReducer,
  userLevels: userLevelsReducer,
});
