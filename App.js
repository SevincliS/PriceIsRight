/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React from 'react';
import Router from './Router.js';

import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';

import {store, persistor} from './redux/store/store';

class App extends React.Component {
  render() {
    return (
      <>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Router />
          </PersistGate>
        </Provider>
      </>
    );
  }
}

export default App;
