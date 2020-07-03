import React from 'react';

import {View, TouchableOpacity, Text} from 'react-native';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {navigation} = this.props;
    return (
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('Levels')}>
          <Text>Oyun Başla !</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default HomePage;
