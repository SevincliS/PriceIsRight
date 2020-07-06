import React from 'react';
import {connect} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';

import {createStackNavigator} from '@react-navigation/stack';
import Levels from './pages/Levels';
import Game from './pages/Game';

const Stack = createStackNavigator();

class Router extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator headerMode={'none'}>
          <Stack.Screen name="Levels" component={Levels} />
          <Stack.Screen name="Game" component={Game} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

export default connect(
  mapStateToProps,
  null,
)(Router);
