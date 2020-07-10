import {combineReducers} from 'redux';

import levelReducer from './levelReducer';
import userLevelsReducer from './userLevelsReducer';
import themeReducer from './themeReducer';
import preferencesReducer from './preferencesReducer';
import consentReducer from './consentReducer';

export default combineReducers({
  level: levelReducer,
  userLevels: userLevelsReducer,
  theme: themeReducer,
  preferences: preferencesReducer,
  consent: consentReducer,
});
